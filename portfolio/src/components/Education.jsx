import RevealWrapper from './RevealWrapper';
import SectionHeader from './SectionHeader';

const EDUCATION = [
  {
    period: '2023 – 2027',
    degree: 'B.Tech in Computer Science',
    institution: 'Rajeev Gandhi Memorial College of Engineering and Technology (RGMCET)',
    description:
      'Currently pursuing 3rd year with a CGPA of 8.0. Strong foundation in core computer science subjects such as data structures, algorithms, databases, and computer networks.',
    icon: 'fa-solid fa-graduation-cap',
    current: true,
  },
  {
    period: '2021 – 2023',
    degree: 'Intermediate MPC',
    institution: 'VBR College',
    description:
      'Completed with an excellent score of 970, Maintained consistent academic performance and demonstrated dedication, discipline, and commitment toward long-term goals.',
    icon: 'fa-solid fa-book-open',
    current: false,
  },
  {
    period: '2020 – 2021',
    degree: 'Secondary School (SSC)',
    institution: 'Sri Chaitanya College',
    description:
      'Established a strong educational foundation and commitment to continuous growth.',
    icon: 'fa-solid fa-school',
    current: false,
  },
];

export default function Education() {
  return (
    <section id="education" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <RevealWrapper>
          <SectionHeader number="02" title="Education" />
        </RevealWrapper>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-accent via-accent-alt to-accent opacity-30 hidden md:block" />

          {EDUCATION.map((item, i) => {
            const isRight = i % 2 === 0;

            return (
              <RevealWrapper key={item.degree} delay={i * 150}>
                <div className={`relative flex flex-col md:flex-row items-center mb-16 last:mb-0 ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>

                  {/* Card — mobile: full width, desktop: 45% on alternating sides */}
                  <div className={`w-full md:w-[45%] ${isRight ? 'md:ml-auto md:pl-0' : 'md:mr-auto md:pr-0'} order-2 md:order-none`}>
                    <div className="group relative bg-card border border-border rounded-xl p-7
                                    float-1 will-change-transform transition-[box-shadow,border-color] duration-300 ease-out
                                    hover:border-border-hover hover:shadow-[0_16px_40px_rgba(0,0,0,0.3),0_0_30px_var(--color-accent-dim)]">

                      {/* Top gradient bar on hover */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-alt rounded-t-xl scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />

                      {/* Period badge + icon */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-block text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full
                          ${item.current
                            ? 'bg-accent text-primary'
                            : 'bg-accent-alt text-white'
                          }`}>
                          {item.period}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                          ${item.current
                            ? 'bg-accent text-primary'
                            : 'bg-accent-alt text-white'
                          }`}>
                          <i className={item.icon} />
                        </div>
                      </div>

                      {/* Degree */}
                      <h3 className="text-lg font-bold text-accent mb-1">{item.degree}</h3>

                      {/* Institution */}
                      <p className="text-sm font-semibold text-heading mb-3">{item.institution}</p>

                      {/* Description */}
                      <p className="text-[0.9rem] text-muted leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center dot — desktop only */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-4 h-4 rounded-full border-[3px]
                      ${item.current
                        ? 'bg-accent border-accent shadow-[0_0_12px_var(--color-accent-glow)]'
                        : 'bg-accent-alt border-accent-alt shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                      }`} />
                  </div>
                </div>
              </RevealWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
