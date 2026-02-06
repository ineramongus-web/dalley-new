import React from 'react';
import { AppView, UIElement } from '../types';

interface LogicViewProps {
  onNavigate: (view: AppView) => void;
  selectedElement: UIElement | null;
}

export const LogicView: React.FC<LogicViewProps> = ({ onNavigate, selectedElement }) => {
  return (
    <div className="bg-background-dark font-sans antialiased text-text-dark h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 z-20 bg-background-dark/90 backdrop-blur-md sticky top-0 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(AppView.EDITOR)}
            className="p-2 -ml-2 rounded-full hover:bg-surface-dark-highlight transition-colors text-gray-300"
          >
            <span className="material-icons-round text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logic Node</h1>
            <h2 className="text-lg font-bold text-white">{selectedElement?.name || 'No element selected'}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-surface-dark border border-white/10 text-primary shadow-glow">
            <span className="material-icons-round text-xl">bolt</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24 pt-6 w-full max-w-2xl mx-auto">
        {!selectedElement ? (
          <div className="text-center py-20 text-gray-600">
             <span className="material-icons-round text-6xl mb-4 opacity-10">code_off</span>
             <p>Select an element in the editor to configure logic.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-primary text-xl">functions</span>
                <span className="text-xl font-semibold text-white">Event Listeners</span>
              </div>
            </div>

            {/* Click Event Template */}
            <div className="group relative rounded-3xl bg-surface-dark border border-white/5 shadow-plush overflow-hidden transition-all hover:border-primary/30">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-rose-400"></div>
              <div className="p-6 pl-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-round">touch_app</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Activated</h3>
                      <p className="text-xs text-gray-500">MouseButton1Click / TouchTap</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-green-500 bg-green-500/10 rounded-full hover:bg-green-500/20 transition-colors">
                      <span className="material-icons-round">play_arrow</span>
                    </button>
                    <button className="p-2 text-red-500 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors">
                      <span className="material-icons-round">delete</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-black/40 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Animation</span>
                    <select className="bg-transparent text-xs font-bold text-primary outline-none">
                      <option>None</option>
                      <option>FadeIn_Anim</option>
                      <option>Bounce_Anim</option>
                      <option>SlideOut_Anim</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Damping</span>
                      <span className="text-white font-mono">0.8</span>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">Frequency</span>
                      <span className="text-white font-mono">15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Event */}
            <div className="group relative rounded-3xl bg-surface-dark border border-white/5 shadow-plush overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-700"></div>
              <div className="p-4 pl-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons-round text-gray-500">mouse</span>
                  <span className="font-bold text-white text-sm">MouseEnter / MouseLeave</span>
                </div>
                <span className="material-icons-round text-gray-600">add</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="bg-surface-dark border-t border-white/10 pb-8 pt-4 px-8 flex justify-between items-center z-40 shrink-0">
        <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100" onClick={() => onNavigate(AppView.EDITOR)}>
          <span className="material-icons-round text-2xl">access_time</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Studio</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="relative">
            <span className="material-icons-round text-2xl text-primary">code</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-glow"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Logic</span>
        </button>
        <button className="flex flex-col items-center gap-1 group opacity-40 hover:opacity-100" onClick={() => onNavigate(AppView.GALLERY)}>
          <span className="material-icons-round text-2xl">folder</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Assets</span>
        </button>
      </nav>
    </div>
  );
};
