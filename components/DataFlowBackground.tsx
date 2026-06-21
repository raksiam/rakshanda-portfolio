"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";

type Node = {
  id: number;
  x: number;
  y: number;
  radius: number;
  accent: "slate" | "blue" | "purple";
};

type Connection = {
  from: Node;
  to: Node;
};

const NODE_COUNT = 42;

// Seeded values keep the server and client output identical.
function seededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function createNetwork() {
  const random = seededRandom(8147);
  const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, id) => {
    const accentRoll = random();

    return {
      id,
      x: 3 + random() * 94,
      y: 4 + random() * 92,
      radius: 1.2 + random() * 1.25,
      accent:
        accentRoll > 0.88
          ? "purple"
          : accentRoll > 0.68
            ? "blue"
            : "slate",
    };
  });

  const connections: Connection[] = [];

  for (const node of nodes) {
    const nearest = nodes
      .filter((candidate) => candidate.id !== node.id)
      .map((candidate) => ({
        node: candidate,
        distance: Math.hypot(node.x - candidate.x, node.y - candidate.y),
      }))
      .filter(({ distance }) => distance < 22)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    for (const { node: neighbor } of nearest) {
      const alreadyConnected = connections.some(
        ({ from, to }) =>
          (from.id === node.id && to.id === neighbor.id) ||
          (from.id === neighbor.id && to.id === node.id),
      );

      if (!alreadyConnected) connections.push({ from: node, to: neighbor });
    }
  }

  return { nodes, connections };
}

const NETWORK = createNetwork();

const PACKET_CONNECTIONS = NETWORK.connections
  .filter((_, index) => index % 5 === 1)
  .slice(0, 10);

const ARCHITECTURE = [
  { stage: "SOURCES", tools: ["AWS", "SQL", "PYTHON"] },
  { stage: "RAW", tools: ["ETL", "AIRFLOW"] },
  { stage: "STAGING", tools: ["DBT", "DATA QUALITY"] },
  { stage: "CURATED", tools: ["SNOWFLAKE", "DATA LINEAGE"] },
  { stage: "MARTS", tools: ["WAREHOUSE", "ORCHESTRATION"] },
  { stage: "ANALYTICS", tools: ["ANALYTICS"] },
] as const;

const nodeColor = {
  slate: "#94a3b8",
  blue: "#60a5fa",
  purple: "#a78bfa",
} as const;

type SpotlightStyle = CSSProperties & {
  "--mouse-x": string;
  "--mouse-y": string;
};

