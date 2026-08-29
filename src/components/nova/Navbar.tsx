import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

const LINKS = ['main', 'tiers', 'features', 'talk to us'];

export default function Navbar() {
  return (
    <>
      {/* Top-left wordmark — mix-blend keeps it readable over the dark hero
          video AND the light ViralAgency sections that follow below. */}
      <div className="fixed left-5 top-5 z-50 mix-blend-difference sm:left-8 sm:top-7 md:left-12">
        <Reveal>
          <a
            href="#"
            className="font-mono text-lg font-medium tracking-tight text-white drop-shadow-md sm:text-xl md:text-2xl"
          >
            (NOVA_AI)
          </a>
        </Reveal>
        <Reveal delay={150}>
          <span className="mt-6 block font-mono text-[10px] text-white/60 sm:mt-8 sm:text-xs">
            [ v.01b ]
          </span>
        </Reveal>
      </div>

      {/* Top-right nav */}
      <nav className="fixed right-5 top-5 z-50 mix-blend-difference sm:right-8 sm:top-7 md:right-12">
        <ul className="flex flex-col items-end gap-1.5 sm:gap-2">
          {LINKS.map((label, i) => (
            <li key={label}>
              <Reveal delay={100 + i * 120}>
                <a
                  href="#"
                  className="group flex items-center gap-1 font-mono text-xs text-white/80 drop-shadow-md transition-colors duration-300 hover:text-white sm:text-sm"
                >
                  {label}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
