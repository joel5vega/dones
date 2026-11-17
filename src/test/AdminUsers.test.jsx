import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminUsers from "../pages/Profile/AdminUsers";

function renderAdmin(profiles) {
  return render(
    <MemoryRouter>
      <AdminUsers profiles={profiles} />
    </MemoryRouter>
  );
}

describe("AdminUsers", () => {
  it("no crashea si profiles es undefined", () => {
    expect(() => renderAdmin(undefined)).not.toThrow();
  });

  it("no crashea si profiles es []", () => {
    renderAdmin([]);
    expect(screen.getByText("Lista")).toBeInTheDocument();
  });

  it("renderiza usuarios cuando hay datos", () => {
    renderAdmin([
      { uid: "1", name: "Ana", email: "a@a.com", resultado: { Fe: 10, id: "2024-01-01" } },
    ]);
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("agrupa por don principal cuando hay empate", async () => {
    const user = userEvent.setup();
    renderAdmin([
      { uid: "1", name: "Ana", resultado: { Fe: 10, Amor: 10 } },
      { uid: "2", name: "Luis", resultado: { Fe: 8 } },
    ]);

    await user.click(screen.getByRole("tab", { name: "Por don principal" }));

    const feButton = screen.getByRole("button", { name: /Fe/ });
    const amorButton = screen.getByRole("button", { name: /Amor/ });

    expect(feButton).toHaveTextContent("2");
    expect(amorButton).toHaveTextContent("1");
  });
});