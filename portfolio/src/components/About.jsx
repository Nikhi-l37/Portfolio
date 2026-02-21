import { motion } from 'framer-motion';
import {
  Brain, Users, GitBranch,
  Download, ExternalLink, Sparkles,
} from 'lucide-react';
import SectionHeader from './SectionHeader';
import profileImg from '../assets/Nikhil.jpg';
import { fireCenterConfetti } from '../utils/confetti';

/* ===== animation variants ===== */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ===== reusable Bento Card ===== */
function BentoCard({ children, className = '', glow = 'emerald' }) {
  const glows = {
    emerald: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.12)] hover:border-emerald-500/30',
    cyan:    'hover:shadow-[0_0_40px_rgba(0,212,255,0.12)]   hover:border-cyan-400/30',
    purple:  'hover:shadow-[0_0_40px_rgba(124,58,237,0.12)]  hover:border-purple-500/30',
  };

  return (
    <motion.div
      variants={cardAnim}
      className={`relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border
                  rounded-[16px] p-6 transition-[transform,box-shadow,border-color] duration-400 ease-out
                  will-change-transform
                  ${glows[glow]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ===== About Section ===== */
export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader number="01" title="About Me" />
        </motion.div>

        {/* ===== Bento Grid — 3 col, 24px gap ===== */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          {/* ─── ROW 1 — Hero Card (col 1-2) ─── */}
          <BentoCard
            className="md:col-span-2 flex flex-col justify-center"
            glow="emerald"
          >
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400
                                 text-xs font-semibold rounded-full border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" /> Full-Stack Developer
                </span>
                <span className="px-3 py-1 bg-accent-dim text-accent text-xs font-semibold rounded-full border border-accent/20">
                  Open to Work
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-extrabold text-heading mb-5 leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Nikhil
                </span>
              </h3>

              <p className="text-muted text-[0.95rem] leading-relaxed mb-3 max-w-xl">
                I'm a <span className="text-heading font-medium">backend-focused developer</span> with strong knowledge in building server-side applications, APIs, and working with databases.
              </p>
              <p className="text-muted text-sm leading-relaxed mb-3 max-w-xl">
                While my strength lies in backend development, I also understand frontend fundamentals and create clean, responsive interfaces using modern <span className="text-emerald-400 font-medium">AI-assisted tools</span>.
              </p>
              <p className="text-muted text-sm leading-relaxed max-w-xl">
                I enjoy solving real-world problems and continuously improving my technical skills.
              </p>
            </div>
          </BentoCard>

          {/* ─── ROW 1 — Photo Card (col 3, square) ─── */}
          <BentoCard
            className="flex items-center justify-center aspect-square"
            glow="cyan"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30
                              blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative w-44 h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden
                              ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-card
                              transition-[ring-color,box-shadow,transform] duration-700 ease-out
                              group-hover:ring-emerald-400/60 group-hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]
                              group-hover:scale-105">
                <img
                  src={profileImg}
                  alt="Sivada Nikhil Reddy"
                  className="w-full h-full object-cover object-top
                             grayscale-[20%] contrast-[1.05]
                             transition-[filter,transform] duration-700 ease-out
                             group-hover:grayscale-0 group-hover:contrast-[1.1] group-hover:scale-115"
                />
              </div>

              <div className="absolute -inset-3 rounded-full border border-emerald-500/10 pointer-events-none
                              transition-[border-color,opacity] duration-700
                              group-hover:border-emerald-400/30 group-hover:opacity-80
                              animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
          </BentoCard>

          {/* ─── ROW 2 — Problem Solving & DSA (col 1-2, wide) ─── */}
          <BentoCard className="md:col-span-2 flex flex-col justify-center" glow="emerald">
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-heading">Problem Solving & DSA</h4>
              </div>

              <p className="text-muted text-sm leading-relaxed mb-2">
                Actively solving data structures and algorithms problems on platforms like{' '}
                <a href="https://leetcode.com/u/NikhilReddy3446/" target="_blank" rel="noopener"
                   className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium underline decoration-emerald-400/30 underline-offset-2">
                  LeetCode
                </a>{' '}
                and{' '}
                <a href="https://www.geeksforgeeks.org/profile/snikhilre097c" target="_blank" rel="noopener"
                   className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium underline decoration-emerald-400/30 underline-offset-2">
                  GeeksforGeeks
                </a>.
              </p>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Strong understanding of problem-solving patterns, logical thinking, and writing optimized solutions.
                Regular practice strengthens my core computer science fundamentals and analytical skills.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Data Structures', 'Algorithms', 'Logical Thinking', 'Optimization', 'Competitive Coding'].map(tag => (
                  <span key={tag}
                    className="px-2.5 py-1 bg-emerald-500/8 text-emerald-400/80 text-xs font-medium rounded-lg
                               border border-emerald-500/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ─── ROW 2 — GitHub & Workflow (col 3, square) ─── */}
          <BentoCard className="flex flex-col justify-center" glow="cyan">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-lg font-bold text-heading">GitHub & Workflow</h4>
              </div>

              <p className="text-muted text-sm leading-relaxed mb-2">
                Experienced in using GitHub for version control, collaboration, and project management.
              </p>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Comfortable with branching strategies, pull requests, code reviews, and maintaining clean
                repository structures.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Git & GitHub', 'Version Control', 'Clean Code', 'Collaboration', 'Project Management'].map(tag => (
                  <span key={tag}
                    className="px-2.5 py-1 bg-cyan-500/8 text-cyan-400/80 text-xs font-medium rounded-lg
                               border border-cyan-500/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ─── ROW 3 — Leadership (col 1, tall/square) ─── */}
          <BentoCard className="group/lead flex flex-col justify-center" glow="emerald">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center
                                transition-colors duration-300 group-hover/lead:bg-emerald-500/20">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-heading leading-tight">Community Leadership</h4>
                  <span className="text-[11px] text-emerald-400/70 font-semibold uppercase tracking-wider">Lead @ Vedic Vox</span>
                </div>
              </div>

              <p className="text-muted text-sm leading-relaxed mb-4">
                Spearheading a student-led club focused on discussing and building
                innovative solutions to real-world problems.
              </p>

              <div className="flex items-center gap-2 opacity-0 translate-y-2
                              transition-[opacity,transform] duration-400 ease-out
                              group-hover/lead:opacity-100 group-hover/lead:translate-y-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1
                                 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full
                                 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" /> Let's Collaborate
                </span>
              </div>
            </div>
          </BentoCard>

          {/* ─── ROW 3 — Resume CTA (col 2-3, wide) ─── */}
          <BentoCard
            className="md:col-span-2 flex flex-col justify-center items-center text-center
                       bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5"
            glow="emerald"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Download className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="text-base font-bold text-heading mb-1">Want to know more?</h4>
            <p className="text-xs text-muted mb-5">Grab a copy of my resume</p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener"
              onClick={fireCenterConfetti}
              className="inline-flex items-center gap-2 px-5 py-2.5
                         bg-accent-dim backdrop-blur-md
                         border border-emerald-500/25 text-emerald-400 text-sm font-semibold rounded-full
                         float-1 transition-[box-shadow,background-color,border-color,color] duration-300
                         hover:bg-emerald-500/10 hover:border-emerald-400/40
                         hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]
                         active:scale-95"
            >
              Download Resume
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </BentoCard>

        </motion.div>
      </div>
    </section>
  );
}
