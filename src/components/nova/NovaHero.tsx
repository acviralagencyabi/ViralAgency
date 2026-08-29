import { useRef } from 'react';
import ScrollVideo from './ScrollVideo';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';

/**
 * NOVA_AI cinematic intro, mounted as the top of the ViralAgency homepage.
 * The scroll-scrubbed video is scoped to this wrapper's own scroll range,
 * so the full clip plays across the intro and is then covered by the opaque
 * sections below (which keep the ViralAgency design system).
 */
export default function NovaHero() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="nova-scope relative text-white">
      <ScrollVideo targetRef={wrapRef} />
      <main>
        <SectionOne />
        <div aria-hidden className="h-[80vh]" />
        <SectionTwo />
      </main>
    </div>
  );
}
