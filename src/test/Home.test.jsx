import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockAuth, userWithResult, profileWithResult, userNoResult, profileNoResult } from "./mocks/auth";

vi.mock("../contexts/AuthContext", () => ({ useAuth: vi.fn() }));

import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home/Home";

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe("Home", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sin test → 'Hacer el Test'", () => {
    useAuth.mockReturnValue(mockAuth({ user: userNoResult, profile: profileNoResult }));
    renderHome();
    expect(screen.getByText("Hacer el Test")).toBeInTheDocument();
  });

  it("con test → 'Repetir el Test'", () => {
    useAuth.mockReturnValue(mockAuth({ user: userWithResult, profile: profileWithResult }));
    renderHome();
    expect(screen.getByText("Repetir el Test")).toBeInTheDocument();
  });

  it("sin user → 'Hacer el Test' (sin 'Mi Perfil')", () => {
    useAuth.mockReturnValue(mockAuth());
    renderHome();
    expect(screen.getByText("Hacer el Test")).toBeInTheDocument();
    expect(screen.queryByText("Mi Perfil")).not.toBeInTheDocument();
  });

  it("con user → muestra 'Mi Perfil'", () => {
    useAuth.mockReturnValue(mockAuth({ user: userWithResult, profile: profileWithResult }));
    renderHome();
    expect(screen.getByText("Mi Perfil")).toBeInTheDocument();
  });
});