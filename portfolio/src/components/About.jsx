import { motion } from 'framer-motion';
import {
  GraduationCap, Rocket, Brain,
  Download, ExternalLink, Trophy, Sparkles,
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
      className={`relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6
                  transition-all duration-400 ease-out hover:-translate-y-1
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

        {/* ===== Bento Grid ===== */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >

          {/* ─── 1  Hero Card (large) ─── */}
          <BentoCard
            className="md:col-span-2 lg:col-span-2 md:row-span-2 flex flex-col justify-center"
            glow="emerald"
          >
            {/* Decorative gradient blob */}
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

              {/* Heading */}
              <h3 className="text-3xl lg:text-4xl font-extrabold text-heading mb-5 leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Nikhil
                </span>
              </h3>

              {/* Description */}
              <p className="text-muted text-[0.95rem] leading-relaxed mb-3 max-w-xl">
                A passionate developer and <span className="text-heading font-medium">B.Tech CS student</span> at
                Rajeev Gandhi Memorial College (2023 – 2027), focused on
                <span className="text-emerald-400 font-medium"> turning ideas into real, functional applications</span>.
              </p>
              <p className="text-muted text-sm leading-relaxed max-w-xl">
                I build across the full stack — designing databases, crafting REST APIs, and
                creating responsive front-ends. From a
                <span className="text-heading font-medium"> product availability finder </span> to a
                <span className="text-heading font-medium"> resume screening system </span> and an
                <span className="text-heading font-medium"> Android screen-time tracker</span>,
                I ship products that solve real problems.
              </p>
            </div>
          </BentoCard>

          {/* ─── 2  Photo Card (circular) ─── */}
          <BentoCard
            className="md:row-span-2 flex items-center justify-center min-h-[320px]"
            glow="cyan"
          >
            <div className="relative group">
              {/* Hover glow ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20
                              blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Photo circle */}
              <div className="relative w-44 h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden
                              ring-2 ring-emerald-500/20 ring-offset-2 ring-offset-card
                              transition-all duration-500
                              group-hover:ring-emerald-400/50 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                <img
                  src={profileImg}
                  alt="Sivada Nikhil Reddy"
                  className="w-full h-full object-cover object-top
                             grayscale-[20%] contrast-[1.05]
                             transition-all duration-500
                             group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>

              {/* Animated ring */}
              <div className="absolute -inset-3 rounded-full border border-emerald-500/10 pointer-events-none
                              animate-[pulse_3s_ease-in-out_infinite]" />
            </div>
          </BentoCard>

          {/* ─── 3-5  Stat Cards ─── */}
          <BentoCard className="flex flex-col justify-center items-center text-center py-8" glow="emerald">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Rocket className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-3xl font-extrabold text-heading">3+</span>
            <span className="text-xs text-dim uppercase tracking-widest mt-1.5 font-semibold">Projects Shipped</span>
          </BentoCard>

          <BentoCard className="flex flex-col justify-center items-center text-center py-8" glow="purple">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-7 h-7 text-purple-400" />
            </div>
            <span className="text-3xl font-extrabold text-heading">B.Tech</span>
            <span className="text-xs text-dim uppercase tracking-widest mt-1.5 font-semibold">CS Student</span>
            <span className="text-[11px] text-muted mt-1">RGMCET • CGPA 8.0</span>
          </BentoCard>

          <BentoCard className="flex flex-col justify-center items-center text-center py-8" glow="cyan">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-cyan-400" />
            </div>
            <span className="text-3xl font-extrabold text-heading">500</span>
            <span className="text-xs text-dim uppercase tracking-widest mt-1.5 font-semibold">CodeChef Rating</span>
          </BentoCard>

          {/* ─── 6  DSA & AI Focus Card ─── */}
          <BentoCard className="md:col-span-2 lg:col-span-2 flex flex-col justify-center" glow="emerald">
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-heading">DSA & AI-Assisted Workflows</h4>
              </div>

              <p className="text-muted text-sm leading-relaxed mb-4">
                Sharpening problem-solving daily on{' '}
                <a href="https://leetcode.com/u/NikhilReddy3446/" target="_blank" rel="noopener"
                   className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium underline decoration-emerald-400/30 underline-offset-2">
                  LeetCode
                </a>{' '}
                &{' '}
                <a href="https://www.geeksforgeeks.org/profile/snikhilre097c" target="_blank" rel="noopener"
                   className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium underline decoration-emerald-400/30 underline-offset-2">
                  GeeksforGeeks
                </a>
                , while leveraging AI tools to code smarter and ship faster.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Data Structures', 'Algorithms', 'AI Tools', 'Problem Solving', 'Competitive Coding'].map(tag => (
                  <span key={tag}
                    className="px-2.5 py-1 bg-emerald-500/8 text-emerald-400/80 text-xs font-medium rounded-lg
                               border border-emerald-500/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ─── 7  Resume Download CTA (Glassmorphism) ─── */}
          <BentoCard
            className="flex flex-col justify-center items-center text-center
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
                         bg-white/[0.04] backdrop-blur-md
                         border border-emerald-500/25 text-emerald-400 text-sm font-semibold rounded-full
                         transition-all duration-300
                         hover:bg-emerald-500/10 hover:border-emerald-400/40
                         hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]
                         hover:-translate-y-0.5 active:scale-95"
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
