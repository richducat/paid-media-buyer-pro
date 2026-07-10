import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 font-bold text-xl tracking-tighter group ${className}`}>
      <div className="premium-gradient p-2 rounded-xl group-hover:scale-105 transition-transform">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      <span className="text-white">
        MediaBuyer<span className="text-cyan-400">Pro</span>
      </span>
    </Link>
  );
}
