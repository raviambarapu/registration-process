import "dotenv/config";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import pg from "pg";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const app = express();
const port = Number(process.env.API_PORT) || 3001;
const jwtSecret = process.env.JWT_SECRET;
const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.");
}
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

app.use(express.json({ limit: "20kb" }));

function publicMember(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    course: row.course,
    registeredAt: row.registered_at,
    loginCount: row.login_count,
    lastLoginAt: row.last_login_at,
  };
}

function hasFields(body, fields) {
  return (
    body !== null &&
    typeof body === "object" &&
    fields.every((field) => typeof body[field] === "string" && body[field].trim())
  );
}

function authenticate(req, res, next) {
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    return res.status(401).json({ error: "Please log in to view member activity." });
  }

  try {
    req.auth = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    return next();
  } catch {
    return res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}

app.get(
  "/api/health",
  asyncHandler(async (_req, res) => {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  })
);

app.post(
  "/api/auth/register",
  asyncHandler(async (req, res) => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dob",
      "gender",
      "course",
      "password",
    ];
    if (!hasFields(req.body, required)) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const phone = req.body.phone.trim();
    const dob = req.body.dob;
    const gender = req.body.gender;
    const course = req.body.course;

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (!/^[A-Za-z\s]{2,30}$/.test(firstName) || !/^[A-Za-z\s]{1,30}$/.test(lastName)) {
      return res.status(400).json({ error: "Enter a valid first and last name." });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ error: "Enter a valid 10-digit Indian mobile number." });
    }
    if (!["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ error: "Select a valid gender." });
    }
    if (!["frontend", "fullstack", "data", "python"].includes(course)) {
      return res.status(400).json({ error: "Select a valid course." });
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(dob) ||
      !Number.isFinite(Date.parse(dob)) ||
      new Date(dob).toISOString().slice(0, 10) !== dob
    ) {
      return res.status(400).json({ error: "Enter a valid date of birth." });
    }
    const adultCutoff = new Date();
    adultCutoff.setUTCFullYear(adultCutoff.getUTCFullYear() - 18);
    if (new Date(`${dob}T00:00:00Z`) > adultCutoff) {
      return res.status(400).json({ error: "You must be at least 18 years old." });
    }
    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return res.status(400).json({ error: "Password does not meet the security requirements." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    try {
      const { rows } = await pool.query(
        `INSERT INTO members
          (first_name, last_name, email, phone, date_of_birth, gender, course, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, first_name, last_name, email, course, registered_at, login_count, last_login_at`,
        [firstName, lastName, email, phone, dob, gender, course, passwordHash]
      );
      return res.status(201).json({ user: publicMember(rows[0]) });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          error: "An account with this email already exists. Please log in.",
        });
      }
      throw error;
    }
  })
);

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    if (!hasFields(req.body, ["email", "password"])) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const email = req.body.email.trim().toLowerCase();
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, course, password_hash
       FROM members WHERE email = $1`,
      [email]
    );
    const member = rows[0];
    if (!member || !(await bcrypt.compare(req.body.password, member.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const { rows: updatedRows } = await pool.query(
      `UPDATE members
       SET login_count = login_count + 1, last_login_at = NOW()
       WHERE id = $1
       RETURNING id, first_name, last_name, email, course, registered_at, login_count, last_login_at`,
      [member.id]
    );
    const user = publicMember(updatedRows[0]);
    const token = jwt.sign({ memberId: user.id }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "12h",
    });

    return res.json({ user, token });
  })
);

app.get(
  "/api/members",
  authenticate,
  asyncHandler(async (_req, res) => {
    const [{ rows: memberRows }, { rows: totalsRows }] = await Promise.all([
      pool.query(
        `SELECT id, first_name, last_name, email, course, registered_at, login_count, last_login_at
         FROM members ORDER BY registered_at DESC`
      ),
      pool.query(
        `SELECT COUNT(*)::INTEGER AS registered_members,
                COALESCE(SUM(login_count), 0)::INTEGER AS successful_logins
         FROM members`
      ),
    ]);
    return res.json({
      members: memberRows.map(publicMember),
      totals: {
        registeredMembers: totalsRows[0].registered_members,
        successfulLogins: totalsRows[0].successful_logins,
      },
    });
  })
);

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

async function start() {
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);
  app.listen(port, () => {
    console.log(`Registration API listening on http://localhost:${port}`);
  });
}

start().catch(async (error) => {
  console.error("Could not start the API:", error);
  await pool.end();
  process.exitCode = 1;
});
