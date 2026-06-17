import { config, fields, collection, singleton } from '@keystatic/core';

const isLocal = process.env.NODE_ENV === 'development' || import.meta.env?.DEV;

const storage = isLocal
  ? { kind: 'local' as const }
  : {
      kind: 'github' as const,
      repo: 'WebViralAgency/ViralAgency' as const,
    };

// ──────────────────────────────────────────────────────────────────────────────
// Helper: opzioni icone per i servizi (cards in homepage)
// ──────────────────────────────────────────────────────────────────────────────
const serviceIconOptions = [
  { label: 'Nessuna icona', value: 'none' },
  { label: 'Megafono (Comunicazione)', value: 'megaphone' },
  { label: 'Target (Marketing)', value: 'target' },
  { label: 'Cuore / Notifica (Social)', value: 'heart' },
  { label: 'Compasso (Branding)', value: 'compass' },
] as const;

// Categorie portfolio in italiano
const portfolioCategoryOptions = [
  { label: 'Social Media', value: 'social' },
  { label: 'Video', value: 'video' },
  { label: 'Campagna', value: 'campagna' },
  { label: 'Branding', value: 'branding' },
  { label: 'Contenuto', value: 'contenuto' },
  { label: 'Shooting', value: 'shooting' },
] as const;

// Dimensione card nella griglia tipo Pinterest (CSS columns, no buchi)
const portfolioGridSizeOptions = [
  { label: 'Regolare (3:4)', value: 'regular' },
  { label: 'Verticale alta (9:16, formato story)', value: 'tall' },
] as const;

