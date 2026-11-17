import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { mockAuth } from "./mocks/auth";

vi.mock("../contexts/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("../hooks/usePeerEvaluation", () => ({ usePeerEvaluation: vi.fn() }));
vi.mock("../components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loader</div>,
}));

import { useAuth } from "../contexts/AuthContext";
import { usePeerEvaluation } from "../hooks/usePeerEvaluation";
import Evaluate from "../pages/Peer/Evaluate";

const invite = { ownerName: "Juan Pérez", ownerPhoto: null, questionIds: [1, 2, 3] };

function renderEvaluate(path = "/evaluar/abc123") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/evaluar/:code" element={<Evaluate />} />
        <Route path="/entrar" element={<div>ENTRAR</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Evaluate", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("WebView Facebook sin user → muestra 'Abrir en navegador' (sin link a /entrar)", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 FBAN/FBIOS",
      configurable: true,
    });

    useAuth.mockReturnValue(mockAuth());
    usePeerEvaluation.mockReturnValue({
      status: "ready",
      invite,
      user: null,
      authLoading: false,
      answers: [],
    });

    renderEvaluate();

    const link = await screen.findByText("Abrir en navegador");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toContain("google.com/url?q=");
    expect(screen.queryByText("Iniciar sesión y continuar")).not.toBeInTheDocument();
  });

  it("Navegador normal sin user → muestra botón de Google", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 Chrome/120",
      configurable: true,
    });

    useAuth.mockReturnValue(mockAuth());
    usePeerEvaluation.mockReturnValue({
      status: "ready",
      invite,
      user: null,
      authLoading: false,
      answers: [],
    });

    renderEvaluate();
    expect(await screen.findByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByText("Abrir en navegador")).not.toBeInTheDocument();
  });

  it("enlace no válido → muestra mensaje", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 Chrome/120",
      configurable: true,
    });

    useAuth.mockReturnValue(mockAuth());
    usePeerEvaluation.mockReturnValue({
      status: "notFound",
      invite: null,
      user: null,
      authLoading: false,
      answers: [],
    });

    renderEvaluate();
    expect(await screen.findByText("Enlace no válido")).toBeInTheDocument();
  });
});