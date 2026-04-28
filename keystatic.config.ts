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
    // Impostazioni Globali del sito
    global: singleton({
      label: 'Impostazioni Globali',
      path: 'content/settings/global',
      format: { data: 'json' },
      schema: {
        companyName: fields.text({ label: 'Nome Azienda' }),
        tagline: fields.text({ label: 'Tagline' }),
        logoNavbar: fields.image({
          label: 'Logo Navbar (piccolo)',
          directory: 'src/assets/images/uploads',
          publicPath: '/src/assets/images/uploads/',
        }),
        logoHero: fields.image({
          label: 'Logo Hero (completo)',
          directory: 'src/assets/images/uploads',
          publicPath: '/src/assets/images/uploads/',
        }),
        colors: fields.object({
          primary: fields.text({ label: 'Colore Primario (Deep)', defaultValue: '#0B1F3A' }),
          secondary: fields.text({ label: 'Colore Secondario (Ink)', defaultValue: '#0A0A0A' }),
          accent: fields.text({ label: 'Colore Accent (Electric)', defaultValue: '#1F4BFF' }),
        }, { label: 'Colori' }),
        contact: fields.object({
          email: fields.text({ label: 'Email' }),
          phone: fields.text({ label: 'Telefono' }),
          address: fields.text({ label: 'Indirizzo' }),
        }, { label: 'Contatti' }),
        social: fields.object({
          facebook: fields.url({ label: 'Facebook' }),
          instagram: fields.url({ label: 'Instagram' }),
          linkedin: fields.url({ label: 'LinkedIn' }),
          twitter: fields.url({ label: 'Twitter/X' }),
        }, { label: 'Social Media' }),
        seo: fields.object({
          titleSuffix: fields.text({ label: 'Suffisso Titolo SEO' }),
          defaultDescription: fields.text({ label: 'Descrizione Default', multiline: true }),
        }, { label: 'SEO' }),
        form: fields.object({
          web3formsKey: fields.text({ label: 'Web3Forms Access Key' }),
        }, { label: 'Form Contatti' }),
        legal: fields.object({
          piva: fields.text({ label: 'Partita IVA' }),
          codiceDestinatario: fields.text({ label: 'Codice Destinatario SDI' }),
        }, { label: 'Dati Legali' }),
      },
    }),

    // Homepage - tutte le sezioni
    homepage: singleton({
      label: 'Homepage',
      path: 'content/pages/homepage',
      format: { data: 'json' },
      schema: {
        seo: fields.object({
          title: fields.text({ label: 'Titolo SEO' }),
          description: fields.text({ label: 'Descrizione SEO', multiline: true }),
        }, { label: 'SEO' }),

        // --- Sezioni storiche (mantenute per non rompere dati esistenti) ---
        hero: fields.object({
          badge: fields.text({ label: 'Badge (non usato nel nuovo design, lasciato per compat.)' }),
          title: fields.text({ label: 'Titolo (non usato)' }),
          subtitle: fields.text({ label: 'Sottotitolo (non usato)', multiline: true }),
          ctaPrimary: fields.object({
            text: fields.text({ label: 'Testo' }),
            link: fields.text({ label: 'Link' }),
          }, { label: 'CTA Primario' }),
          ctaSecondary: fields.object({
            text: fields.text({ label: 'Testo' }),
            link: fields.text({ label: 'Link' }),
          }, { label: 'CTA Secondario' }),
        }, { label: 'Hero (legacy)' }),

        about: fields.object({
          badge: fields.text({ label: 'Badge' }),
          title: fields.text({ label: 'Titolo' }),
          description: fields.text({ label: 'Descrizione', multiline: true }),
          backgroundImage: fields.text({ label: 'URL Immagine Background' }),
        }, { label: 'About (legacy)' }),

        services: fields.object({
          badge: fields.text({ label: 'Badge' }),
          title: fields.text({ label: 'Titolo' }),
          subtitle: fields.text({ label: 'Sottotitolo' }),
          description: fields.text({ label: 'Descrizione', multiline: true }),
        }, { label: 'Sezione Servizi (legacy)' }),

        trailer: fields.object({
          badge: fields.text({ label: 'Badge' }),
          title: fields.text({ label: 'Titolo' }),
          videoUrl: fields.text({ label: 'URL Video (YouTube/Vimeo)' }),
          backgroundImage: fields.text({ label: 'URL Immagine Background' }),
          playButtonText: fields.text({ label: 'Testo sotto play button' }),
        }, { label: 'Trailer (legacy)' }),

        portfolio: fields.object({
          badge: fields.text({ label: 'Badge' }),
          title: fields.text({ label: 'Titolo' }),
          subtitle: fields.text({ label: 'Sottotitolo' }),
        }, { label: 'Sezione Portfolio' }),

        social: fields.object({
          badge: fields.text({ label: 'Badge' }),
          title: fields.text({ label: 'Titolo' }),
        }, { label: 'Sezione Social' }),

        contact: fields.object({
          title: fields.text({ label: 'Titolo' }),
          description: fields.text({ label: 'Descrizione', multiline: true }),
        }, { label: 'Sezione Contatti' }),

        // --- NUOVE SEZIONI (REAL GOES VIRAL) ---

        manifesto: fields.object({
          eyebrow: fields.text({ label: 'Eyebrow', defaultValue: '01 — Manifesto' }),
          title: fields.text({ label: 'Titolo (multilinea, usa \\n)', multiline: true }),
          body: fields.text({ label: 'Corpo', multiline: true }),
          tagline: fields.text({ label: 'Tagline (es. Motor Valley)', multiline: true }),
          kpis: fields.array(
            fields.object({
              num: fields.number({ label: 'Numero', defaultValue: 0 }),
              suffix: fields.text({ label: 'Suffisso', defaultValue: '' }),
              label: fields.text({ label: 'Etichetta' }),
            }),
            {
              label: 'KPI',
              itemLabel: (props) => `${props.fields.num.value}${props.fields.suffix.value} — ${props.fields.label.value}`,
            }
          ),
        }, { label: 'Manifesto (Chi siamo)' }),

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
            label: 'Servizi (lista editoriale)',
            itemLabel: (props) => `${props.fields.num.value} — ${props.fields.title.value}`,
          }
        ),

        clients: fields.array(
          fields.text({ label: 'Nome cliente' }),
          {
            label: 'Clienti',
            itemLabel: (props) => props.value || '(vuoto)',
          }
        ),

        locations: fields.array(
          fields.object({
            city: fields.text({ label: 'Città' }),
            tag: fields.text({ label: 'Etichetta (es. HQ, Studio Creativo)' }),
            address: fields.text({ label: 'Indirizzo' }),
          }),
          {
            label: 'Sedi',
            itemLabel: (props) => `${props.fields.city.value} — ${props.fields.tag.value}`,
          }
        ),

        team: fields.array(
          fields.object({
            name: fields.text({ label: 'Nome' }),
            role: fields.text({ label: 'Ruolo' }),
            initials: fields.text({ label: 'Iniziali (es. MR)' }),
          }),
          {
            label: 'Team',
            itemLabel: (props) => `${props.fields.name.value} — ${props.fields.role.value}`,
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
            itemLabel: (props) => `${props.fields.author.value}`,
          }
        ),

        articles: fields.array(
          fields.object({
            tag: fields.text({ label: 'Tag (Intervista, Approfondimento…)' }),
            title: fields.text({ label: 'Titolo' }),
            date: fields.text({ label: 'Data (visualizzata)' }),
            href: fields.text({ label: 'Link', defaultValue: '#' }),
          }),
          {
            label: 'Articoli in evidenza',
            itemLabel: (props) => props.fields.title.value,
          }
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
  },
});