export default config({
  storage,

  ui: {
    brand: { name: 'REAL GOES VIRAL' },
  },

  singletons: {
    // ──────────────────────────────────────────────────────────────────────
    // Impostazioni globali del sito
    // ──────────────────────────────────────────────────────────────────────
    global: singleton({
      label: 'Impostazioni Globali',
      path: 'content/settings/global',
      format: { data: 'json' },
      schema: {
        companyName: fields.text({ label: 'Nome Azienda' }),

        // Brand assets — sostituiscono i loghi statici nel sito.
        logoMark: fields.image({
          label: 'Logo — Mark (icona piccola, navbar)',
          description: 'Lasciato vuoto: usa il default `mark-color.png`.',
          directory: 'src/assets/images/brand',
          publicPath: '/src/assets/images/brand/',
        }),
        logoWord: fields.image({
          label: 'Logo — Wordmark (testo, navbar)',
          description: 'Lasciato vuoto: usa il default `logo-black.png`.',
          directory: 'src/assets/images/brand',
          publicPath: '/src/assets/images/brand/',
        }),
        logoFooter: fields.image({
          label: 'Logo — Footer (completo con tagline)',
          description: 'Lasciato vuoto: usa il default `logo-black-tagline.png`.',
          directory: 'src/assets/images/brand',
          publicPath: '/src/assets/images/brand/',
        }),

        contact: fields.object(
          {
            email: fields.text({ label: 'Email' }),
            phone: fields.text({ label: 'Telefono' }),
            address: fields.text({ label: 'Indirizzo' }),
          },
          { label: 'Contatti' }
        ),

        whatsapp: fields.object(
          {
            number: fields.text({
              label: 'Numero WhatsApp (con prefisso, senza + es. 393331234567)',
              description: 'Lascia vuoto per nascondere il bottone WhatsApp.',
            }),
            defaultMessage: fields.text({
              label: 'Messaggio precompilato',
              multiline: true,
              defaultValue:
                'Ciao! Sono interessato/a a una consulenza per il mio brand. Possiamo parlarne?',
            }),
          },
          { label: 'WhatsApp' }
        ),

        social: fields.object(
          {
            facebook: fields.url({ label: 'Facebook' }),
            instagram: fields.url({ label: 'Instagram' }),
            linkedin: fields.url({ label: 'LinkedIn' }),
            googleReviewsUrl: fields.url({
              label: 'URL recensioni Google',
              description: 'Link al profilo Google Business usato per recensioni e CTA "Google".',
            }),
            googleMapsUrl: fields.url({
              label: 'URL Google Maps',
              description: 'Link mappa/sede usato nel footer e nelle landing page.',
            }),
          },
          { label: 'Social Media' }
        ),

        analytics: fields.object(
          {
            gaTrackingId: fields.text({
              label: 'Google Analytics — Measurement ID (G-XXXXXXXXXX)',
              description:
                'Lascia vuoto per disabilitare GA. Lo script viene caricato solo dopo consenso ai cookie.',
            }),
          },
          { label: 'Analytics' }
        ),

        seo: fields.object(
          {
            titleSuffix: fields.text({ label: 'Suffisso titolo SEO' }),
            defaultDescription: fields.text({
              label: 'Descrizione default',
              multiline: true,
            }),
          },
          { label: 'SEO' }
        ),

        form: fields.object(
          {
            web3formsKey: fields.text({ label: 'Web3Forms Access Key' }),
          },
          { label: 'Form contatti' }
        ),

        legal: fields.object(
          {
            piva: fields.text({ label: 'Partita IVA' }),
            codiceDestinatario: fields.text({ label: 'Codice destinatario SDI' }),
          },
          { label: 'Dati legali' }
        ),

        // ── NAVIGAZIONE ──────────────────────────────────────────────────
        nav: fields.object(
          {
            portfolioLabel: fields.text({
              label: 'Voce nav — Portfolio',
              defaultValue: 'Portfolio',
            }),
            portfolioMegaDesc: fields.text({
              label: 'Megamenu Portfolio — descrizione',
              defaultValue: 'I nostri lavori per ogni cliente',
            }),
            aboutLabel: fields.text({
              label: 'Voce nav — Chi siamo',
              defaultValue: 'Chi siamo',
            }),
            aboutMegaDesc: fields.text({
              label: 'Megamenu Chi siamo — descrizione',
              defaultValue: 'Storytelling, team & servizi',
            }),
            articlesLabel: fields.text({
              label: 'Voce nav — Articoli',
              defaultValue: 'Articoli',
            }),
            contactLabel: fields.text({
              label: 'Voce nav — Contatti (CTA)',
              defaultValue: 'Contatti',
            }),
          },
          { label: 'Navigazione' }
        ),

        // ── FOOTER ───────────────────────────────────────────────────────
        footer: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow (sopra la email gigante)',
              defaultValue: 'Parliamone',
            }),
            tagline: fields.text({
              label: 'Tagline brand (sotto il logo)',
              defaultValue: 'Communication · Marketing · Social · Branding',
            }),
            siteCredit: fields.text({
              label: 'Credito design (in basso a destra)',
              defaultValue: 'Site design — REAL GOES VIRAL',
            }),
          },
          { label: 'Footer' }
        ),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Homepage — sezioni effettivamente usate dal sito
    // ──────────────────────────────────────────────────────────────────────
    homepage: singleton({
      label: 'Homepage',
      path: 'content/pages/homepage',
      format: { data: 'json' },
      schema: {
        seo: fields.object(
          {
            title: fields.text({ label: 'Titolo SEO' }),
            description: fields.text({ label: 'Descrizione SEO', multiline: true }),
          },
          { label: 'SEO' }
        ),

        // ── HERO ─────────────────────────────────────────────────────────
        hero: fields.object(
          {
            badge: fields.text({
              label: 'Badge (etichetta in alto a sinistra)',
              defaultValue: '01 / HOMEPAGE',
            }),
            location: fields.text({
              label: 'Testo location (in alto a destra, usa ↵ per a capo)',
              multiline: true,
              defaultValue: 'BOLOGNA · MODENA — IT\nMOTOR VALLEY',
            }),
            titleLine1: fields.text({
              label: 'Titolo — Riga 1',
              defaultValue: 'REAL',
            }),
            titleLine2: fields.text({
              label: 'Titolo — Riga 2',
              defaultValue: 'GOES',
            }),
            titleLine3: fields.text({
              label: 'Titolo — Riga 3',
              defaultValue: 'VIRAL',
            }),
            tagline: fields.text({
              label: 'Tagline (sotto il titolo)',
              defaultValue: 'Agenzia di comunicazione & marketing.',
            }),
            ctaLabel: fields.text({
              label: 'Testo CTA',
              defaultValue: 'Prenota una Call',
            }),
            ctaHref: fields.text({
              label: 'Destinazione CTA',
              defaultValue: '#contatti',
            }),
            scrollLabel: fields.text({
              label: 'Testo Scroll',
              defaultValue: 'Scroll',
            }),
            scrollHref: fields.text({
              label: 'Destinazione Scroll (ancora)',
              defaultValue: '#manifesto',
            }),
          },
          { label: 'Hero' }
        ),

        // ── MARQUEE ──────────────────────────────────────────────────────
        marquee: fields.object(
          {
            text: fields.text({
              label: 'Testo del marquee (ripetuto in loop)',
              defaultValue: 'REAL GOES VIRAL',
            }),
          },
          { label: 'Marquee (banda animata)' }
        ),

        manifesto: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '01 — Manifesto' }),
            title: fields.text({
              label: 'Titolo (multilinea: usa Invio per andare a capo)',
              multiline: true,
            }),
            body: fields.text({
              label: 'Corpo del manifesto',
              multiline: true,
            }),
            tagline: fields.text({
              label: 'Tagline (frase di chiusura)',
              multiline: true,
            }),
            ctaLabel: fields.text({
              label: 'Testo CTA arcobaleno',
              defaultValue: 'Parliamo del tuo progetto',
            }),
            ctaHref: fields.text({
              label: 'Destinazione CTA (es. #contatti)',
              defaultValue: '#contatti',
            }),
            kpis: fields.array(
              fields.object({
                num: fields.number({ label: 'Numero', defaultValue: 0 }),
                suffix: fields.text({ label: 'Suffisso', defaultValue: '' }),
                label: fields.text({ label: 'Etichetta' }),
              }),
              {
                label: 'KPI',
                itemLabel: (props) =>
                  `${props.fields.num.value}${props.fields.suffix.value} — ${props.fields.label.value}`,
              }
            ),
          },
          { label: 'Manifesto (Chi siamo)' }
        ),

        // ── PORTFOLIO SECTION HEADER ──────────────────────────────────────
        portfolioSection: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '02 — Portfolio' }),
            title: fields.text({
              label: 'Titolo sezione',
              defaultValue: 'I lavori migliori, cliente per cliente.',
            }),
            ctaLabel: fields.text({
              label: 'Testo CTA (bottone accanto al titolo)',
              defaultValue: 'Il tuo prossimo',
            }),
            ctaHref: fields.text({
              label: 'Destinazione CTA',
              defaultValue: '#contatti',
            }),
          },
          { label: 'Sezione Portfolio (intestazione)' }
        ),

        servicesList: fields.array(
          fields.object({
            num: fields.text({ label: 'Numero (es. 01)', defaultValue: '01' }),
            title: fields.text({ label: 'Titolo (in italiano)' }),
            icon: fields.select({
              label: 'Icona animata',
              options: serviceIconOptions,
              defaultValue: 'none',
            }),
            desc: fields.text({ label: 'Descrizione breve', multiline: true }),
            bullets: fields.array(fields.text({ label: 'Sotto-servizio' }), {
              label: 'Sotto-servizi',
              itemLabel: (props) => props.value,
            }),
          }),
          {
            label: 'Servizi',
            itemLabel: (props) =>
              `${props.fields.num.value} — ${props.fields.title.value}`,
          }
        ),

        // ── SERVICES SECTION HEADER ───────────────────────────────────────
        servicesSection: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '03 — Servizi' }),
            title: fields.text({
              label: 'Titolo sezione',
              defaultValue: 'Quello che facciamo, ogni giorno.',
            }),
            intro: fields.text({
              label: 'Testo introduttivo (colonna destra)',
              multiline: true,
              defaultValue:
                'Un reparto marketing esterno, completo. Strategia, contenuti, performance.\nNessun pacchetto preconfezionato: solo quello che serve al tuo brand.',
            }),
          },
          { label: 'Sezione Servizi (intestazione)' }
        ),

        clients: fields.array(fields.text({ label: 'Nome cliente' }), {
          label: 'Clienti',
          itemLabel: (props) => props.value || '(vuoto)',
        }),

        locations: fields.array(
          fields.object({
            city: fields.text({ label: 'Città' }),
            tag: fields.text({ label: 'Etichetta (es. HQ, Studio Creativo)' }),
            address: fields.text({
              label: 'Indirizzo',
              description: 'Può essere anche solo la città se la scheda Google non mostra un indirizzo completo.',
            }),
            mapsUrl: fields.url({
              label: 'Link Google Maps',
              description:
                'Link specifico della sede. Se vuoto, il sito genera una ricerca Maps dall’indirizzo.',
            }),
            phone: fields.text({
              label: 'Telefono sede',
              description: 'Lascia vuoto per usare il numero globale.',
            }),
            whatsappNumber: fields.text({
              label: 'WhatsApp sede (con prefisso, senza +)',
              description: 'Lascia vuoto per usare il WhatsApp globale.',
            }),
            whatsappMessage: fields.text({
              label: 'Messaggio WhatsApp sede',
              multiline: true,
              description: 'Lascia vuoto per usare il messaggio globale.',
            }),
          }),
          {
            label: 'Sedi',
            itemLabel: (props) =>
              `${props.fields.city.value} — ${props.fields.tag.value}`,
          }
        ),

        team: fields.array(
          fields.object({
            name: fields.text({ label: 'Nome' }),
            role: fields.text({ label: 'Ruolo' }),
            initials: fields.text({
              label: 'Iniziali (fallback)',
              description: 'Usate solo se non carichi una foto.',
            }),
            photo: fields.image({
              label: 'Foto',
              description: 'Ritratto consigliato (rapporto 3:4).',
              directory: 'src/assets/images/team',
              publicPath: '/src/assets/images/team/',
            }),
          }),
          {
            label: 'Team',
            itemLabel: (props) =>
              `${props.fields.name.value} — ${props.fields.role.value}`,
          }
        ),

        // ── TEAM SECTION HEADER ───────────────────────────────────────────
        teamSection: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '04 — Team' }),
            title: fields.text({
              label: 'Titolo sezione',
              defaultValue: 'Persone vere dietro ogni post.',
            }),
            subtitle: fields.text({
              label: 'Sottotitolo (colonna destra)',
              defaultValue: 'Un team piccolo, selezionato, ossessionato dal risultato.',
            }),
          },
          { label: 'Sezione Team (intestazione)' }
        ),

        reviews: fields.array(
          fields.object({
            quote: fields.text({ label: 'Citazione', multiline: true }),
            author: fields.text({ label: 'Autore' }),
            role: fields.text({ label: 'Ruolo / Azienda' }),
            googleUrl: fields.url({
              label: 'Link recensione Google (opzionale)',
              description:
                'Link diretto alla recensione su Google. Se vuoto, usa l\'URL profilo Google in Impostazioni Globali.',
            }),
          }),
          {
            label: 'Recensioni',
            itemLabel: (props) => props.fields.author.value,
          }
        ),

        // ── REVIEWS SECTION HEADER ────────────────────────────────────────
        reviewsSection: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '05 — Recensioni' }),
            title: fields.text({
              label: 'Titolo sezione',
              defaultValue: 'Lo dicono i nostri clienti.',
            }),
          },
          { label: 'Sezione Recensioni (intestazione)' }
        ),

        // ── ARTICLES SECTION HEADER ───────────────────────────────────────
        articlesSection: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '06 — Articoli' }),
            title: fields.text({
              label: 'Titolo sezione',
              defaultValue: 'Interviste & approfondimenti.',
            }),
            ctaLabel: fields.text({
              label: 'Testo CTA (bottone accanto al titolo)',
              defaultValue: 'Suggeriscine uno',
            }),
            ctaHref: fields.text({
              label: 'Destinazione CTA',
              defaultValue: '#contatti',
            }),
          },
          { label: 'Sezione Articoli (intestazione)' }
        ),

        social: fields.object(
          {
            title: fields.text({
              label: 'Titolo sezione social',
              defaultValue: 'Restiamo connessi',
            }),
          },
          { label: 'Sezione Social' }
        ),

        contact: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow',
              defaultValue: '07 — Contatti',
            }),
            title: fields.text({
              label: 'Titolo sezione',
              defaultValue: 'Prenota una call.',
            }),
            description: fields.text({
              label: 'Testo introduttivo (sopra i bottoni contatto)',
              multiline: true,
            }),
            showWhatsapp: fields.checkbox({
              label: 'Mostra bottone WhatsApp',
              defaultValue: true,
            }),
            whatsappLabel: fields.text({
              label: 'Testo bottone WhatsApp',
              defaultValue: 'Scrivici su WhatsApp',
            }),
            phoneLabel: fields.text({
              label: 'Testo bottone Telefono',
              defaultValue: 'Chiamaci ora',
            }),
          },
          { label: 'Sezione Contatti' }
        ),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Banner cookie (testi semplici)
    // ──────────────────────────────────────────────────────────────────────
    cookieBanner: singleton({
      label: 'Cookie — Banner',
      path: 'content/pages/cookie-banner',
      format: { data: 'json' },
      schema: {
        bannerTitle: fields.text({
          label: 'Banner — Titolo',
          defaultValue: 'Rispettiamo la tua privacy',
        }),
        bannerBody: fields.text({
          label: 'Banner — Testo',
          multiline: true,
          defaultValue:
            'Usiamo cookie tecnici essenziali e, con il tuo consenso, cookie di analisi (Google Analytics) per capire come migliorare il sito. Puoi accettare tutto, rifiutare i non essenziali o personalizzare la scelta.',
        }),
        acceptLabel: fields.text({ label: 'Bottone — Accetta tutto', defaultValue: 'Accetta tutto' }),
        rejectLabel: fields.text({ label: 'Bottone — Solo essenziali', defaultValue: 'Solo essenziali' }),
        customizeLabel: fields.text({ label: 'Bottone — Personalizza', defaultValue: 'Personalizza' }),
        prefsTitle: fields.text({ label: 'Preferenze — Titolo', defaultValue: 'Preferenze cookie' }),
        prefsIntro: fields.text({
          label: 'Preferenze — Introduzione',
          multiline: true,
          defaultValue:
            'Scegli quali categorie di cookie permettere. I cookie tecnici sono necessari al funzionamento del sito e non possono essere disattivati.',
        }),
        managePrefsLabel: fields.text({
          label: 'Footer — Etichetta "Gestisci cookie"',
          defaultValue: 'Gestisci cookie',
        }),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Cookie Policy — pagina completa
    // ──────────────────────────────────────────────────────────────────────
    cookiePolicy: singleton({
      label: 'Cookie — Policy',
      path: 'content/pages/cookie-policy',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Titolo', defaultValue: 'Cookie Policy' }),
        lastUpdated: fields.date({ label: 'Ultimo aggiornamento' }),
        body: fields.text({
          label: 'Contenuto (Markdown leggero — usa riga vuota per separare i paragrafi, ## per titoli)',
          multiline: true,
        }),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Privacy Policy — pagina completa
    // ──────────────────────────────────────────────────────────────────────
    privacyPolicy: singleton({
      label: 'Privacy Policy',
      path: 'content/pages/privacy-policy',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Titolo', defaultValue: 'Privacy Policy' }),
        lastUpdated: fields.date({ label: 'Ultimo aggiornamento' }),
        body: fields.text({
          label: 'Contenuto (Markdown leggero — usa riga vuota per separare i paragrafi, ## per titoli)',
          multiline: true,
        }),
      },
    }),
  },

  collections: {
    portfolio: collection({
      label: 'Portfolio',
      slugField: 'title',
      path: 'content/portfolio/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({
          name: { label: 'Titolo / slug' },
        }),
        brand: fields.text({
          label: 'Etichetta Brand visualizzata (es. Brand 1)',
          description:
            'Testo mostrato come titolo sulla card. Usa "Brand 1", "Brand 2"… come placeholder oppure il nome reale del cliente.',
        }),
        videoSrc: fields.text({
          label: 'Percorso video (es. /videos/portfolio/biskero.mp4)',
          description:
            'Path relativo al video MP4 in public/. Carica il file in public/videos/portfolio/ e indica qui il percorso.',
        }),
        poster: fields.image({
          label: 'Poster (immagine di fallback)',
          description:
            'Mostrata prima che il video parta o se il browser non lo supporta. Lascia vuoto per usare il primo frame del video.',
          directory: 'src/assets/images/portfolio',
          publicPath: '/src/assets/images/portfolio/',
        }),
        description: fields.text({ label: 'Descrizione', multiline: true }),
        category: fields.select({
          label: 'Categoria',
          options: portfolioCategoryOptions,
          defaultValue: 'social',
        }),
        gridSize: fields.select({
          label: 'Dimensione nella griglia',
          description:
            'Definisce come la card occupa la griglia tipo Pinterest. Mischia formati per dare ritmo.',
          options: portfolioGridSizeOptions,
          defaultValue: 'regular',
        }),
        order: fields.number({ label: 'Ordine', defaultValue: 0 }),
        featured: fields.checkbox({ label: 'In Evidenza', defaultValue: true }),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Articoli — collection completa con corpo Markdoc editabile
    // ──────────────────────────────────────────────────────────────────────
    articles: collection({
      label: 'Articoli',
      slugField: 'title',
      path: 'content/articles/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Titolo' } }),
        tag: fields.text({
          label: 'Tag (Case Study, Intervista, Approfondimento, …)',
          defaultValue: 'Case Study',
        }),
        date: fields.date({ label: 'Data di pubblicazione' }),
        excerpt: fields.text({ label: 'Estratto / preview', multiline: true }),
        readTime: fields.text({
          label: 'Tempo di lettura',
          defaultValue: '5 min di lettura',
        }),
        coverImage: fields.image({
          label: 'Copertina (opzionale)',
          directory: 'src/assets/images/articles',
          publicPath: '/src/assets/images/articles/',
        }),
        featured: fields.checkbox({
          label: 'Mostra in homepage',
          defaultValue: true,
        }),
        order: fields.number({
          label: 'Ordine in homepage (asc)',
          defaultValue: 0,
        }),
        stats: fields.array(
          fields.object({
            num: fields.text({ label: 'Numero / KPI (es. 14.300)' }),
            label: fields.text({ label: 'Etichetta' }),
          }),
          {
            label: 'Box numeri (opzionale, mostrati a fine articolo)',
            itemLabel: (props) =>
              `${props.fields.num.value} — ${props.fields.label.value}`,
          }
        ),
        body: fields.markdoc({
          label: 'Contenuto',
          options: {
            image: {
              directory: 'src/assets/images/articles',
              publicPath: '/src/assets/images/articles/',
            },
          },
        }),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Pagine SEO / Landing Pages
    // ──────────────────────────────────────────────────────────────────────
    landingPages: collection({
      label: 'Pagine SEO',
      slugField: 'title',
      path: 'content/landing-pages/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Nome pagina / slug URL',
            description: 'Es. "agenzia-marketing-modena" → URL /agenzia-marketing-modena',
          },
        }),

        seoTitle: fields.text({ label: 'Titolo SEO' }),
        seoDescription: fields.text({
          label: 'Meta Description',
          multiline: true,
        }),

        // ── HERO ──────────────────────────────────────────────────────────
        hero: fields.object(
          {
            eyebrow: fields.text({
              label: 'Eyebrow (es. Marketing Digitale · Modena)',
            }),
            titleLine1: fields.text({
              label: 'Titolo — Riga 1 (normale)',
              description: 'Es. "Agenzia di Marketing"',
            }),
            titleLine2: fields.text({
              label: 'Titolo — Riga 2 (in colore accent)',
              description: 'Es. "a Modena" — appare in giallo/electric',
            }),
            intro: fields.text({
              label: 'Testo introduttivo',
              multiline: true,
            }),
            ctaLabel: fields.text({
              label: 'Testo CTA principale',
              defaultValue: 'Richiedi una consulenza',
            }),
          },
          { label: 'Hero' }
        ),

        // ── SEZIONE SERVIZI ────────────────────────────────────────────────
        services: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'I nostri servizi' }),
            title: fields.text({ label: 'Titolo sezione' }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Titolo servizio' }),
                desc: fields.text({ label: 'Descrizione', multiline: true }),
              }),
              {
                label: 'Servizi',
                itemLabel: (props) => props.fields.title.value || '(nuovo)',
              }
            ),
          },
          { label: 'Sezione Servizi' }
        ),

        // ── SEZIONE APPROCCIO ──────────────────────────────────────────────
        approach: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Il nostro approccio' }),
            title: fields.text({ label: 'Titolo' }),
            cities: fields.array(
              fields.text({ label: 'Città' }),
              {
                label: 'Città servite (opzionale, mostrate come tag colorati)',
                itemLabel: (props) => props.value || '(vuota)',
              }
            ),
            body1: fields.text({
              label: 'Paragrafo 1',
              multiline: true,
            }),
            body2: fields.text({
              label: 'Paragrafo 2',
              multiline: true,
            }),
          },
          { label: 'Sezione Approccio' }
        ),

        // ── CTA FINALE ─────────────────────────────────────────────────────
        cta: fields.object(
          {
            eyebrow: fields.text({ label: 'Eyebrow', defaultValue: 'Parti adesso' }),
            title: fields.text({ label: 'Titolo' }),
            body: fields.text({ label: 'Testo', multiline: true }),
            ctaLabel: fields.text({
              label: 'Testo bottone principale',
              defaultValue: 'Consulenza gratuita',
            }),
            ctaEmailLabel: fields.text({
              label: 'Testo bottone email (vuoto = usa indirizzo email)',
              defaultValue: '',
              description: 'Lascia vuoto per mostrare direttamente l\'indirizzo email.',
            }),
          },
          { label: 'CTA finale' }
        ),

        // ── SCHEMA.ORG ─────────────────────────────────────────────────────
        schemaService: fields.object(
          {
            serviceType: fields.text({
              label: 'Tipo di servizio (schema.org)',
              defaultValue: 'Digital Marketing',
            }),
            serviceName: fields.text({ label: 'Nome servizio (schema.org)' }),
            serviceDescription: fields.text({
              label: 'Descrizione servizio (schema.org)',
              multiline: true,
            }),
            areaServed: fields.text({
              label: 'Area servita (es. Modena, Emilia-Romagna)',
              defaultValue: 'Modena',
            }),
          },
          { label: 'Schema.org (SEO strutturato)' }
        ),
      },
    }),
  },
});
