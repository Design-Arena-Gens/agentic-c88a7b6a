# Menschen-Agent (agentic-c88a7b6a)

Ein Next.js‑basierter Agent, der Fragen über den Menschen beantwortet (Biologie, Psychologie, Geschichte, Kultur, Gesellschaft u. v. m.). Die Beantwortung erfolgt über ein großes Sprachmodell (OpenAI via Vercel AI SDK).

## Schnellstart

1. Abhängigkeiten installieren:

```bash
npm install
```

2. Entwicklungsserver starten:

```bash
npm run dev
```

3. Browser öffnen: `http://localhost:3000`

## Produktion/Deployment (Vercel)

- Erforderliche Variable: `OPENAI_API_KEY`
- Deployment via CLI:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-c88a7b6a
```

## Hinweise
- Ohne `OPENAI_API_KEY` liefert der Agent eine begrenzte Fallback-Antwort mit Hinweisen.
- Der Agent gibt keine individuellen medizinischen Diagnosen oder Therapieanweisungen.
