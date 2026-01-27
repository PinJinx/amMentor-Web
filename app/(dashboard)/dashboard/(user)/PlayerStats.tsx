'use client';

import { TrendingUp, Medal, Trophy } from 'lucide-react';

export default function PlayerStats({ rank, points }: { rank: number, points: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* Rank Card - Orange Gradient */}
            <div className="bg-gradient-to-br from-orange-300 to-orange-500 rounded-3xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,152,0,0.2)] transition-shadow">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute right-4 top-4 opacity-20 transform rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500">
                    <Trophy size={80} className="text-black" />
                </div>
                
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b-2 border-black/10 pb-2 mb-4 inline-block">
                    Your Rank
                </h3>
                
                <div className="flex items-baseline gap-2 mb-1 relative z-10">
                    <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
                        #{rank > 0 ? rank : '-'}
                    </span>
                </div>
                
                <div className="mt-4 inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-gray-900">
                    <TrendingUp size={14} />
                    Current Standing
                </div>
            </div>

            {/* Points Card - Yellow Gradient */}
            <div className="bg-gradient-to-br from-[#FFD54F] to-[#FFB300] rounded-3xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,213,79,0.2)] transition-shadow">
                <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/20 rounded-full blur-2xl -mr-10 -mb-10"></div>
                <div className="absolute -right-2 -bottom-2 opacity-20 transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500">
                    <Medal size={80} className="text-black" />
                </div>
                
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b-2 border-black/10 pb-2 mb-4 inline-block">
                    Points Earned
                </h3>
                
                <div className="flex items-baseline gap-2 mb-1 relative z-10">
                    <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
                        {points}
                    </span>
                    <span className="text-sm font-bold text-gray-900/70">XP</span>
                </div>
                
                <div className="mt-4 inline-flex items-center gap-2 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-gray-900">
                    <Medal size={14} />
                    Total Score
                </div>
            </div>
        </div>
    );
}