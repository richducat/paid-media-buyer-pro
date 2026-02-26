'use client';

import React from 'react';
import { Smartphone, Facebook, Search, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

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
            <div className="glass-card w-full max-w-[400px] overflow-hidden rounded-xl bg-white text-black shadow-lg">
                <div className="flex items-center gap-2 p-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {businessName.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold">{businessName}</div>
                        <div className="text-xs text-neutral-500">Sponsored · <Smartphone className="inline h-3 w-3" /></div>
                    </div>
                </div>
                <div className="px-3 pb-3 text-sm leading-snug">
                    {primaryText}
                </div>
                <div className="aspect-video w-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                    {/* Placeholder for ad image */}
                    [Ad Creative Image]
                </div>
                <div className="flex items-center justify-between bg-neutral-100 p-3">
                    <div className="flex-1 pr-4">
                        <div className="text-[10px] uppercase text-neutral-500">{new URL('https://' + businessName.toLowerCase().replace(/\s+/g, '') + '.com').hostname}</div>
                        <div className="line-clamp-1 font-bold">{headline}</div>
                    </div>
                    <button className="rounded bg-neutral-200 px-3 py-1.5 text-xs font-bold uppercase transition-colors hover:bg-neutral-300">
                        {cta}
                    </button>
                </div>
            </div>
        );
    }

    if (type === 'google') {
        return (
            <div className="glass-card w-full max-w-[500px] rounded-xl bg-white p-4 shadow-md text-black">
                <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-5 w-10 items-center justify-center rounded border border-neutral-300 text-[10px] font-bold text-neutral-600">
                        Ad
                    </div>
                    <div className="text-xs text-neutral-700">
                        https://www.{businessName.toLowerCase().replace(/\s+/g, '')}.com/special-offer
                    </div>
                </div>
                <div className="text-xl text-blue-800 hover:underline cursor-pointer mb-1 leading-tight">
                    {headline}
                </div>
                <div className="text-sm text-neutral-600 leading-relaxed">
                    <span className="font-bold">{businessName}</span> — {primaryText}
                </div>
                <div className="mt-3 flex gap-4 border-t pt-3 text-xs text-blue-800 font-medium">
                    <span className="hover:underline cursor-pointer">Contact Us</span>
                    <span className="hover:underline cursor-pointer">View Services</span>
                    <span className="hover:underline cursor-pointer">Get Started</span>
                </div>
            </div>
        );
    }

    // Instagram Default
    return (
        <div className="glass-card w-full max-w-[350px] overflow-hidden rounded-xl bg-white text-black shadow-lg">
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px]">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold">
                            {businessName.charAt(0)}
                        </div>
                    </div>
                    <div className="text-xs font-bold">{businessName.toLowerCase().replace(/\s+/g, '_')}</div>
                </div>
                <MoreHorizontal className="h-4 w-4 text-neutral-500" />
            </div>
            <div className="aspect-square w-full bg-neutral-200 flex items-center justify-center text-neutral-400">
                [Instagram Post Image]
            </div>
            <div className="bg-blue-600 p-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-90">
                {cta.toUpperCase()}
            </div>
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Heart className="h-6 w-6" />
                        <MessageCircle className="h-6 w-6" />
                        <Send className="h-6 w-6" />
                    </div>
                    <Bookmark className="h-6 w-6" />
                </div>
                <div className="text-xs">
                    <span className="font-bold">{businessName.toLowerCase().replace(/\s+/g, '_')}</span>{' '}
                    <span className="text-neutral-700">{primaryText}</span>
                </div>
            </div>
        </div>
    );
};
