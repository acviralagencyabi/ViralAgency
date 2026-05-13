import { config, fields, collection, singleton } from '@keystatic/core';

const isLocal = process.env.NODE_ENV === 'development' || import.meta.env?.DEV;

const storage = isLocal
  ? { kind: 'local' as const }
  : {
      kind: 'github' as const,
      repo: 'Ro0t-set/VisualDigitalAgencyDemo' as const,
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
              label: 'URL profilo Google (recensioni)',
              description: 'Link al profilo Google Business per le recensioni.',
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

        clients: fields.array(fields.text({ label: 'Nome cliente' }), {
          label: 'Clienti',
          itemLabel: (props) => props.value || '(vuoto)',
        }),

        locations: fields.array(
          fields.object({
            city: fields.text({ label: 'Città' }),
            tag: fields.text({ label: 'Etichetta (es. HQ, Studio Creativo)' }),
            address: fields.text({ label: 'Indirizzo' }),
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
            description: fields.text({
              label: 'Testo introduttivo (sopra il form contatti)',
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
  },
});
