import { describe, expect, it } from "vitest";
import { recommendMinistries, scoreMinistry } from "./ministryMatcher";

const ministry = {
  id: "care",
  name: "Acompañamiento",
  scope: "church",
  gifts: ["Misericordia", "Pastoreo"],
  interests: ["Familias"],
  skills: ["Escucha"],
  causes: ["Soledad y aislamiento"],
};

describe("ministryMatcher", () => {
  it("does not recommend ministries without discernment data or test results", () => {
    expect(recommendMinistries([ministry], { context: "both" }, {})).toEqual([]);
  });

  it("explains matches from interests, skills, causes and spiritual gifts", () => {
    const result = scoreMinistry(ministry, {
      interests: ["Familias"],
      skills: ["Escucha"],
      causes: ["Soledad y aislamiento"],
      context: "church",
    }, { Misericordia: 90, Pastoreo: 80, id: "2026-11-19" });
    expect(result.matchScore).toBe(94);
    expect(result.reasons).toHaveLength(5);
  });

  it("returns recommendations ordered by match", () => {
    const result = recommendMinistries([ministry], { interests: ["Familias"] }, {});
    expect(result[0].id).toBe("care");
    expect(result[0].matchScore).toBeGreaterThan(0);
  });
});
