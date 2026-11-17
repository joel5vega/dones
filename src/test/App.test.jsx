import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Mockea Firebase para que no intente conectar
vi.mock("../config/firebase", () => ({ auth: {}, db: {} }));
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth, cb) => { cb(null); return () => {}; }),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("../services/userService", () => ({
  getOrCreateProfile: vi.fn(),
  getAllProfiles: vi.fn().mockResolvedValue([]),
  saveRadarImage: vi.fn(),
}));

import App from "../App";

describe("App (smoke test)", () => {
  it("monta sin crashear y renderiza Home", () => {
    expect(() => render(<App />)).not.toThrow();
  });
});