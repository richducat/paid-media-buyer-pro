'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  ExternalLink,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageSquareText,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

type WorkspaceTab = 'overview' | 'agent' | 'campaigns' | 'setup';
type AutonomyMode = 'observe' | 'approve' | 'autopilot';

type Readiness = {
  configured: boolean;
  connected: boolean;
  missing: string[];
  connectPath: string;
};

type ReadinessResponse = {
  mode: 'demo' | 'live';
  google: Readiness;
  meta: Readiness;
};

const demoMetrics = [
  { label: 'Ad spend', value: '$12,480', change: '+8.2%', direction: 'up', plain: 'Total paid to Google and Meta this month.' },
  { label: 'Qualified leads', value: '326', change: '+18.4%', direction: 'up', plain: 'People who took a valuable action, not just clicked.' },
  { label: 'Cost per lead', value: '$38.28', change: '-8.7%', direction: 'down', plain: 'Average cost to create one qualified lead.' },
  { label: 'ROAS', value: '4.18×', change: '+0.62×', direction: 'up', plain: 'Estimated revenue returned for every $1 in ad spend.' },
] as const;

const demoActions = [
  {
    id: 'a1',
    platform: 'Google Ads',
    title: 'Add 14 irrelevant searches as negatives',
    plain: 'Stop paying when people search for jobs, free templates, or DIY help.',
    impact: 'Est. $184/mo saved',
    risk: 'Low risk',
    evidence: '42 clicks · $96 spent · 0 leads in 30 days',
  },
  {
    id: 'a2',
    platform: 'Meta Ads',
    title: 'Move $18/day toward the strongest creative',
    plain: 'One ad is producing qualified leads more efficiently. Shift a small amount of budget to it.',
    impact: 'Est. 11 more leads/mo',
    risk: 'Within guardrail',
    evidence: 'Winner CPL $29.14 vs account CPL $38.28',
  },
  {
    id: 'a3',
    platform: 'Google Ads',
    title: 'Hold the brand campaign steady',
    plain: 'Performance is healthy. Changing it now would add risk without a clear upside.',
    impact: 'No change',
    risk: 'Watch only',
    evidence: 'ROAS 7.2× · impression share 82%',
  },
];

const timeline = [
  { time: '9:42 AM', title: 'Search term review completed', detail: '1,284 queries checked across Google Ads.', status: 'Reviewed' },
  { time: '8:10 AM', title: 'Spend anomaly prevented', detail: 'A 31% morning spike triggered the daily budget guardrail.', status: 'Protected' },
  { time: 'Yesterday', title: 'Meta creative mix updated', detail: 'Approved change PM-204 shifted $12/day between active ads.', status: 'Applied' },
  { time: 'Jul 11', title: 'Weekly performance brief created', detail: 'Cross-platform summary reconciled with conversion data.', status: 'Reported' },
];

