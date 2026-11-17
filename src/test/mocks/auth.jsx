import { vi } from "vitest";

export function mockAuth({ user = null, profile = null, loading = false } = {}) {
  return {
    user,
    profile,
    loading,
    isAdmin: Boolean(profile?.admin),
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
    patchProfile: vi.fn(),
  };
}

export const userWithResult = {
  uid: "uid-123",
  displayName: "Ana Test",
  email: "ana@test.com",
  photoURL: null,
};

export const profileWithResult = {
  uid: "uid-123",
  name: "Ana Test",
  email: "ana@test.com",
  resultado: { id: "2024-01-01", Fe: 10, Amor: 8 },
};

export const userNoResult = { ...userWithResult, uid: "uid-456" };
export const profileNoResult = {
  uid: "uid-456",
  name: "Luis Test",
  email: "luis@test.com",
};

export const adminProfile = {
  ...profileWithResult,
  uid: "admin-1",
  admin: true,
};