import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import {
  mockAuth,
  userWithResult,
  profileWithResult,
  userNoResult,
  profileNoResult,
} from "./mocks/auth";

vi.mock("../contexts/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("../components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loader</div>,
}));

import { useAuth } from "../contexts/AuthContext";
import RedirectAfterLogin from "../components/RedirectAfterLogin";

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/entrar"]}>
      <Routes>
        <Route path="/entrar" element={<RedirectAfterLogin />} />
        <Route path="/" element={<div>HOME</div>} />
        <Route path="/test" element={<div>TEST</div>} />
        <Route path="/perfil" element={<div>PERFIL</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RedirectAfterLogin", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("sin user → redirige a /", () => {
    useAuth.mockReturnValue(mockAuth());
    renderWithRouter();
    expect(screen.getByText("HOME")).toBeInTheDocument();
  });

  it("user sin resultado → redirige a /test", () => {
    useAuth.mockReturnValue(mockAuth({ user: userNoResult, profile: profileNoResult }));
    renderWithRouter();
    expect(screen.getByText("TEST")).toBeInTheDocument();
  });

  it("user con resultado → redirige a /perfil", () => {
    useAuth.mockReturnValue(mockAuth({ user: userWithResult, profile: profileWithResult }));
    renderWithRouter();
    expect(screen.getByText("PERFIL")).toBeInTheDocument();
  });

  it("loading → muestra Loader", () => {
    useAuth.mockReturnValue(mockAuth({ loading: true }));
    renderWithRouter();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});