export default function DataFlowBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateSpotlight = (event: PointerEvent) => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        rootRef.current?.style.setProperty("--mouse-x", `${event.clientX}px`);
        rootRef.current?.style.setProperty("--mouse-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", updateSpotlight, { passive: true });

    return () => {
      window.removeEventListener("pointermove", updateSpotlight);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const spotlightStyle: SpotlightStyle = {
    "--mouse-x": "50vw",
    "--mouse-y": "45vh",
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={spotlightStyle}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-zinc-950"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id="data-flow-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.11" />
            <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="active-data-flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <marker
            id="flow-arrow"
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="3.5"
            markerHeight="3.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#93c5fd" opacity="0.22" />
          </marker>
        </defs>

        <motion.g
          initial={{ x: 0, y: 0 }}
          animate={
            prefersReducedMotion
              ? undefined
              : { x: [0, 1.15, -0.55, 0], y: [0, -0.8, 0.95, 0] }
          }
          transition={{
            duration: 30,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {NETWORK.connections.map(({ from, to }, index) => (
            <line
              key={`${from.id}-${to.id}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#data-flow-line)"
              strokeWidth="0.075"
              vectorEffect="non-scaling-stroke"
              markerEnd={index % 7 === 2 ? "url(#flow-arrow)" : undefined}
            />
          ))}

          {NETWORK.connections
            .filter((_, index) => index % 8 === 3)
            .map(({ from, to }, index) => (
              <motion.line
                key={`active-${from.id}-${to.id}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#active-data-flow)"
                strokeWidth="0.16"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                animate={
                  prefersReducedMotion
                    ? { pathLength: 1, opacity: 0.12 }
                    : {
                        pathLength: [0, 0.55, 0.55, 0],
                        pathOffset: [0, 0, 0.45, 1],
                        opacity: [0, 0.34, 0.34, 0],
                      }
                }
                transition={{
                  duration: 7.5 + (index % 3) * 1.8,
                  delay: index * 1.1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            ))}

          {NETWORK.nodes.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.radius / 10}
              fill={nodeColor[node.accent]}
              opacity={node.accent === "slate" ? 0.24 : 0.38}
            />
          ))}

          {PACKET_CONNECTIONS.map(({ from, to }, index) => (
            <motion.circle
              key={`packet-${from.id}-${to.id}`}
              cx={from.x}
              cy={from.y}
              r="0.11"
              fill={index % 3 === 0 ? "#a78bfa" : "#60a5fa"}
              initial={{ opacity: 0 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      cx: [
                        from.x,
                        from.x + (to.x - from.x) * 0.12,
                        from.x + (to.x - from.x) * 0.86,
                        to.x,
                      ],
                      cy: [
                        from.y,
                        from.y + (to.y - from.y) * 0.12,
                        from.y + (to.y - from.y) * 0.86,
                        to.y,
                      ],
                      opacity: [0, 0.44, 0.44, 0],
                    }
              }
              transition={{
                duration: 8.5 + (index % 4) * 1.8,
                delay: index * 1.25,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 3 + (index % 3) * 1.5,
                times: [0, 0.12, 0.86, 1],
              }}
            />
          ))}
        </motion.g>
      </svg>

      <div className="absolute inset-x-[3vw] bottom-[14%] top-[16%] min-w-[700px] overflow-hidden rounded-[28px] border border-slate-300/[0.035] bg-gradient-to-b from-slate-300/[0.018] via-transparent to-blue-400/[0.018] shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_24px_80px_rgba(0,0,0,0.16)] max-sm:left-1/2 max-sm:right-auto max-sm:w-[760px] max-sm:-translate-x-1/2">
        <div className="absolute inset-x-[4%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />
        <div className="absolute inset-x-[7%] top-1/2 h-8 -translate-y-1/2 rounded-full bg-blue-400/[0.018] blur-xl" />

        <motion.div
          className="absolute left-[4%] top-1/2 h-px w-[15%] -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-300/55 to-transparent"
          animate={
            prefersReducedMotion ? undefined : { x: ["-80%", "610%"] }
          }
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />

        <div className="absolute inset-0 grid grid-cols-6">
          {ARCHITECTURE.map((section, index) => (
            <div
              key={section.stage}
              className="relative border-l border-slate-300/[0.035] first:border-l-0"
            >
              <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-slate-300/[0.014] to-transparent" />

              <div className="absolute inset-x-2 top-[15%] text-center font-mono text-[9px] font-semibold tracking-[0.2em] text-slate-100 sm:text-[10px]">
                <span style={{ opacity: 0.16 }}>{section.stage}</span>
              </div>

              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/20 bg-slate-950 shadow-[0_0_18px_rgba(96,165,250,0.1)]" />

              {index < ARCHITECTURE.length - 1 && (
                <span
                  className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 font-mono text-[10px] text-blue-200"
                  style={{ opacity: 0.13 }}
                >
                  →
                </span>
              )}

              <div className="absolute inset-x-2 top-[62%] flex flex-col items-center gap-3 text-center font-mono text-[8px] font-medium tracking-[0.17em] text-slate-200 sm:text-[9px]">
                {section.tools.map((tool, toolIndex) => (
                  <span
                    key={tool}
                    className="whitespace-nowrap"
                    style={{ opacity: 0.044 + toolIndex * 0.009 }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {Array.from({ length: 4 }, (_, index) => (
          <motion.span
            key={`architecture-packet-${index}`}
            className="absolute left-[8%] top-1/2 z-20 h-1 w-1 -translate-y-1/2 rounded-full bg-blue-200 shadow-[0_0_7px_rgba(147,197,253,0.4)]"
            initial={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    left: ["8%", "14.72%", "83.6%", "92%"],
                    opacity: [0, 0.38, 0.38, 0],
                    scale: [0.7, 1, 1, 0.7],
                  }
            }
            transition={{
              duration: 13 + index * 1.4,
              delay: index * 3.2,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 2.5,
              times: [0, 0.08, 0.9, 1],
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 [backdrop-filter:brightness(1.5)_saturate(1.12)]"
        style={{
          WebkitMaskImage:
            "radial-gradient(460px circle at var(--mouse-x) var(--mouse-y), black, transparent 72%)",
          maskImage:
            "radial-gradient(460px circle at var(--mouse-x) var(--mouse-y), black, transparent 72%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(96,165,250,0.105),rgba(167,139,250,0.03)_38%,transparent_72%)] mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(9,9,11,0.48)_100%)]" />
    </div>
  );
}