export default function DashboardPage() {
  const [tab, setTab] = useState<WorkspaceTab>('overview');
  const [mode, setMode] = useState<AutonomyMode>('approve');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [loadingReadiness, setLoadingReadiness] = useState(true);
  const [dismissedActions, setDismissedActions] = useState<string[]>([]);
  const [approvedActions, setApprovedActions] = useState<string[]>([]);

  async function loadReadiness() {
    setLoadingReadiness(true);
    try {
      const response = await fetch('/api/platform-readiness', { cache: 'no-store' });
      if (!response.ok) throw new Error('readiness unavailable');
      setReadiness(await response.json());
    } finally {
      setLoadingReadiness(false);
    }
  }

  useEffect(() => {
    void loadReadiness();
  }, []);

  const visibleActions = useMemo(
    () => demoActions.filter((action) => !dismissedActions.includes(action.id)),
    [dismissedActions],
  );

  const isLive = readiness?.mode === 'live' && (readiness.google.connected || readiness.meta.connected);

  function navigate(next: WorkspaceTab) {
    setTab(next);
    setSidebarOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#19231f] selection:bg-[#f4a261]/30">
      <div className="flex min-h-screen">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#18241f] px-5 py-6 text-[#f8f3e8] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-[15px] bg-[#f2a66f] text-[#18241f] shadow-[0_8px_24px_rgba(242,166,111,.22)]">
                <TrendingUp className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-black tracking-[-.02em]">Paid Media Pro</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-[#9cae9f]">AI media buyer</span>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button>
          </div>

          <div className="mt-9 rounded-2xl border border-white/10 bg-white/[.045] p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d8e1d5] font-black text-[#21352b]">YI</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">Your workspace</div>
                <div className="truncate text-[11px] text-[#9cae9f]">Owner account</div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#789083]" />
            </div>
          </div>

          <nav className="mt-7 space-y-1.5">
            <NavButton icon={<LayoutDashboard />} label="Overview" active={tab === 'overview'} onClick={() => navigate('overview')} />
            <NavButton icon={<Bot />} label="AI media buyer" active={tab === 'agent'} onClick={() => navigate('agent')} count={visibleActions.length} />
            <NavButton icon={<Target />} label="Campaigns" active={tab === 'campaigns'} onClick={() => navigate('campaigns')} />
            <NavButton icon={<Settings2 />} label="Connections & setup" active={tab === 'setup'} onClick={() => navigate('setup')} />
          </nav>

          <div className="mt-auto pt-6">
            <div className="border-t border-white/10 pt-5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.15em] text-[#8ca093]">
                <span>Buyer mode</span>
                <span className="text-[#f2b181]">{mode}</span>
              </div>
              <button onClick={() => setSetupOpen(true)} className="flex w-full items-center justify-between rounded-xl bg-[#26362e] px-3 py-2.5 text-left text-xs font-bold hover:bg-[#30443a]">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f2a66f]" /> Guardrails active</span>
                <ChevronRight className="h-4 w-4 text-[#789083]" />
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && <button className="fixed inset-0 z-40 bg-black/30 lg:hidden" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#d8d3c7] bg-[#f4f0e8]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d6d0c4] bg-white/60 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
              <div>
                <h1 className="text-lg font-black tracking-[-.03em] sm:text-xl">{tabTitle(tab)}</h1>
                <p className="hidden text-xs text-[#69746d] sm:block">Know what is happening, why it matters, and what comes next.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold sm:flex ${isLive ? 'border-[#9db8a7] bg-[#e4eee6] text-[#315c43]' : 'border-[#e3caa5] bg-[#fff5e5] text-[#87561e]'}`}>
                <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-[#4d8a61]' : 'bg-[#d58a33]'}`} />
                {isLive ? 'Live data' : 'Demo workspace'}
              </span>
              <button onClick={() => setSetupOpen(true)} className="rounded-xl bg-[#192b23] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(25,43,35,.16)] hover:bg-[#284337] sm:text-sm">
                {isLive ? 'Manage setup' : 'Connect accounts'}
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
            {!isLive && (
              <div className="mb-7 flex flex-col gap-4 rounded-[22px] border border-[#e1c89e] bg-[#fff9ed] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f6dfbc] text-[#8b5b22]"><Sparkles className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-extrabold">You are viewing sample data</p>
                    <p className="mt-1 max-w-2xl text-xs leading-5 text-[#70685d]">Explore the full workflow safely. Nothing on this screen can spend money or change an ad account until you connect one and choose your approval rules.</p>
                  </div>
                </div>
                <button onClick={() => setSetupOpen(true)} className="inline-flex shrink-0 items-center gap-2 text-xs font-black text-[#77501f]">Start one-click setup <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}

            {tab === 'overview' && <Overview onOpenAgent={() => setTab('agent')} />}
            {tab === 'agent' && (
              <AgentWorkspace
                mode={mode}
                actions={visibleActions}
                approved={approvedActions}
                onApprove={(id) => setApprovedActions((items) => [...items, id])}
                onDismiss={(id) => setDismissedActions((items) => [...items, id])}
              />
            )}
            {tab === 'campaigns' && <CampaignWorkspace />}
            {tab === 'setup' && <SetupWorkspace readiness={readiness} loading={loadingReadiness} onRefresh={loadReadiness} onOpenGuardrails={() => setSetupOpen(true)} />}
          </div>
        </section>
      </div>

      {setupOpen && <GuardrailDrawer mode={mode} onMode={setMode} onClose={() => setSetupOpen(false)} readiness={readiness} />}
    </main>
  );
}

