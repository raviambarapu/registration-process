# PostgreSQL API setup

The API stores registrations, hashed passwords, and successful login counts in
PostgreSQL. It creates the `members` table at startup if it does not exist.

1. Install and start PostgreSQL, then create a database named `registration_portal`.
2. Copy `.env.example` to `.env` in the project root. Set `DATABASE_URL` to your
   PostgreSQL connection string and replace `JWT_SECRET` with a private random
   value that is at least 32 characters long. Do not commit `.env`.
3. Run `npm install`.
4. In one terminal run `npm run server`.
5. In another terminal run `npm run dev`.
6. Open the local Vite address, register an account, then log in. The dashboard
   member totals and roster are loaded from PostgreSQL.

The frontend uses Vite's `/api` proxy during development. In production, route
`/api` to the backend on the same origin, or configure a public API URL and
allow that frontend origin in your deployment. `VITE_API_URL` must never
contain database credentials or other secrets.
