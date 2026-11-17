import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { mockAuth } from "./mocks/auth";

vi.mock("../contexts/AuthContext", () => ({ useAuth: vi.fn() }));

import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";

function renderNav() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<NavBar />} />
        <Route path="/entrar" element={<div>ENTRAR</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("NavBar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("click en Google → signInWithGoogle + navega a /entrar", async () => {
    const signInWithGoogle = vi.fn().mockResolvedValue(undefined);
    useAuth.mockReturnValue({ ...mockAuth(), signInWithGoogle });

    renderNav();

    // El botón de Google tiene aria-label o texto "Iniciar sesión"
    const btn = await screen.findByRole("button", { name: /iniciar sesión/i });
    await userEvent.click(btn);

    await waitFor(() => {
      expect(signInWithGoogle).toHaveBeenCalledTimes(1);
      expect(screen.getByText("ENTRAR")).toBeInTheDocument();
    });
  });
});