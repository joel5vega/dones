import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockAuth, adminProfile } from "./mocks/auth";

vi.mock("../contexts/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("../services/userService", () => ({
  getAllProfiles: vi.fn(),
  saveRadarImage: vi.fn(),
}));
vi.mock("../components/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loader</div>,
}));
vi.mock("../pages/Profile/AdminUsers", () => ({
  default: vi.fn(({ profiles }) => (
    <div data-testid="admin-users">
      AdminUsers recibió {Array.isArray(profiles) ? profiles.length : "NO-ARRAY"} perfiles
    </div>
  )),
}));
// Evita que ResultCard/refs rompan el test
vi.mock("../pages/Profile/ResultCard", () => ({
  default: () => <div data-testid="result-card">ResultCard</div>,
}));

import { useAuth } from "../contexts/AuthContext";
import { getAllProfiles } from "../services/userService";
import AdminUsers from "../pages/Profile/AdminUsers";
import Profile from "../pages/Profile/Profile";

function renderProfile() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
}

describe("Profile (admin)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pasa profiles={all} a AdminUsers (no users)", async () => {
    getAllProfiles.mockResolvedValue([
      { uid: "1", name: "Ana", resultado: { Fe: 10 } },
      { uid: "2", name: "Luis" },
    ]);
    useAuth.mockReturnValue(
      mockAuth({ user: { uid: "admin-1" }, profile: adminProfile })
    );

    renderProfile();

    // Espera a que AdminUsers se renderice (useEffect resolvió)
    await waitFor(() => {
      expect(screen.getByTestId("admin-users")).toBeInTheDocument();
    });

    const props = AdminUsers.mock.calls.at(-1)[0];
    expect(Array.isArray(props.profiles)).toBe(true);
    expect(props.profiles).toHaveLength(2);
    expect(props.users).toBeUndefined();
  });

  it("AdminUsers no crashea si getAllProfiles falla (defensivo)", async () => {
    getAllProfiles.mockRejectedValue(new Error("boom"));
    useAuth.mockReturnValue(
      mockAuth({ user: { uid: "admin-1" }, profile: adminProfile })
    );

    // No debe lanzar
    renderProfile();

    await waitFor(() => {
      expect(screen.getByTestId("admin-users")).toBeInTheDocument();
    });

    const props = AdminUsers.mock.calls.at(-1)[0];
    expect(props.profiles).toEqual([]);
  });
});