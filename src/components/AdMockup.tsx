'use client';

import React from 'react';
import { Smartphone, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ArrowRight } from 'lucide-react';

interface AdMockupProps {
    type: 'facebook' | 'google' | 'instagram';
    businessName: string;
    headline: string;
    primaryText: string;
    cta?: string;
}

export const AdMockup: React.FC<AdMockupProps> = ({ type, businessName, headline, primaryText, cta = 'Learn More' }) => {
    if (type === 'facebook') {
        return (
            <div className="glass-card w-full max-w-[400px] overflow-hidden rounded-2xl bg-[#0A0F1E] text-slate-200 shadow-2xl border border-white/10 group animate-in fade-in zoom-in-95 duration-500 mx-auto">
                <div className="flex items-center gap-3 p-4">
                    <div className="h-10 w-10 shrink-0 rounded-full premium-gradient flex items-center justify-center text-white font-bold shadow-lg">
                        {businessName.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white tracking-tight">{businessName}</div>
                        <div className="text-xs text-slate-500 font-medium">Sponsored · <Smartphone className="inline h-3 w-3 mb-0.5" /></div>
                    </div>
                </div>
                <div className="px-4 pb-4 text-sm leading-relaxed text-slate-300">
                    {primaryText}
                </div>
                <div className="aspect-video w-full bg-[#030712] flex items-center justify-center text-slate-600 border-y border-white/5 relative overflow-hidden group-hover:bg-[#050B14] transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-violet-500/5 opacity-50"></div>
                    <span className="font-medium tracking-widest uppercase text-xs z-10 opacity-50">[Ad Creative Image]</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 backdrop-blur-md p-4">
                    <div className="flex-1 pr-4">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{new URL('https://' + businessName.toLowerCase().replace(/\s+/g, '') + '.com').hostname}</div>
                        <div className="line-clamp-1 font-bold text-white text-base">{headline}</div>
                    </div>
                    <button className="rounded-xl glass-card border border-white/10 px-4 py-2 text-xs font-bold uppercase transition-all hover-glow hover:bg-white/10 text-white shadow-sm">
                        {cta}
                    </button>
                </div>
            </div>
        );
    }

    if (type === 'google') {
        return (
            <div className="glass-card w-full max-w-[500px] rounded-2xl bg-[#0A0F1E] p-6 shadow-2xl border border-white/10 text-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-5 items-center justify-center rounded px-2 border border-cyan-500/30 text-[10px] font-black tracking-widest uppercase text-cyan-400 bg-cyan-500/10">
                        Ad
                    </div>
                    <div className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                        https://www.{businessName.toLowerCase().replace(/\s+/g, '')}.com/special-offer
                    </div>
                </div>
                <div className="text-xl md:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors font-bold cursor-pointer mb-2 leading-tight">
                    {headline}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed font-medium">
                    <span className="font-bold text-white">{businessName}</span> — {primaryText}
                </div>
                <div className="mt-4 flex gap-6 border-t border-white/10 pt-4 text-xs text-violet-400 font-bold tracking-wide">
                    <span className="hover:text-violet-300 transition-colors cursor-pointer flex items-center gap-1">Contact Us <ArrowRight className="h-3 w-3" /></span>
                    <span className="hover:text-violet-300 transition-colors cursor-pointer flex items-center gap-1">View Services <ArrowRight className="h-3 w-3" /></span>
                </div>
            </div>
        );
    }

    // Instagram Default
    return (
        <div className="glass-card w-full max-w-[350px] overflow-hidden rounded-2xl bg-[#0A0F1E] text-slate-200 shadow-2xl border border-white/10 group animate-in fade-in zoom-in-95 duration-500 mx-auto">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-tr from-orange-500 via-pink-500 to-violet-500 p-[2px]">
                        <div className="h-full w-full rounded-full bg-[#030712] flex items-center justify-center text-[10px] font-bold text-white">
                            {businessName.charAt(0)}
                        </div>
                    </div>
                    <div className="text-sm font-bold tracking-tight text-white">{businessName.toLowerCase().replace(/\s+/g, '_')}</div>
                </div>
                <MoreHorizontal className="h-5 w-5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
            </div>
            <div className="aspect-square w-full bg-[#030712] flex items-center justify-center text-slate-600 border-y border-white/5 relative overflow-hidden group-hover:bg-[#050B14] transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-violet-500/5 opacity-50"></div>
                <span className="font-medium tracking-widest uppercase text-xs z-10 opacity-50">[Instagram Post Image]</span>
            </div>
            <div className="premium-gradient p-3 text-center text-xs font-extrabold tracking-widest text-white transition-opacity hover-glow border-b border-white/10 cursor-pointer">
                {cta.toUpperCase()}
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <Heart className="h-6 w-6 hover:text-rose-500 transition-colors cursor-pointer" />
                        <MessageCircle className="h-6 w-6 hover:text-slate-300 transition-colors cursor-pointer" />
                        <Send className="h-6 w-6 hover:text-slate-300 transition-colors cursor-pointer" />
                    </div>
                    <Bookmark className="h-6 w-6 hover:text-slate-300 transition-colors cursor-pointer" />
                </div>
                <div className="text-sm leading-relaxed">
                    <span className="font-bold text-white mr-2">{businessName.toLowerCase().replace(/\s+/g, '_')}</span>
                    <span className="text-slate-300 font-medium">{primaryText}</span>
                </div>
            </div>
        </div>
    );
};
