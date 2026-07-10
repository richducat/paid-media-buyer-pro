import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="py-12 bg-[#030712] border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-6 opacity-50">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-xl tracking-tighter text-white">
            MediaBuyer<span className="text-cyan-400">Pro</span>
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8 text-sm font-semibold text-slate-400">
          <Link href="/wizard" className="hover:text-cyan-400 transition-colors">Ads Wizard</Link>
          <Link href="/generate" className="hover:text-cyan-400 transition-colors">Generator</Link>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
        </nav>

        <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
          Disclaimer: Results depend on your specific offer, sales funnel, and market execution.
          MediaBuyerPro generates strategy and creative — you stay in control of what you launch and spend.
          <br />
          <span className="block mt-3">© {new Date().getFullYear()} MediaBuyerPro. All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}
