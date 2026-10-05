import type { AuthResponse } from "@/features/auth/types";
import type { LoginValues, RegisterValues } from "@/features/auth/schemas/auth";
async function postAuth(path: "login" | "register", values: LoginValues | RegisterValues): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`/api/v1/auth/${path}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(values) });
  } catch {
    throw new Error("We can't reach the sign-in service right now. Check that the API is running and try again.");
  }
  const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
  if (!response.ok) {
    if (response.status === 401) throw new Error("That email and password didn’t match. Check them and try again.");
    if (response.status >= 500) throw new Error("The sign-in service is temporarily unavailable. Please try again in a moment.");
    throw new Error(body?.message || body?.error || `Sign-in didn’t complete (HTTP ${response.status}). Please try again.`);
  }
  if (!body || !("token" in body) || !body.token || !("user" in body) || !body.user) throw new Error("The sign-in service returned an incomplete session. Please try again.");
  return body as AuthResponse;
}
export const signIn = (values: LoginValues) => postAuth("login", values);
export const signUp = (values: RegisterValues) => postAuth("register", values);
