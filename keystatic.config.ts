import { config, fields, collection, singleton } from '@keystatic/core';

const isLocal = process.env.NODE_ENV === 'development' || import.meta.env?.DEV;

const storage = isLocal
  ? { kind: 'local' as const }
  : {
      kind: 'github' as const,
      repo: 'Ro0t-set/VisualDigitalAgencyDemo' as const,
    };

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
        // Se lasciati vuoti, il sito usa i loghi di default in src/assets/images/brand/.
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

        social: fields.object(
          {
            facebook: fields.url({ label: 'Facebook' }),
            instagram: fields.url({ label: 'Instagram' }),
            linkedin: fields.url({ label: 'LinkedIn' }),
          },
          { label: 'Social Media' }
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
    // Homepage — solo le sezioni effettivamente usate dal sito
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
            body: fields.text({ label: 'Corpo', multiline: true }),
            tagline: fields.text({
              label: 'Tagline (es. Motor Valley)',
              multiline: true,
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
            title: fields.text({ label: 'Titolo' }),
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
          },
          { label: 'Sezione Contatti' }
        ),
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
        title: fields.slug({ name: { label: 'Titolo' } }),
        image: fields.image({
          label: 'Immagine',
          directory: 'src/assets/images/portfolio',
          publicPath: '/src/assets/images/portfolio/',
        }),
        description: fields.text({ label: 'Descrizione', multiline: true }),
        order: fields.number({ label: 'Ordine', defaultValue: 0 }),
        featured: fields.checkbox({ label: 'In Evidenza' }),
      },
    }),

    // ──────────────────────────────────────────────────────────────────────
    // Articoli — collection completa con corpo Markdoc editabile
    // Ogni articolo è un file content/articles/<slug>.mdoc con frontmatter
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
