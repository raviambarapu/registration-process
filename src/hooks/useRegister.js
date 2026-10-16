import { useState, useCallback } from "react";
import { registerUser } from "../services/api.js";

export default function useRegister() {
  const [error, setError] = useState("");

  const submit = useCallback(async (values) => {
    setError("");
    try {
      return await registerUser(values);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return { submit, error, clearError: () => setError("") };
}
