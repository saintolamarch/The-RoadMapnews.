/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Megaphone, Sparkles, Plus } from 'lucide-react';

interface AdvertPanelProps {
  activeTheme?: 'editorial' | 'magazine' | 'cyber';
}

export default function AdvertPanel({ activeTheme = 'editorial' }: AdvertPanelProps) {
  const [showAdDesigner, setShowAdDesigner] = useState(false);
  const [adSize, setAdSize] = useState<'eighth' | 'quarter' | 'half' | 'full'>('eighth');
  const [adText, setAdText] = useState('Mama Cass Jollof: Ultimate Nigerian Catering Services!');
  const [adContact, setAdContact] = useState('0803-555-MAMA');

  const isCyber = activeTheme === 'cyber';

  const getAdPrice = () => {
    switch (adSize) {
      case 'quarter': return 120000;
      case 'half': return 450000;
      case 'full': return 1200000;
      case 'eighth':
      default:
        return 45000;
    }
  };

  const formatNaira = (num: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Editorial Ad Block 1: Classic Cement Broadsheet Ad */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-2 cursor-pointer ${
        isCyber 
          ? 'bg-[#18181b]/40 border-stone-850 hover:bg-[#1f1f23]/50 text-stone-200' 
          : 'bg-white border-[#e2e8f0] hover:bg-stone-50 text-stone-900 shadow-sm'
      }`}>
        <div className={`text-[9px] font-mono tracking-widest text-center uppercase ${isCyber ? 'text-stone-500' : 'text-stone-400'}`}>
          CLASSIFIED DISPATCH
        </div>
        <div className={`border-t border-b py-2 text-center ${isCyber ? 'border-stone-800' : 'border-stone-200'}`}>
          <h4 className={`font-sans font-extrabold text-base tracking-tight uppercase leading-none ${isCyber ? 'text-white' : 'text-stone-1050'}`}>
            DANGOTE CEMENTCO
          </h4>
          <p className="font-mono text-[9px] uppercase tracking-wider font-bold text-red-650 mt-1">
            Build with Solid Sovereign Security
          </p>
        </div>
        <p className={`text-xs text-justify leading-relaxed ${isCyber ? 'text-stone-450' : 'text-stone-650'}`}>
          Premium 42.5R high-grade compound cement blocks. Tested under harsh West African tropical humidity levels. Keep your structures standing for generations.
        </p>
        <div className={`flex justify-between items-center text-[9px] font-mono pt-1 ${isCyber ? 'text-stone-500' : 'text-stone-550'}`}>
          <span>CALL LAGOS: 0800-DANGOTE</span>
        </div>
      </div>

      {/* Editorial Ad Block 2: Airlines Fly Home */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 shadow-md ${
        isCyber 
          ? 'bg-red-950/20 border-red-900/40 text-stone-200' 
          : 'bg-red-955 text-stone-100 border-red-900'
      }`}>
        <div className="text-center">
          <h4 className="font-serif italic font-black text-lg text-stone-100 leading-none tracking-tight">
            LAGOS ✈️ LONDON Heathrow
          </h4>
          <p className="font-mono text-[10px] text-amber-500 font-bold uppercase mt-1">
            Direct Non-stop Boeing 777 Flights
          </p>
        </div>
        <p className={`text-[11px] text-center leading-normal ${isCyber ? 'text-stone-300' : 'text-red-200'}`}>
          Fly in comfort with award-winning traditional hospitality. Book early to secure the summer season rate of <strong className="text-stone-100 text-xs">₦1,250,000</strong>.
        </p>
        <div className={`p-1.5 rounded-lg text-center ${isCyber ? 'bg-red-950/50' : 'bg-red-900'}`}>
          <span className="font-mono text-[9px] text-red-200 font-bold">
            PROMO CODE: FLYCHRONICLE2026
          </span>
        </div>
      </div>

    </div>
  );
}
