import Reveal from './Reveal';

export default function SectionTwo() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center supports-[height:100svh]:min-h-[100svh]">
      <div className="relative flex flex-col px-5 pt-24 sm:px-8 sm:pt-0 md:px-12">
        <h2 className="max-w-3xl text-2xl font-medium leading-[1.22] tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
          <Reveal as="span" delay={100} className="block">
            Il tuo cliente ideale scorre centinaia di contenuti al giorno e decide in una frazione di secondo cosa merita un secondo sguardo.
          </Reveal>
          <Reveal as="span" delay={220} className="mt-4 block text-white/80">
            In questo rumore, un brand che non si fa notare semplicemente non esiste.
          </Reveal>
        </h2>
      </div>
    </section>
  );
}
