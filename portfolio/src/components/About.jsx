import RevealWrapper from './RevealWrapper';
import SectionHeader from './SectionHeader';
import profileImg from '../assets/Nikhil.jpg';

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <RevealWrapper>
          <SectionHeader number="01" title="About Me" />
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-14 items-start">
          {/* Text */}
          <RevealWrapper>
            <div className="space-y-4 text-muted text-base">
              <p>
                Hello! I'm <strong className="text-heading font-semibold">Nikhil</strong>, a passionate
                full-stack web developer currently pursuing my{' '}
                <strong className="text-heading font-semibold">B.Tech</strong> at{' '}
                <strong className="text-heading font-semibold">Rajeev Gandhi Memorial College</strong>{' '}
                (2023 – 2027). I love turning ideas into real, functional web applications.
              </p>
              <p>
                I've built and deployed multiple projects — from a{' '}
                <strong className="text-heading font-semibold">product availability finder</strong> with
                live shop statuses to a{' '}
                <strong className="text-heading font-semibold">resume screening system</strong> and an{' '}
                <strong className="text-heading font-semibold">Android screen-time tracker</strong>.
                I enjoy working across the full stack: designing databases, building REST APIs, and
                creating responsive front-ends.
              </p>
              <p>
                When I'm not coding, you'll find me solving problems on{' '}
                <a href="https://leetcode.com/u/NikhilReddy3446/" target="_blank" rel="noopener"
                   className="text-accent hover:text-white transition-colors">LeetCode</a>{' '}
                &amp;{' '}
                <a href="https://www.geeksforgeeks.org/profile/snikhilre097c" target="_blank" rel="noopener"
                   className="text-accent hover:text-white transition-colors">GeeksforGeeks</a>,
                sharpening my DSA skills, or exploring AI-assisted development workflows.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { value: '3+', label: 'Projects Shipped' },
                  { value: 'B.Tech', label: 'CS Student' },
                  { value: '500', label: 'CodeChef Rating' },
                ].map(({ value, label }) => (
                  <div key={label}
                    className="text-center p-5 bg-surface rounded-lg border border-border transition-all duration-300 hover:border-border-hover hover:-translate-y-1">
                    <span className="block text-2xl font-extrabold text-accent mb-1">{value}</span>
                    <span className="text-xs text-dim uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealWrapper>

          {/* Photo */}
          <RevealWrapper delay={150} className="lg:order-none order-first">
            <div className="relative w-[280px] mx-auto group">
              <img
                src={profileImg}
                alt="Sivada Nikhil Reddy"
                className="relative z-10 w-[280px] h-[340px] rounded-xl object-cover object-top
                           grayscale-[20%] contrast-[1.05] transition-all duration-400 ease-out
                           group-hover:grayscale-0 group-hover:contrast-100 group-hover:-translate-x-1 group-hover:-translate-y-1"
              />
              <div className="absolute top-4 left-4 w-[280px] h-[340px] border-2 border-accent rounded-xl opacity-30
                              transition-all duration-300 ease-out group-hover:top-2.5 group-hover:left-2.5 group-hover:opacity-60" />
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
