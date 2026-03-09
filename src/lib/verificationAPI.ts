// frontend/src/lib/verificationAPI.ts
import api from "./api";

export const verificationAPI = {
  // Verify by document upload
  verifyDocument: (formData: FormData) =>
    api.post("/verify/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Verify by transaction hash or credential ID
  verifyByHash: (hash: string) => api.get(`/verify/hash/${hash}`),

  // Verify by share ID (for shared links)
  verifyByShareId: (shareId: string) => api.get(`/verify/share/${shareId}`),

  // Get blockchain status
  getBlockchainStatus: () => api.get("/verify/status"),
};
