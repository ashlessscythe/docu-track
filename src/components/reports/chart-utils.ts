"use client";

import { useEffect, useState } from "react";

export type ChartBreakpoint = "sm" | "md" | "lg";

export function useChartBreakpoint(): ChartBreakpoint {
  const [breakpoint, setBreakpoint] = useState<ChartBreakpoint>("lg");

  useEffect(() => {
    const mqSm = window.matchMedia("(max-width: 640px)");
    const mqMd = window.matchMedia("(max-width: 1024px)");

    const update = () => {
      if (mqSm.matches) setBreakpoint("sm");
      else if (mqMd.matches) setBreakpoint("md");
      else setBreakpoint("lg");
    };

    update();
    mqSm.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
    };
  }, []);

  return breakpoint;
}

export function chartTickSize(bp: ChartBreakpoint): number {
  return bp === "sm" ? 10 : bp === "md" ? 11 : 12;
}

export function chartMargins(
  bp: ChartBreakpoint,
  overrides?: Partial<{ top: number; right: number; left: number; bottom: number }>
) {
  const base =
    bp === "sm"
      ? { top: 8, right: 8, left: 0, bottom: 0 }
      : bp === "md"
        ? { top: 12, right: 16, left: 8, bottom: 4 }
        : { top: 20, right: 30, left: 20, bottom: 5 };
  return { ...base, ...overrides };
}

export function legendProps(bp: ChartBreakpoint) {
  return {
    wrapperStyle: {
      fontSize: chartTickSize(bp),
      lineHeight: 1.5,
      paddingTop: bp === "sm" ? 8 : 4,
    },
    verticalAlign: "bottom" as const,
    iconSize: bp === "sm" ? 8 : 10,
  };
}

export function categoryAxisProps(bp: ChartBreakpoint) {
  const angled = bp === "sm";
  return {
    tick: { fontSize: chartTickSize(bp) },
    angle: angled ? -40 : 0,
    textAnchor: angled ? "end" : ("middle" as const),
    height: angled ? 72 : bp === "md" ? 50 : 40,
    interval: 0 as const,
  };
}

export function pieRadii(bp: ChartBreakpoint) {
  switch (bp) {
    case "sm":
      return { inner: 38, outer: 62 };
    case "md":
      return { inner: 48, outer: 78 };
    default:
      return { inner: 60, outer: 100 };
  }
}

export function chartHeight(
  bp: ChartBreakpoint,
  base: number
): number {
  return bp === "sm" ? Math.max(base - 20, 240) : base;
}
