'use client';

import React, { useMemo, useState } from 'react';
import { AdMockup } from '@/components/AdMockup';
import { Logo } from '@/components/Logo';
import {
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  Layout,
  Loader2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function GeneratePage() {
  const sessionId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    return url.searchParams.get('session_id') ?? 'demo';
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('raw');
  const [copied, setCopied] = useState(false);

  const [productName, setProductName] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [proof, setProof] = useState('');
  const [constraints, setConstraints] = useState('');
  const [cta, setCta] = useState('');

  const previewData = useMemo(() => extractPreview(content, { offer, productName, audience }), [content, offer, productName, audience]);

  async function onGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productName,
          offer,
          audience,
          proof: proof || undefined,
          constraints: constraints || undefined,
          cta: cta || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Generation failed — please try again');

      setContent(json.content);
      setActiveTab('raw');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onDownload() {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(productName || 'creative-pack').toLowerCase().replace(/\s+/g, '-')}-strategy-pack.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 pb-20 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40rem] max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-0 md:left-20 w-[40rem] h-[25rem] bg-cyan-500/5 rounded-full blur-[130px] mix-blend-screen" />
        <div className="absolute top-20 right-0 md:right-20 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[130px] mix-blend-screen" />
      </div>

      {/* Header */}
      <div className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between">
          <Logo />
          <div className="text-xs text-slate-400 font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10 max-w-[45vw] truncate">
            Session: <span className="text-cyan-400">{sessionId}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Col: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-3xl">
            <h2 className="text-lg font-black mb-6 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
              </div>
              Campaign Details
            </h2>
            <div className="space-y-5">
              <Field label="Business / Product Name" required value={productName} onChange={setProductName} placeholder="e.g. Roanoke AC Pros" />
              <Field label="The Offer" required value={offer} onChange={setOffer} placeholder="e.g. Free estimate + $50 off first repair" />
              <Field label="Target Audience" required value={audience} onChange={setAudience} placeholder="e.g. Homeowners in Roanoke, VA" />
              <Field label="Proof / Credibility" value={proof} onChange={setProof} placeholder="e.g. 4.9 stars · 500+ jobs done" hint="Optional" />
              <Field label="Call to Action" value={cta} onChange={setCta} placeholder="e.g. Book Now" hint="Optional" />
              <Field label="Constraints" value={constraints} onChange={setConstraints} placeholder="e.g. No discounts on new installs" hint="Optional" />

              <button
                className="premium-gradient hover-glow w-full mt-2 rounded-xl py-4 font-extrabold text-white shadow-lg shadow-cyan-900/30 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border border-white/20"
                disabled={loading || !sessionId || !productName || !offer || !audience}
                onClick={onGenerate}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Building your pack…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {content ? 'Regenerate Pack' : 'Generate Strategy Pack'}
                  </>
                )}
              </button>
              {loading ? (
                <p className="text-xs text-slate-500 font-medium text-center animate-pulse">
                  Writing hooks, scripts, keywords, and your launch plan — usually 30–60 seconds.
                </p>
              ) : null}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Right Col: Output/Preview */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
          {!content ? (
            <div className="flex-1 glass-card rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Layout className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-300">Your Strategy Pack Awaits</h3>
              <p className="text-slate-500 max-w-sm mt-2 font-medium">
                Fill in your campaign details on the left to generate a high-converting ad system.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Tabs + Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <TabButton active={activeTab === 'raw'} onClick={() => setActiveTab('raw')} icon={<FileText className="h-4 w-4" />} label="Full Strategy" />
                  <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Eye className="h-4 w-4" />} label="Ad Previews" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void onCopy()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold"
                  >
                    <Download className="h-4 w-4 text-cyan-400" /> Download .md
                  </button>
                </div>
              </div>

              {/* View Content */}
              <div className="flex-1 glass-card rounded-3xl overflow-hidden flex flex-col">
                {activeTab === 'preview' ? (
                  <div className="p-6 md:p-8 space-y-12 overflow-y-auto max-h-[750px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Meta Feed Preview</h4>
                        <AdMockup
                          type="facebook"
                          businessName={productName}
                          headline={previewData.headline}
                          primaryText={previewData.primaryText}
                          cta={cta || 'Learn More'}
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest">Instagram Preview</h4>
                        <AdMockup
                          type="instagram"
                          businessName={productName}
                          headline={previewData.headline}
                          primaryText={previewData.primaryText}
                          cta={cta || 'Shop Now'}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Google Search Preview</h4>
                      <AdMockup
                        type="google"
                        businessName={productName}
                        headline={previewData.headline}
                        primaryText={previewData.primaryText}
                      />
                    </div>

                    <p className="text-xs text-slate-500 font-medium text-center">
                      Previews use the first headline and primary text from your pack — switch to Full Strategy for all variants.
                    </p>
                  </div>
                ) : (
                  <div className="p-6 md:p-10 overflow-y-auto max-h-[750px]">
                    <MarkdownView markdown={content} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
        active ? 'premium-gradient text-white shadow-lg' : 'text-slate-400 hover:text-white'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
          {label} {required ? <span className="text-cyan-400">*</span> : null}
        </label>
        {hint ? <span className="text-[10px] text-slate-500 font-bold">{hint}</span> : null}
      </div>
      <input
        className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 font-medium"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/**
 * Pull the first usable headline + primary text out of the generated markdown
 * so the ad mockups show real content from the pack.
 */
function extractPreview(
  content: string,
  fallback: { offer: string; productName: string; audience: string },
): { headline: string; primaryText: string } {
  const firstListItemAfter = (sectionPattern: RegExp): string | null => {
    const sectionMatch = content.match(sectionPattern);
    if (!sectionMatch || sectionMatch.index === undefined) return null;
    const rest = content.slice(sectionMatch.index + sectionMatch[0].length);
    const item = rest.match(/^\s*(?:\d+[).]\s*|[-*]\s+)(.+)$/m);
    return item ? cleanInline(item[1]).trim() : null;
  };

  const headline =
    firstListItemAfter(/#+.*headline.*$/im) ??
    firstListItemAfter(/#+.*hooks?.*$/im) ??
    (fallback.offer || 'Your Special Offer');

  const primaryText =
    firstListItemAfter(/#+.*primary text.*$/im) ??
    firstListItemAfter(/#+.*(ad copy|copy variants).*$/im) ??
    (fallback.productName
      ? `${fallback.productName} — built for ${fallback.audience || 'you'}. ${fallback.offer}`.trim()
      : 'Your primary ad text will appear here.');

  return { headline, primaryText };
}

function cleanInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1');
}

/**
 * Dependency-free markdown renderer for the strategy pack: headings,
 * ordered/unordered lists, bold/italic/code spans, paragraphs.
 */
function MarkdownView({ markdown }: { markdown: string }) {
  const blocks = useMemo(() => parseBlocks(markdown), [markdown]);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === 'h1') {
          return (
            <h1 key={i} className="text-2xl md:text-3xl font-black text-white tracking-tight pt-6 first:pt-0 pb-2 border-b border-white/10">
              <Inline text={block.text} />
            </h1>
          );
        }
        if (block.type === 'h2') {
          return (
            <h2 key={i} className="text-xl font-black premium-text-gradient tracking-tight pt-5">
              <Inline text={block.text} />
            </h2>
          );
        }
        if (block.type === 'h3') {
          return (
            <h3 key={i} className="text-base font-extrabold text-cyan-300 uppercase tracking-widest pt-3">
              <Inline text={block.text} />
            </h3>
          );
        }
        if (block.type === 'ol' || block.type === 'ul') {
          return (
            <ul key={i} className="space-y-2.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-sm text-slate-300 font-medium leading-relaxed">
                  <span className="text-cyan-400 font-black shrink-0 min-w-[1.25rem] text-right">
                    {block.type === 'ol' ? `${j + 1}.` : '•'}
                  </span>
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm text-slate-400 font-medium leading-relaxed">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split('\n');
  const blocks: Block[] = [];
  let list: { type: 'ol' | 'ul'; items: string[] } | null = null;
  let paragraph: string[] = [];

  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };
  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') });
      paragraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushList();
      flushParagraph();
      const level = heading[1].length;
      blocks.push({ type: level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3', text: heading[2] });
      continue;
    }

    const ordered = trimmed.match(/^\d+[).]\s+(.*)$/);
    if (ordered) {
      flushParagraph();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.*)$/);
    if (unordered) {
      flushParagraph();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(unordered[1]);
      continue;
    }

    // Continuation of a list item (indented text under a numbered script)
    if (list && /^\s{2,}/.test(raw)) {
      list.items[list.items.length - 1] += ` ${trimmed}`;
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushList();
  flushParagraph();
  return blocks;
}

/** Render **bold**, *italic*, and `code` spans. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|\*.+?\*|`.+?`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-white font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded px-1.5 py-0.5 text-[0.85em] font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <em key={i} className="text-slate-200">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
