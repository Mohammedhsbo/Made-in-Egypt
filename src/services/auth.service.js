import api from "@/api/axios.base";

export async function loginRequest(payload) {
  return api.post("/auth/login", payload);
}

export async function meRequest() {
  return api.get("/auth/me");
}

export async function forgotPasswordRequest(payload) {
  const rawEmail =
    typeof payload === "string" ? payload : payload?.email;
  const email =
    typeof rawEmail === "string" ? rawEmail.trim() : "";

  return api.post("/auth/forgot-password", { email });
}

export async function verifyOtpRequest(payload) {
  return api.post("/auth/verify-otp", payload);
}

export async function resetPasswordRequest(payload) {
  return api.post("/auth/reset-password", payload);
}