function Overview({ onOpenAgent }: { onOpenAgent: () => void }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#788078]">Last 30 days</p><h2 className="mt-1 text-2xl font-black tracking-[-.04em]">Performance at a glance</h2></div>
            <button className="flex items-center gap-2 text-xs font-bold text-[#66716a]"><RefreshCw className="h-3.5 w-3.5" /> Updated 4 min ago</button>
          </div>
          <div className="grid overflow-hidden rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4] sm:grid-cols-2 xl:grid-cols-4">
            {demoMetrics.map((metric, index) => (
              <div key={metric.label} className={`p-5 lg:p-6 ${index > 0 ? 'border-t border-[#ddd8cd] sm:border-l sm:border-t-0' : ''} ${index === 2 ? 'sm:border-l-0 xl:border-l' : ''}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#69736c]">{metric.label}</span><span className={`flex items-center gap-1 text-[11px] font-black ${metric.direction === 'down' || metric.label === 'ROAS' ? 'text-[#3e7a53]' : 'text-[#3e7a53]'}`}>{metric.direction === 'down' ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}{metric.change}</span></div>
                <div className="mt-3 text-3xl font-black tracking-[-.05em]">{metric.value}</div>
                <p className="mt-3 text-[11px] leading-4 text-[#7a817c]">{metric.plain}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-[#1c2c25] p-6 text-white shadow-[0_18px_50px_rgba(31,49,40,.13)]">
          <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2a66f] text-[#1c2c25]"><Bot className="h-5 w-5" /></span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.15em] text-[#b5c5b9]">Today&apos;s brief</span></div>
          <h3 className="mt-6 text-xl font-black tracking-[-.03em]">Efficiency improved without increasing risk.</h3>
          <p className="mt-3 text-sm leading-6 text-[#b9c7bc]">Lead volume is up 18% while cost per lead is down 9%. I found two low-risk improvements ready for your review.</p>
          <div className="mt-6 border-t border-white/10 pt-5"><button onClick={onOpenAgent} className="flex w-full items-center justify-between text-sm font-extrabold text-[#f5bd91]">Review proposed actions <ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4] p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="text-[11px] font-black uppercase tracking-[.17em] text-[#7b837d]">Blended result</p><h3 className="mt-1 text-lg font-black">Spend and qualified leads</h3></div><span className="rounded-full bg-[#e7eee7] px-3 py-1 text-[10px] font-black text-[#41664c]">Google + Meta</span></div>
          <div className="mt-8 flex h-[220px] items-end gap-2 sm:gap-3">
            {[44, 58, 52, 68, 63, 74, 70, 86, 76, 91, 88, 100].map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className="w-full rounded-t-md bg-[#d7dfd7] transition-all group-hover:bg-[#f2a66f]" style={{ height: `${height}%` }} /><span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#8b918d]">{index + 1}</span></div>)}
          </div>
          <div className="mt-10 flex flex-wrap gap-5 border-t border-[#e2ded5] pt-5 text-xs text-[#66716a]"><span><b className="text-[#26362e]">$3.10</b> avg. cost per click</span><span><b className="text-[#26362e]">7.8%</b> lead rate</span><span><b className="text-[#26362e]">$52,166</b> attributed revenue</span></div>
        </div>

        <div className="rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4] p-5 sm:p-7">
          <div className="flex items-center justify-between"><h3 className="text-lg font-black">Agent activity</h3><Activity className="h-4 w-4 text-[#708078]" /></div>
          <div className="mt-6 space-y-5">{timeline.slice(0, 3).map((item) => <TimelineItem key={item.title} {...item} />)}</div>
          <button onClick={onOpenAgent} className="mt-6 flex items-center gap-2 text-xs font-black text-[#496e58]">View complete audit log <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
      </section>
    </div>
  );
}

function AgentWorkspace({ mode, actions, approved, onApprove, onDismiss }: { mode: AutonomyMode; actions: typeof demoActions[number][]; approved: string[]; onApprove: (id: string) => void; onDismiss: (id: string) => void }) {
  return (
    <div className="grid gap-7 xl:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-6"><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#77827b]">Decision queue</p><h2 className="mt-1 text-2xl font-black tracking-[-.04em]">Changes worth making</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#66716a]">Every recommendation includes the evidence, expected impact, and risk. In {mode} mode, no account change happens without the rule you selected.</p></div>
        <div className="space-y-4">
          {actions.map((action) => {
            const isApproved = approved.includes(action.id);
            return <article key={action.id} className="rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4] p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#e5ece4] text-[#41644e]"><Zap className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-black uppercase tracking-[.13em] text-[#718078]">{action.platform}</span><span className="rounded-full bg-[#eef0ea] px-2 py-1 text-[9px] font-black text-[#657069]">{action.risk}</span></div><h3 className="mt-2 text-lg font-black tracking-[-.02em]">{action.title}</h3><p className="mt-2 text-sm leading-6 text-[#68726c]">{action.plain}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#e4e0d7] pt-4 text-[11px]"><span><b className="text-[#23372c]">Why:</b> {action.evidence}</span><span><b className="text-[#23372c]">Impact:</b> {action.impact}</span></div></div></div><div className="mt-5 flex justify-end gap-2">{isApproved ? <span className="flex items-center gap-2 rounded-xl bg-[#e2eee4] px-4 py-2.5 text-xs font-black text-[#376147]"><Check className="h-4 w-4" /> Approved in demo</span> : <><button onClick={() => onDismiss(action.id)} className="rounded-xl border border-[#d7d2c8] px-4 py-2.5 text-xs font-bold text-[#677069]">Not now</button><button onClick={() => onApprove(action.id)} className="rounded-xl bg-[#20382c] px-4 py-2.5 text-xs font-black text-white">Approve recommendation</button></>}</div></article>;
          })}
          {actions.length === 0 && <div className="rounded-[24px] border border-dashed border-[#c9c4b8] p-12 text-center"><Check className="mx-auto h-6 w-6 text-[#5e806b]" /><h3 className="mt-3 font-black">Queue reviewed</h3><p className="mt-1 text-sm text-[#707970]">There are no more sample recommendations.</p></div>}
        </div>
      </div>
      <aside className="space-y-5">
        <div className="rounded-[24px] bg-[#ead9c4] p-6"><MessageSquareText className="h-5 w-5 text-[#7e5935]" /><h3 className="mt-5 text-lg font-black">Ask your media buyer</h3><p className="mt-2 text-sm leading-6 text-[#695b4c]">Use ordinary language. The agent translates it into platform-specific analysis and a reviewable plan.</p><div className="mt-5 rounded-2xl border border-[#d5bea2] bg-[#f7ead9] p-3 text-xs text-[#6d5a46]">“Why did leads get more expensive this week?”</div><button className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#7b5937] px-4 py-3 text-xs font-black text-white">Open conversation <ArrowRight className="h-4 w-4" /></button></div>
        <div className="rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4] p-6"><div className="flex items-center justify-between"><h3 className="font-black">Audit trail</h3><LockKeyhole className="h-4 w-4 text-[#748078]" /></div><div className="mt-5 space-y-5">{timeline.map((item) => <TimelineItem key={item.title} {...item} />)}</div></div>
      </aside>
    </div>
  );
}

function CampaignWorkspace() {
  return <div><div className="mb-6"><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#77827b]">Cross-platform</p><h2 className="mt-1 text-2xl font-black tracking-[-.04em]">Campaigns in one language</h2><p className="mt-2 text-sm text-[#68726c]">Platform terminology stays available, with a plain-English explanation beside it.</p></div><div className="overflow-hidden rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4]"><div className="grid grid-cols-[1fr_110px_110px_110px] border-b border-[#ddd8ce] px-5 py-3 text-[10px] font-black uppercase tracking-[.12em] text-[#7c847e] sm:grid-cols-[1.4fr_.8fr_.7fr_.7fr_.7fr]"><span>Campaign</span><span className="hidden sm:block">Platform</span><span>Spend</span><span>Results</span><span className="text-right">Status</span></div>{[
    ['Emergency AC Repair — Search', 'Google', '$4,820', '129 leads', 'Healthy'],
    ['Summer comfort — Advantage+', 'Meta', '$3,940', '112 leads', 'Learning'],
    ['Brand protection', 'Google', '$1,180', '58 leads', 'Healthy'],
    ['Retargeting — 30 day', 'Meta', '$2,540', '27 leads', 'Watch'],
  ].map((row) => <div key={row[0]} className="grid grid-cols-[1fr_110px_110px_110px] items-center border-b border-[#ebe7de] px-5 py-4 text-xs last:border-0 sm:grid-cols-[1.4fr_.8fr_.7fr_.7fr_.7fr]"><span className="font-extrabold">{row[0]}</span><span className="hidden text-[#68726c] sm:block">{row[1]}</span><span className="font-bold">{row[2]}</span><span>{row[3]}</span><span className="text-right"><span className="rounded-full bg-[#e4ece4] px-2 py-1 text-[9px] font-black text-[#41634d]">{row[4]}</span></span></div>)}</div><div className="mt-5 rounded-[20px] border border-[#e2c89e] bg-[#fff8e9] p-4 text-xs leading-5 text-[#735b3b]"><b>Demo note:</b> This table is illustrative until an ad account is connected. Paid Media Pro will never mix sample numbers with live account data.</div></div>;
}

function SetupWorkspace({ readiness, loading, onRefresh, onOpenGuardrails }: { readiness: ReadinessResponse | null; loading: boolean; onRefresh: () => void; onOpenGuardrails: () => void }) {
  return <div><div className="mb-7 flex items-end justify-between"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#77827b]">One-click setup</p><h2 className="mt-1 text-2xl font-black tracking-[-.04em]">Connect once. We handle the busywork.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#68726c]">Sign in with the accounts you already own. Paid Media Pro starts read-only, learns your history, and shows its plan before requesting permission to act.</p></div><button onClick={onRefresh} className="hidden items-center gap-2 text-xs font-bold sm:flex"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Recheck</button></div><div className="grid gap-5 lg:grid-cols-2"><ConnectionPanel platform="Google Ads" mark="G" description="Search, Performance Max, Shopping, YouTube, and conversion actions." readiness={readiness?.google} /><ConnectionPanel platform="Meta Ads" mark="M" description="Facebook and Instagram campaigns, creatives, audiences, and Pixel data." readiness={readiness?.meta} /></div><div className="mt-7 grid gap-5 md:grid-cols-3">{[
    ['1', 'Connect securely', 'Google or Meta opens its own sign-in screen. Your password never touches this app.'],
    ['2', 'Review the account', 'The agent reads structure, tracking, spend, and results before recommending anything.'],
    ['3', 'Choose control', 'Keep it read-only, approve each action, or allow bounded autopilot with hard limits.'],
  ].map((step) => <div key={step[0]} className="rounded-[22px] border border-[#d9d4c8] bg-[#fbf9f4] p-5"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e7dfd2] text-xs font-black text-[#6c563c]">{step[0]}</span><h3 className="mt-5 font-black">{step[1]}</h3><p className="mt-2 text-xs leading-5 text-[#6e7770]">{step[2]}</p></div>)}</div><button onClick={onOpenGuardrails} className="mt-7 flex w-full items-center justify-between rounded-[22px] bg-[#1d3027] p-5 text-left text-white"><span className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><ShieldCheck className="h-5 w-5 text-[#f2ac79]" /></span><span><b className="block text-sm">Set budget and approval guardrails</b><span className="mt-1 block text-xs text-[#b7c6bb]">Daily caps, change limits, protected campaigns, and automatic stop rules.</span></span></span><ChevronRight className="h-5 w-5" /></button></div>;
}

function ConnectionPanel({ platform, mark, description, readiness }: { platform: string; mark: string; description: string; readiness?: Readiness }) {
  const status = readiness?.connected ? 'Connected' : readiness?.configured ? 'Ready to connect' : 'Needs app credentials';
  return <div className="rounded-[24px] border border-[#d9d4c8] bg-[#fbf9f4] p-6"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e8e3d8] text-lg font-black">{mark}</span><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[.1em] ${readiness?.connected ? 'bg-[#e2ede3] text-[#3b6749]' : 'bg-[#f2eadc] text-[#7b6244]'}`}>{status}</span></div><h3 className="mt-6 text-lg font-black">{platform}</h3><p className="mt-2 text-xs leading-5 text-[#6d766f]">{description}</p>{readiness && !readiness.configured && <p className="mt-4 rounded-xl bg-[#f5eee2] p-3 text-[10px] leading-4 text-[#785f41]">Production setup needs: {readiness.missing.join(', ')}.</p>}<a href={readiness?.configured ? readiness.connectPath : '#'} onClick={(event) => { if (!readiness?.configured) event.preventDefault(); }} className={`mt-5 flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-black ${readiness?.configured ? 'bg-[#20372c] text-white' : 'cursor-not-allowed bg-[#e5e1d8] text-[#8a8d87]'}`}><span>{readiness?.connected ? 'Manage connection' : readiness?.configured ? `Continue with ${platform.split(' ')[0]}` : 'Connection not configured'}</span><ExternalLink className="h-3.5 w-3.5" /></a></div>;
}

function GuardrailDrawer({ mode, onMode, onClose, readiness }: { mode: AutonomyMode; onMode: (mode: AutonomyMode) => void; onClose: () => void; readiness: ReadinessResponse | null }) {
  return <div className="fixed inset-0 z-[70] flex justify-end bg-[#152019]/35 backdrop-blur-sm" onMouseDown={onClose}><aside onMouseDown={(event) => event.stopPropagation()} className="h-full w-full max-w-[520px] overflow-y-auto bg-[#fbf8f1] p-6 shadow-[-20px_0_70px_rgba(20,35,27,.18)] sm:p-8"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#79827c]">Control center</p><h2 className="mt-1 text-2xl font-black tracking-[-.04em]">How much can the agent do?</h2></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-[#d7d2c8]"><X className="h-4 w-4" /></button></div><p className="mt-3 text-sm leading-6 text-[#68726c]">Start conservatively and increase autonomy only after you trust the recommendations. Emergency stop rules always stay active.</p><div className="mt-7 space-y-3">{[
    ['observe', EyeIcon(), 'Watch only', 'Analyze accounts and explain opportunities. Never make changes.'],
    ['approve', CheckIcon(), 'Ask me first', 'Prepare exact changes. Apply only after you approve each one.'],
    ['autopilot', BotIcon(), 'Bounded autopilot', 'Apply low-risk changes inside the limits you define.'],
  ].map(([key, icon, title, detail]) => <button key={key as string} onClick={() => onMode(key as AutonomyMode)} className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left ${mode === key ? 'border-[#587862] bg-[#e8efe7]' : 'border-[#ddd8ce] bg-white/40'}`}><span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-[#dce5dc] text-[#3f634d]">{icon}</span><span className="flex-1"><b className="block text-sm">{title}</b><span className="mt-1 block text-xs leading-5 text-[#6b746e]">{detail}</span></span>{mode === key && <Check className="mt-2 h-4 w-4 text-[#376047]" />}</button>)}</div><div className="mt-8 border-t border-[#ddd8ce] pt-6"><h3 className="text-sm font-black">Always-on protections</h3><div className="mt-4 space-y-3">{['Never exceed the daily account budget', 'Pause and alert on abnormal spend spikes', 'Never launch without working conversion tracking', 'Keep a before-and-after record of every change', 'Protect branded and legally sensitive campaigns'].map((rule) => <div key={rule} className="flex items-center gap-3 text-xs text-[#59655e]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#deeadf] text-[#376048]"><Check className="h-3 w-3" /></span>{rule}</div>)}</div></div><div className="mt-8 rounded-2xl bg-[#1d3027] p-5 text-white"><div className="flex items-center gap-2 text-xs font-black"><LockKeyhole className="h-4 w-4 text-[#f2aa77]" /> Live execution status</div><p className="mt-2 text-xs leading-5 text-[#b9c7bd]">{readiness?.google.connected || readiness?.meta.connected ? 'At least one platform reports a stored connection.' : 'No live ad account is connected. Changes are impossible in this demo workspace.'}</p></div><button onClick={onClose} className="mt-7 w-full rounded-xl bg-[#f0a36c] py-3.5 text-sm font-black text-[#1d3027]">Save control settings</button></aside></div>;
}

function NavButton({ icon, label, active, onClick, count }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; count?: number }) { return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${active ? 'bg-[#f1a36d] text-[#18241f]' : 'text-[#aebdb1] hover:bg-white/[.05] hover:text-white'}`}><span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span><span className="flex-1">{label}</span>{count ? <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[9px] ${active ? 'bg-[#18241f] text-white' : 'bg-white/10'}`}>{count}</span> : null}</button>; }
function TimelineItem({ time, title, detail, status }: { time: string; title: string; detail: string; status: string }) { return <div className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e49b68] ring-4 ring-[#f3e4d7]" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><b className="text-xs">{title}</b><span className="text-[9px] font-black uppercase tracking-wider text-[#6f7c74]">{status}</span></div><p className="mt-1 text-[11px] leading-4 text-[#788079]">{detail}</p><span className="mt-1 block text-[9px] font-bold uppercase text-[#999d98]">{time}</span></div></div>; }
function tabTitle(tab: WorkspaceTab) { return { overview: 'Account overview', agent: 'AI media buyer', campaigns: 'Campaigns', setup: 'Connections & setup' }[tab]; }
function EyeIcon() { return <Gauge className="h-4 w-4" />; }
function CheckIcon() { return <ShieldCheck className="h-4 w-4" />; }
function BotIcon() { return <Bot className="h-4 w-4" />; }
