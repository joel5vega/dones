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
    vi.clearAllMocks();
  });

  it("sin user → SIEMPRE muestra 'Abrir en navegador' y el botón de Google", async () => {
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
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("enlace no válido → muestra mensaje", async () => {
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

  it("invitación propia → muestra 'Esta es tu propia invitación'", async () => {
    useAuth.mockReturnValue(mockAuth({ user: { uid: "u1" } }));
    usePeerEvaluation.mockReturnValue({
      status: "self",
      invite,
      user: { uid: "u1" },
      authLoading: false,
      answers: [],
    });

    renderEvaluate();
    expect(await screen.findByText("Esta es tu propia invitación")).toBeInTheDocument();
  });

  it("sin código en la URL → muestra 'Enlace incompleto'", async () => {
    useAuth.mockReturnValue(mockAuth());
    usePeerEvaluation.mockReturnValue({
      status: "loading",
      invite: null,
      user: null,
      authLoading: false,
      answers: [],
    });

    render(
      <MemoryRouter initialEntries={["/evaluar/"]}>
        <Routes>
          <Route path="/evaluar" element={<Evaluate />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Enlace incompleto")).toBeInTheDocument();
  });
});