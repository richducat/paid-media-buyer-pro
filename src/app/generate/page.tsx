'use client';

import React, { useMemo, useState } from 'react';
import { AdMockup } from '@/components/AdMockup';
import { Share2, Copy, Sparkles, Layout, Eye, MessageSquare } from 'lucide-react';

export default function GeneratePage() {
  const sessionId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    return url.searchParams.get('session_id') ?? 'demo';
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'raw' | 'preview'>('preview');

  const [productName, setProductName] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [proof, setProof] = useState('');
  const [constraints, setConstraints] = useState('');
  const [cta, setCta] = useState('');

  // Extract preview data from content if available
  const previewData = useMemo(() => {
    if (!content) return null;
    // Simple heuristic: look for first headline and first primary text
    const headlineMatch = content.match(/Headline:?\s*(.*)/i) || content.match(/### Headlines\n1\)\s*(.*)/i);
    const primaryTextMatch = content.match(/Primary Text:?\s*(.*)/i) || content.match(/### 10 High-Conversion Primary Texts\n1\)\s*(.*)/i);

    return {
      headline: headlineMatch ? headlineMatch[1].trim() : (offer || "Your Special Offer"),
      primaryText: primaryTextMatch ? primaryTextMatch[1].trim() : `Get the best ${productName} for ${audience}. Limited time only!`,
    };
  }, [content, offer, productName, audience]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setContent('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productName,
          offer,
          audience,
          proof,
          constraints,
          cta,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed');

      setContent(json.content);
      setActiveTab('preview');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold premium-text-gradient">Paid Media Buyer Pro</h1>
          </div>
          <div className="text-xs text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Session: <span className="text-blue-400">{sessionId}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              Campaign Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Business Name</label>
                <input
                  className="glass-input w-full rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/50"
                  placeholder="e.g. Acme SaaS"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">The Offer</label>
                <input
                  className="glass-input w-full rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/50"
                  placeholder="e.g. 50% off for first 100 users"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Target Audience</label>
                <input
                  className="glass-input w-full rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500/50"
                  placeholder="e.g. Marketing agencies doing $10k+/mo"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <button
                className="premium-gradient w-full mt-4 rounded-xl py-4 font-bold text-white shadow-lg shadow-blue-900/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                disabled={loading || !sessionId || !productName || !offer || !audience}
                onClick={onGenerate}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Masterclass Pack...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Strategy Pack
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Col: Output/Preview */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
          {!content ? (
            <div className="flex-1 glass-card rounded-2xl border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Layout className="h-10 w-10 text-neutral-500" />
              </div>
              <h3 className="text-xl font-medium text-neutral-300">Your Strategy Pack Awaits</h3>
              <p className="text-neutral-500 max-w-sm mt-2">Fill in your campaign details on the left to generate a high-converting ad system.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <Eye className="h-4 w-4" /> Live Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('raw')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'raw' ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                  >
                    <Layout className="h-4 w-4" /> Full Strategy
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors tooltip"
                    title="Copy to Clipboard"
                  >
                    <Copy className="h-5 w-5 text-neutral-400" />
                  </button>
                  <button className="p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <Share2 className="h-5 w-5 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* View Content */}
              <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
                {activeTab === 'preview' ? (
                  <div className="p-8 space-y-12 overflow-y-auto max-h-[700px] scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Meta Feed Preview</h4>
                        <AdMockup
                          type="facebook"
                          businessName={productName}
                          headline={previewData?.headline || ''}
                          primaryText={previewData?.primaryText || ''}
                          cta={cta || 'Learn More'}
                        />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest">Instagram Preview</h4>
                        <AdMockup
                          type="instagram"
                          businessName={productName}
                          headline={previewData?.headline || ''}
                          primaryText={previewData?.primaryText || ''}
                          cta={cta || 'Shop Now'}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Google Search Preview</h4>
                      <AdMockup
                        type="google"
                        businessName={productName}
                        headline={previewData?.headline || ''}
                        primaryText={previewData?.primaryText || ''}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="flex-1 bg-transparent p-6 font-mono text-sm text-neutral-300 outline-none resize-none leading-relaxed h-[700px]"
                    value={content}
                    readOnly
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
