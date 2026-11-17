import { describe, it, expect } from "vitest";
import { toRows, rankGifts, groupByTopGift } from "../utils/adminUsers";

describe("adminUsers helpers", () => {
  it("toRows tolera undefined", () => {
    expect(toRows(undefined)).toEqual([]);
  });

  it("toRows filtra nulls", () => {
    const rows = toRows([null, { uid: "1", name: "Ana" }]);
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Ana");
  });

  it("rankGifts descarta id y no numéricos", () => {
    const r = rankGifts({ id: "x", Fe: 10, Amor: 8, foo: "bar" });
    expect(r).toEqual([
      { name: "Fe", score: 10 },
      { name: "Amor", score: 8 },
    ]);
  });

  it("groupByTopGift agrupa empates", () => {
    const rows = toRows([
      { uid: "1", name: "Ana", resultado: { Fe: 10, Amor: 10 } },
      { uid: "2", name: "Luis", resultado: { Fe: 8 } },
    ]);
    const groups = groupByTopGift(rows);
    const fe = groups.find((g) => g.gift === "Fe");
    expect(fe.count).toBe(2); // Ana (empate) + Luis
  });
});