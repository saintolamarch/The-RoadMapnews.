/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Sliders, RotateCcw, Info, Settings, Eye, CheckCircle2 } from 'lucide-react';

interface ControlsProps {
  filterMode: 'digital' | 'aged' | 'noir' | 'golden';
  setFilterMode: (mode: 'digital' | 'aged' | 'noir' | 'golden') => void;
  showCoffeeStain: boolean;
  setShowCoffeeStain: (show: boolean) => void;
  showFolds: boolean;
  setShowFolds: (show: boolean) => void;
  inkOffset: boolean;
  setInkOffset: (offset: boolean) => void;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  showInks: boolean;
  setShowInks: (show: boolean) => void;
  onReset: () => void;
}

export default function EditorialControls({
  filterMode,
  setFilterMode,
  showCoffeeStain,
  setShowCoffeeStain,
  showFolds,
  setShowFolds,
  inkOffset,
  setInkOffset,
  fontSize,
  setFontSize,
  showInks,
  setShowInks,
  onReset
}: ControlsProps) {
  return (
    <div className="w-full bg-stone-900 text-stone-100 p-4 rounded-lg shadow-xl border border-stone-800 font-sans select-none mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-850">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-red-500 animate-spin-slow" />
          <h3 className="text-sm font-mono uppercase font-bold tracking-wider text-stone-100">
            Press Room Layout Config
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-mono font-bold bg-neutral-800 hover:bg-neutral-700 text-red-450 px-2 py-1 rounded transition border border-neutral-700 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs font-mono">
        
        {/* Aesthetic Paper Filters */}
        <div className="flex flex-col gap-2">
          <span className="text-stone-400 font-bold uppercase tracking-tight text-[10px] flex items-center gap-1">
            <Sliders className="w-3 h-3 text-red-500" />
            Paper Aesthetic Filter
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'digital', label: 'Fresh Press' },
              { id: 'aged', label: 'Aged Newsprint' },
              { id: 'noir', label: 'Noir Monolithic' },
              { id: 'golden', label: 'Golden Archive' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterMode(f.id as any)}
                className={`py-1.5 px-1.5 text-left border rounded transition text-[10.5px] font-medium flex items-center justify-between cursor-pointer ${
                  filterMode === f.id
                    ? 'border-red-600 bg-red-950/40 text-red-400'
                    : 'border-stone-850 bg-stone-950 hover:bg-stone-850 text-stone-300'
                }`}
              >
                <span>{f.label}</span>
                {filterMode === f.id && <CheckCircle2 className="w-2.5 h-2.5 text-red-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tactile Print Textures (Coffee ring, Fold marks, color calibrations) */}
        <div className="flex flex-col gap-2">
          <span className="text-stone-400 font-bold uppercase tracking-tight text-[10px] flex items-center gap-1">
            <Sliders className="w-3 h-3 text-red-500" />
            Tactile Ink Effects
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setShowCoffeeStain(!showCoffeeStain)}
              className={`py-1.5 px-2 rounded border text-left flex items-center justify-between cursor-pointer ${
                showCoffeeStain
                  ? 'bg-amber-950/50 border-amber-800 text-amber-400'
                  : 'bg-stone-950 border-stone-850 hover:bg-stone-850 text-stone-300'
              }`}
            >
              <span>Coffee Ring</span>
              <span className={`w-1.5 h-1.5 rounded-full ${showCoffeeStain ? 'bg-amber-500 animate-ping' : 'bg-stone-700'}`}></span>
            </button>

            <button
              onClick={() => setShowFolds(!showFolds)}
              className={`py-1.5 px-2 rounded border text-left flex items-center justify-between cursor-pointer ${
                showFolds
                  ? 'bg-rose-950/50 border-rose-800 text-rose-450'
                  : 'bg-stone-950 border-stone-850 hover:bg-stone-850 text-stone-300'
              }`}
            >
              <span>Broadsheet Fold</span>
              <span className={`w-1.5 h-1.5 rounded-full ${showFolds ? 'bg-red-500' : 'bg-stone-700'}`}></span>
            </button>

            <button
              onClick={() => setInkOffset(!inkOffset)}
              className={`py-1.5 px-2 rounded border text-left flex items-center justify-between cursor-pointer ${
                inkOffset
                  ? 'bg-cyan-950/50 border-cyan-850 text-cyan-400'
                  : 'bg-stone-950 border-stone-850 hover:bg-stone-850 text-stone-300'
              }`}
              title="Slight text offsets simulating mechanical printing plates out-of-register coordinates."
            >
              <span>Ink Bleed Plate</span>
              <span className={`w-1.5 h-1.5 rounded-full ${inkOffset ? 'bg-cyan-450' : 'bg-stone-700'}`}></span>
            </button>

            <button
              onClick={() => setShowInks(!showInks)}
              className={`py-1.5 px-2 rounded border text-left flex items-center justify-between cursor-pointer ${
                showInks
                  ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
                  : 'bg-stone-950 border-stone-850 hover:bg-stone-850 text-stone-300'
              }`}
            >
              <span>Palette Targets</span>
              <span className={`w-1.5 h-1.5 rounded-full ${showInks ? 'bg-emerald-500' : 'bg-stone-700'}`}></span>
            </button>
          </div>
        </div>

        {/* Editorial Text Sizing */}
        <div className="flex flex-col gap-2">
          <span className="text-stone-400 font-bold uppercase tracking-tight text-[10px] flex items-center gap-1">
            <Sliders className="w-3 h-3 text-red-500" />
            Article Text Size
          </span>
          <div className="flex items-center justify-between bg-stone-950 border border-stone-850 rounded p-1">
            {[
              { id: 'sm', label: 'Compact' },
              { id: 'base', label: 'Standard' },
              { id: 'lg', label: 'Gothic' },
              { id: 'xl', label: 'Magnified' }
            ].map((sz) => (
              <button
                key={sz.id}
                onClick={() => setFontSize(sz.id as any)}
                className={`py-1 px-1.5 rounded text-[10px] font-bold uppercase tracking-tighter cursor-pointer ${
                  fontSize === sz.id
                    ? 'bg-red-700 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-250 hover:bg-stone-900'
                }`}
              >
                {sz.label}
              </button>
            ))}
          </div>
          <span className="text-[9px] text-stone-500 tracking-wide font-mono italic">
            Changes reading panel layout density instantly.
          </span>
        </div>

        {/* System Broadcast Status */}
        <div className="flex flex-col gap-1.5 bg-stone-950 p-2.5 rounded border border-stone-850">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-stone-300 uppercase text-[9px] tracking-wide">
              MOCKUP TELEMETRY
            </span>
          </div>
          <div className="text-[9.5px] leading-relaxed text-stone-400 space-y-0.5">
            <div>Engine Status: <strong className="text-emerald-500 font-bold">READY</strong></div>
            <div>Plate Target: <strong className="text-stone-200">CYAN-MAGENTA-KEY</strong></div>
            <div>Paper Profile: <strong className="text-stone-200">A2 Newsprint (42gsm)</strong></div>
          </div>
        </div>

      </div>
    </div>
  );
}
