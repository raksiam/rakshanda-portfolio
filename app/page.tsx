"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import DataFlowBackground from "@/components/DataFlowBackground";

const navigation = [
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;

const projectContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const projectCard: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    filter: "blur(12px)",
    clipPath: "inset(8% 5% 8% 5% round 32px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    clipPath: "inset(0% 0% 0% 0% round 24px)",
    transition: {
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const { scrollY, scrollYProgress } = useScroll({ container: pageRef });
  const { scrollYProgress: heroProgress } = useScroll({
    container: pageRef,
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: aboutProgress } = useScroll({
    container: pageRef,
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: projectsProgress } = useScroll({
    container: pageRef,
    target: projectsRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: experienceProgress } = useScroll({
    container: pageRef,
    target: experienceRef,
    offset: ["start 85%", "end 35%"],
  });
  const { scrollYProgress: contactProgress } = useScroll({
    container: pageRef,
    target: contactRef,
    offset: ["start end", "center center"],
  });

  const heroY = useTransform(heroProgress, [0, 1], [0, -130]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(heroProgress, [0, 0.72, 1], [1, 0.8, 0]);

  const aboutScale = useTransform(
    aboutProgress,
    [0, 0.35, 0.72, 1],
    [0.86, 1, 1, 0.96],
  );
  const aboutOpacity = useTransform(
    aboutProgress,
    [0, 0.2, 0.72, 1],
    [0, 1, 1, 0.2],
  );
  const aboutBlur = useTransform(
    aboutProgress,
    [0, 0.28, 0.78, 1],
    ["blur(14px)", "blur(0px)", "blur(0px)", "blur(8px)"],
  );
  const aboutClip = useTransform(
    aboutProgress,
    [0, 0.3, 1],
    [
      "inset(8% 7% 8% 7% round 36px)",
      "inset(0% 0% 0% 0% round 0px)",
      "inset(0% 0% 0% 0% round 0px)",
    ],
  );

  const projectsHeadingScale = useTransform(
    projectsProgress,
    [0, 0.32, 1],
    [0.9, 1, 0.97],
  );
  const projectsHeadingOpacity = useTransform(
    projectsProgress,
    [0, 0.22, 0.8, 1],
    [0, 1, 1, 0.4],
  );
  const timelineScale = useTransform(experienceProgress, [0, 1], [0, 1]);
  const contactScale = useTransform(contactProgress, [0, 1], [0.84, 1]);
  const contactOpacity = useTransform(contactProgress, [0, 0.55, 1], [0, 0.6, 1]);
  const contactBlur = useTransform(
    contactProgress,
    [0, 0.7, 1],
    ["blur(16px)", "blur(4px)", "blur(0px)"],
  );

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 48);
  });

  useEffect(() => {
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      {
        root: pageRef.current,
        rootMargin: "-30% 0px -52% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const reducedMotionStyle = prefersReducedMotion
    ? { y: 0, scale: 1, opacity: 1 }
    : undefined;

  return (
    <main
      ref={pageRef}
      className="relative h-[100svh] snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-y-contain scroll-smooth bg-transparent text-white [scrollbar-width:none] selection:bg-cyan-300/20 selection:text-cyan-50 [&::-webkit-scrollbar]:hidden"
    >
      <DataFlowBackground />

      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-blue-400 via-slate-100 to-violet-400"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        aria-label="Primary navigation"
        className="fixed left-1/2 top-0 z-[60] flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/[0.08] bg-zinc-950/60 px-3 backdrop-blur-xl backdrop-saturate-150 sm:w-[calc(100%-3rem)] sm:px-4"
        animate={{
          y: isScrolled ? 10 : 18,
          height: isScrolled ? 50 : 58,
          boxShadow: isScrolled
            ? "0 10px 35px rgba(0,0,0,0.16)"
            : "0 12px 45px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <a
          href="#home"
          aria-label="Back to top"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-xs font-semibold tracking-[-0.02em] text-zinc-100 transition-colors duration-300 hover:bg-white/[0.07]"
        >
          RH
        </a>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {navigation.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                className={`relative rounded-lg px-2.5 py-2 text-[11px] font-medium tracking-wide transition-colors duration-300 sm:px-3.5 sm:text-xs ${
                  isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-section"
                    className="absolute inset-0 -z-10 rounded-lg border border-white/[0.06] bg-white/[0.055]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </div>
      </motion.nav>

      <section
        ref={heroRef}
        id="home"
        className="relative z-20 mx-auto flex h-[100svh] w-full max-w-6xl snap-start snap-always items-center overflow-hidden bg-[radial-gradient(circle_at_18%_38%,rgba(34,211,238,0.075),transparent_38%)] px-6 pb-10 pt-28 sm:px-10 lg:px-12"
      >
        <motion.div
          className="max-w-5xl"
          style={
            reducedMotionStyle ?? {
              y: heroY,
              scale: heroScale,
              opacity: heroOpacity,
            }
          }
        >
          <p className="mb-5 font-mono text-sm tracking-[0.18em] text-cyan-200/70 sm:text-base">
            Data Engineer → AI Engineer
          </p>

          <h1 className="mb-8 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-5xl font-semibold tracking-[-0.055em] text-transparent drop-shadow-[0_0_32px_rgba(34,211,238,0.12)] sm:text-7xl md:text-8xl">
            Rakshanda Hedaoo
          </h1>

          <p className="mb-7 max-w-4xl text-xl leading-relaxed tracking-[-0.02em] text-zinc-300 sm:text-2xl md:text-3xl">
            Data Engineer with 4.5+ years of experience building scalable data
            platforms, automation workflows, and cloud-native data solutions.
          </p>

          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-zinc-500 sm:text-xl">
            Currently exploring AI Engineering, LLM applications, and
            intelligent systems.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_35px_rgba(255,255,255,0.12)]"
            >
              View Projects
            </a>
            <a
              href="https://github.com/raksiam"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/[0.1] bg-white/[0.025] px-6 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rakshanda-hedaoo-94971b185"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/[0.1] bg-white/[0.025] px-6 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </section>

      <section
        ref={aboutRef}
        id="about"
        className="relative z-20 mx-auto flex h-[100svh] w-full max-w-6xl snap-start snap-always items-center overflow-hidden bg-[radial-gradient(circle_at_78%_50%,rgba(59,130,246,0.065),transparent_38%)] px-6 py-24 sm:px-10 lg:px-12"
      >
        <motion.div
          className="grid w-full gap-12 border-t border-white/[0.08] pt-14 md:grid-cols-[0.7fr_1.3fr] md:gap-20"
          style={
            reducedMotionStyle ?? {
              scale: aboutScale,
              opacity: aboutOpacity,
              filter: aboutBlur,
              clipPath: aboutClip,
            }
          }
        >
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan-200/60">
              01 / Profile
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              About
            </h2>
          </div>

          <div className="space-y-8">
            <p className="text-xl leading-relaxed tracking-[-0.018em] text-zinc-300 sm:text-2xl">
              I&apos;m a Data Engineer focused on building reliable data
              platforms and scalable data infrastructure.
            </p>
            <p className="text-xl leading-relaxed tracking-[-0.018em] text-zinc-400 sm:text-2xl">
              Currently exploring AI Engineering, LLM-powered applications,
              and intelligent systems.
            </p>
          </div>
        </motion.div>
      </section>

      <section
        ref={projectsRef}
        id="projects"
        className="relative z-20 mx-auto flex h-[100svh] w-full max-w-6xl snap-start snap-always flex-col justify-center overflow-y-auto bg-[radial-gradient(circle_at_50%_55%,rgba(139,92,246,0.07),transparent_46%)] px-6 py-20 [scrollbar-width:none] sm:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        <motion.div
          className="mb-14 flex items-end justify-between border-t border-white/[0.08] pt-14"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  scale: projectsHeadingScale,
                  opacity: projectsHeadingOpacity,
                }
          }
        >
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-violet-200/60">
              02 / Selected projects
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Featured Work
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={prefersReducedMotion ? undefined : projectContainer}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.article
            variants={projectCard}
            whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.008 }}
            className="group relative overflow-hidden rounded-3xl border border-cyan-200/[0.11] bg-zinc-950/55 p-7 backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-cyan-300/30 hover:shadow-[0_20px_70px_rgba(34,211,238,0.1)] sm:p-9"
          >
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              AI / LLM
            </p>
            <h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-zinc-100 transition-colors duration-300 group-hover:text-white sm:text-3xl">
              NanoGPT From Scratch
            </h3>
            <p className="mb-7 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Built a custom GPT implementation from scratch and integrated
              modern inference workflows, chat capabilities, and image
              generation into a unified AI application.
            </p>
            <div className="mb-8 flex flex-wrap gap-2">
              {["Python", "LLMs", "Inference"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-cyan-200/[0.1] bg-cyan-300/[0.035] px-3 py-1 text-[11px] font-medium text-cyan-100/50"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/raksiam/nano-gpt-scratch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:gap-3 hover:text-white"
            >
              GitHub <span aria-hidden="true">→</span>
            </a>
          </motion.article>

          <motion.article
            variants={projectCard}
            whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.008 }}
            className="group relative overflow-hidden rounded-3xl border border-violet-200/[0.11] bg-zinc-950/55 p-7 backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-violet-300/30 hover:shadow-[0_20px_70px_rgba(168,85,247,0.1)] sm:p-9"
          >
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              Product Engineering
            </p>
            <h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-zinc-100 transition-colors duration-300 group-hover:text-white sm:text-3xl">
              RideSmart
            </h3>
            <p className="mb-7 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Built a ride aggregation platform that compares pricing, ETA,
              and service availability across transportation providers.
            </p>
            <div className="mb-8 flex flex-wrap gap-2">
              {["APIs", "Aggregation", "Product"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-violet-200/[0.1] bg-violet-300/[0.035] px-3 py-1 text-[11px] font-medium text-violet-100/50"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/raksiam/RideSmart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:gap-3 hover:text-white"
            >
              GitHub <span aria-hidden="true">→</span>
            </a>
          </motion.article>
        </motion.div>
      </section>

      <section
        ref={experienceRef}
        id="experience"
        className="relative z-20 mx-auto flex h-[100svh] w-full max-w-6xl snap-start snap-always flex-col justify-center overflow-y-auto bg-[radial-gradient(circle_at_20%_54%,rgba(16,185,129,0.065),transparent_42%)] px-6 py-20 [scrollbar-width:none] sm:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        <div className="border-t border-white/[0.08] pt-14">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-emerald-200/60">
            03 / Career
          </p>
          <h2 className="mb-16 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Experience
          </h2>

          <div className="relative ml-1 space-y-14 pl-9 sm:ml-3 sm:pl-12">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-white/[0.07]" />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-blue-300/70 via-slate-300/40 to-violet-300/30"
              style={{ scaleY: prefersReducedMotion ? 1 : timelineScale }}
            />

            <motion.article
              className="relative rounded-2xl border border-white/[0.07] bg-zinc-950/35 p-6 backdrop-blur-sm sm:p-8"
              initial={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.88, filter: "blur(12px)" }
              }
              whileInView={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 1, scale: 1, filter: "blur(0px)" }
              }
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute -left-[41px] top-8 h-2.5 w-2.5 rounded-full border border-blue-200/50 bg-zinc-950 shadow-[0_0_14px_rgba(96,165,250,0.22)] sm:-left-[53px]" />
              <p className="mb-2 font-mono text-xs tracking-[0.12em] text-zinc-500">
                Sep 2025 — Present
              </p>
              <h3 className="text-2xl font-semibold tracking-[-0.025em]">
                Deloitte USI
              </h3>
              <p className="mb-6 mt-1 text-zinc-500">Data Engineer</p>
              <p className="max-w-3xl leading-relaxed text-zinc-300">
                Building and scaling modern data platforms using Snowflake,
                GitHub Actions, and IICS. Focused on automation, deployment
                reliability, and data engineering best practices.
              </p>
            </motion.article>

            <motion.article
              className="relative rounded-2xl border border-white/[0.07] bg-zinc-950/35 p-6 backdrop-blur-sm sm:p-8"
              initial={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.88, filter: "blur(12px)" }
              }
              whileInView={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 1, scale: 1, filter: "blur(0px)" }
              }
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute -left-[41px] top-8 h-2.5 w-2.5 rounded-full border border-violet-200/40 bg-zinc-950 shadow-[0_0_14px_rgba(167,139,250,0.18)] sm:-left-[53px]" />
              <p className="mb-2 font-mono text-xs tracking-[0.12em] text-zinc-500">
                Aug 2021 — Sep 2025
              </p>
              <h3 className="text-2xl font-semibold tracking-[-0.025em]">
                Accenture
              </h3>
              <p className="mb-6 mt-1 text-zinc-500">Data Engineer</p>
              <p className="max-w-3xl leading-relaxed text-zinc-300">
                Designed and optimized enterprise-scale data pipelines using
                Snowflake, Spark, Airflow, dbt, and Python across multiple
                business domains.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      <section
        ref={contactRef}
        id="contact"
        className="relative z-20 mx-auto flex h-[100svh] w-full max-w-6xl snap-start snap-always items-center overflow-hidden bg-[radial-gradient(circle_at_70%_45%,rgba(217,70,239,0.065),transparent_42%)] px-6 py-24 sm:px-10 lg:px-12"
      >
        <motion.div
          className="w-full overflow-hidden rounded-[2rem] border border-white/[0.09] bg-zinc-950/50 p-8 backdrop-blur-xl sm:p-12 md:p-16"
          style={
            reducedMotionStyle ?? {
              scale: contactScale,
              opacity: contactOpacity,
              filter: contactBlur,
            }
          }
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-fuchsia-200/60">
            04 / Start a conversation
          </p>
          <h2 className="mb-10 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Contact
          </h2>
          <p className="mb-12 max-w-2xl text-xl leading-relaxed tracking-[-0.018em] text-zinc-300 sm:text-2xl">
            Interested in data engineering, AI systems, or building scalable
            platforms? Let&apos;s connect.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <a
              href="mailto:rakshandaheda254@gmail.com"
              className="rounded-full border border-white/[0.09] bg-white/[0.035] px-5 py-2.5 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.065] hover:text-white"
            >
              Email →
            </a>
            <a
              href="https://www.linkedin.com/in/rakshanda-hedaoo-94971b185"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/[0.09] bg-white/[0.035] px-5 py-2.5 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.065] hover:text-white"
            >
              LinkedIn →
            </a>
            <a
              href="https://github.com/raksiam"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/[0.09] bg-white/[0.035] px-5 py-2.5 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.065] hover:text-white"
            >
              GitHub →
            </a>
          </div>
        </motion.div>
        <footer className="absolute inset-x-6 bottom-5 flex items-center justify-between border-t border-white/[0.08] pt-5 text-xs text-zinc-600 sm:inset-x-10 lg:inset-x-12">
          <span>© 2026 Rakshanda Hedaoo</span>
          <a
            href="#home"
            className="transition-colors duration-300 hover:text-cyan-200"
          >
            Back to top ↑
          </a>
        </footer>
      </section>
    </main>
  );
}
