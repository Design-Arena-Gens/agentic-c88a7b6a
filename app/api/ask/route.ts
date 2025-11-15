import { NextRequest } from 'next/server';
// Minimal REST-Aufruf statt AI SDK, um Typkonflikte zu vermeiden

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Du bist ein zuverl?ssiger, faktenorientierter Expertenagent ?ber den Menschen.
- Antworte klar, pr?zise und in deutscher Sprache.
- Themen: Biologie/Medizin (ohne pers?nliche Diagnosen), Psychologie (keine Therapieanweisungen), Geschichte, Kultur, Soziologie, Anthropologie, Ethik.
- Wenn es um Sicherheit, Gesundheit oder Recht geht, weise auf Grenzen hin und biete allgemeinbildende Informationen und seri?se Quellen an.
- Zitiere, wenn m?glich, 1-3 hochwertige Quellen (z. B. WHO, UNESCO, Stanford Encyclopedia, wissenschaftliche ?bersichtsartikel). Wenn unsicher, sage es offen und formuliere Vorsicht.
- Erkl?re komplexe Sachverhalte mit Beispielen und analogien, aber vermeide Spekulation.
`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return Response.json({ error: 'Ung?ltige Eingabe.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback-Antwort ohne API-Key
      const fallback = `Ich kann ohne KI-Schl?ssel nur eine allgemeine Antwort geben.\n\n` +
        `Du kannst einen OPENAI_API_KEY als Umgebungsvariable setzen, um vollst?ndige Antworten zu aktivieren.\n\n` +
        `Allgemeiner Hinweis: Stelle pr?zise Fragen (z. B. "Wie reguliert der Hypothalamus den Schlaf-Wach-Rhythmus?").`;
      return Response.json({ answer: fallback }, { status: 200 });
    }

    const payload = {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Frage: ${question}\n\nAntwort:` }
      ],
      max_tokens: 800
    } as const;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('OpenAI error:', resp.status, errText);
      return Response.json({ answer: 'Entschuldige, die Antwort konnte nicht abgerufen werden.' }, { status: 200 });
    }

    const data = await resp.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return Response.json({ answer: text ?? 'Entschuldige, ich konnte keine Antwort generieren.' }, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return Response.json({ answer: 'Entschuldige, es ist ein Fehler aufgetreten. Bitte versuche es sp?ter erneut.' }, { status: 200 });
  }
}
