import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

// Mock de Firebase Auth
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("../config/firebase", () => ({ auth: {} }));
vi.mock("../services/userService", () => ({
  getOrCreateProfile: vi.fn(),
}));

import { onAuthStateChanged } from "firebase/auth";
import { getOrCreateProfile } from "../services/userService";

// Componente sonda para leer el contexto
function Probe() {
  const { user, profile, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.uid ?? "none"}</span>
      <span data-testid="resultado">{String(!!profile?.resultado)}</span>
    </div>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loading=true mientras se carga el perfil, luego false", async () => {
    let resolveProfile;
    getOrCreateProfile.mockReturnValue(
      new Promise((res) => { resolveProfile = res; })
    );

    // onAuthStateChanged llama al callback con un user
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb({ uid: "u1", email: "a@a.com", displayName: "Ana" });
      return () => {};
    });

    renderProvider();

    // Mientras el perfil no resuelve, loading debe ser true
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("true");
    });
    expect(screen.getByTestId("user").textContent).toBe("u1");

    // Resolvemos el perfil con resultado
    resolveProfile({ uid: "u1", resultado: { Fe: 10 } });

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("resultado").textContent).toBe("true");
  });

  it("si getOrCreateProfile falla, loading baja a false y profile=null", async () => {
    getOrCreateProfile.mockRejectedValue(new Error("boom"));
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb({ uid: "u2" });
      return () => {};
    });

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("resultado").textContent).toBe("false");
  });

  it("sin user → loading=false, user=none, profile=null", async () => {
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return () => {};
    });

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("none");
  });
});