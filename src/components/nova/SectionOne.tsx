import { ArrowDown } from 'lucide-react';
import Reveal from './Reveal';

export default function SectionOne() {
  return (
    <section className="relative flex min-h-screen flex-col justify-end supports-[height:100svh]:min-h-[100svh]">
      <div className="relative flex flex-col gap-10 px-5 pb-16 sm:px-8 md:px-12 md:pb-20">
        {/* Headline */}
        <h1 className="max-w-4xl text-4xl font-medium uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
          <Reveal as="span" delay={100} className="block pl-6 sm:pl-12">
            Nel 2026 l'attenzione
          </Reveal>
          <Reveal as="span" delay={220} className="block">
            è la valuta più rara che esista.
          </Reveal>
        </h1>
      </div>

      {/* Bottom-center scroll indicator */}
      <Reveal delay={760} className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-6">
        <ArrowDown size={18} className="animate-bounce text-white/80" />
      </Reveal>
    </section>
  );
}
