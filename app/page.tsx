"use client";
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Page() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hallo! Ich bin dein Menschen-Agent. Stelle mir beliebige Fragen ?ber den Menschen ? Biologie, Psychologie, Kultur, Geschichte, Gesellschaft und mehr.'
  }]);
  const [loading, setLoading] = useState(false);

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    setInput('');
    const nextMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.answer ?? 'Entschuldige, es ist ein Fehler aufgetreten.' }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: 'Es gab ein Problem bei der Beantwortung. Bitte versuche es erneut.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Menschen-Agent</div>
          <div className="subtitle">Antworten zu Biologie, Psychologie, Geschichte, Kultur & Gesellschaft</div>
        </div>
      </div>

      <div className="card">
        <div className="chat" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>{m.content}</div>
          ))}
        </div>
        <form className="inputRow" onSubmit={onAsk}>
          <input
            aria-label="Frage an den Agenten"
            placeholder="Stelle deine Frage ?ber den Menschen..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>{loading ? 'Antwortet?' : 'Fragen'}</button>
        </form>
        <div className="footerNote">
          Antworten werden von einem gro?en Sprachmodell generiert. Bei sensiblen Themen wird mit Vorsicht und Quellenhinweisen geantwortet.
        </div>
      </div>
    </div>
  );
}
