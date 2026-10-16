import { useState, useCallback } from "react";
import { loginUser } from "../services/api.js";

export default function useLogin() {
  const [error, setError] = useState("");

  const submit = useCallback(async (values) => {
    setError("");
    try {
      return await loginUser(values);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return { submit, error, clearError: () => setError("") };
}
