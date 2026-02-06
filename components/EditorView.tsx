import React, { useState, useEffect } from 'react';
import { AppView, UIElement, AnimationKeyframe, RobloxElementType } from '../types';
import { generateLuaCode } from '../lib/lua-exporter';
import { motion, AnimatePresence } from 'framer-motion';
import { FlatCanvas } from './FlatCanvas';

// Enhanced Export Modal
const ExportModal = ({ isOpen, onClose, project }: { isOpen: boolean, onClose: () => void, project: any }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'settings'>('code');
  const [settings, setSettings] = useState({
    minify: false,
    comments: true,
    target: 'Luau',
    spr: { damping: 0.8, frequency: 15, speed: 1 }
  });

  const code = generateLuaCode(project); // In a real app, pass settings to generator

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] w-full max-w-5xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
         {/* Header */}
         <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#121212]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-icons-round text-primary">download</span> Export Project
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
               <span className="material-icons-round">close</span>
            </button>
         </div>

         {/* Mobile/Desktop Tabs */}
         <div className="flex border-b border-white/5 bg-[#0a0a0a]">
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'code' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Code Preview
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Export Settings
            </button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-hidden relative">
            {activeTab === 'code' && (
              <div className="absolute inset-0 flex flex-col">
                 <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0a]">
                    <span className="text-xs font-mono text-gray-400 opacity-60">main.lua</span>
                    <button 
                      className="text-xs text-primary hover:text-white flex items-center gap-1 font-bold bg-primary/10 px-3 py-1.5 rounded-lg transition-colors" 
                      onClick={() => navigator.clipboard.writeText(code)}
                    >
                       <span className="material-icons-round text-sm">content_copy</span> Copy
                    </button>
                 </div>
                 <div className="flex-1 overflow-auto p-6 bg-[#050505]">
                    <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{code}</pre>
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="absolute inset-0 overflow-y-auto p-6 bg-[#0a0a0a] space-y-8">
                 <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">General</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-primary/30 transition-colors">
                         <span className="text-sm font-medium text-gray-200">Target Version</span>
                         <select 
                            value={settings.target}
                            onChange={(e) => setSettings({...settings, target: e.target.value})}
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-primary"
                          >
                            <option value="Luau">Luau (Recommended)</option>
                            <option value="Lua 5.1">Lua 5.1</option>
                         </select>
                      </label>
                      <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-primary/30 transition-colors">
                         <span className="text-sm font-medium text-gray-200">Minify Output</span>
                         <input 
                            type="checkbox" 
                            checked={settings.minify}
                            onChange={(e) => setSettings({...settings, minify: e.target.checked})}
                            className="w-5 h-5 rounded bg-black/40 border-white/20 text-primary focus:ring-0 checked:bg-primary" 
                         />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-primary/30 transition-colors">
                         <span className="text-sm font-medium text-gray-200">Include Comments</span>
                         <input 
                            type="checkbox" 
                            checked={settings.comments}
                            onChange={(e) => setSettings({...settings, comments: e.target.checked})}
                            className="w-5 h-5 rounded bg-black/40 border-white/20 text-primary focus:ring-0 checked:bg-primary" 
                         />
                      </label>
                    </div>
                 </section>

                 <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">SPR Physics Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs text-gray-400 block mb-2">Damping Ratio</span>
                          <input 
                            type="number" 
                            step="0.1"
                            value={settings.spr.damping}
                            onChange={(e) => setSettings({...settings, spr: {...settings.spr, damping: parseFloat(e.target.value)}})}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none"
                          />
                       </div>
                       <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs text-gray-400 block mb-2">Frequency</span>
                          <input 
                            type="number" 
                            value={settings.spr.frequency}
                            onChange={(e) => setSettings({...settings, spr: {...settings.spr, frequency: parseFloat(e.target.value)}})}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none"
                          />
                       </div>
                    </div>
                 </section>
              </div>
            )}
         </div>

         {/* Footer */}
         <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-3 bg-[#121212]">
            <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">Cancel</button>
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
               <span className="material-icons-round text-lg">download</span> Download File
            </button>
         </div>
      </div>
    </div>
  );
};

interface EditorViewProps {
  onNavigate: (view: AppView) => void;
  elements: UIElement[];
  animations: AnimationKeyframe[];
  currentTime: number;
  setCurrentTime: (t: number) => void;
  selectedElement: UIElement | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (type: RobloxElementType) => void;
  onUpdateElementProperties: (id: string, props: Partial<UIElement['properties']>) => void;
  onUpdateElement: (id: string, updates: Partial<UIElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddKeyframe: (elId: string, time: number) => void;
  onUpdateKeyframe: (id: string, updates: Partial<AnimationKeyframe>) => void;
  onDeleteKeyframe: (id: string) => void;
  projectName: string;
  setProjectName: (n: string) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  onNavigate, elements, animations, currentTime, setCurrentTime,
  selectedElement, onSelectElement, onAddElement, onUpdateElementProperties,
  onUpdateElement, onDeleteElement, onAddKeyframe, onUpdateKeyframe, onDeleteKeyframe,
  projectName, setProjectName
}) => {
  const [activeTool, setActiveTool] = useState<'select' | 'move' | 'resize' | 'rotate'>('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bottomTab, setBottomTab] = useState<'timeline' | 'properties' | 'easing' | 'layers'>('timeline');
  const [zoom, setZoom] = useState(1);
  const [expandedTimelineElements, setExpandedTimelineElements] = useState<Set<string>>(new Set());
  const [showExport, setShowExport] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Animation Playback Logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev + 0.016) % 5);
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime]);

  const toggleTimelineExpansion = (id: string) => {
    const newSet = new Set(expandedTimelineElements);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedTimelineElements(newSet);
  };

  const colorToHex = (c: {R:number,G:number,B:number}) => {
    const f = (n:number) => Math.round(n*255).toString(16).padStart(2,'0');
    return `#${f(c.R)}${f(c.G)}${f(c.B)}`;
  };

  const hexToColor = (hex: string) => {
    const r = parseInt(hex.slice(1,3), 16) / 255;
    const g = parseInt(hex.slice(3,5), 16) / 255;
    const b = parseInt(hex.slice(5,7), 16) / 255;
    return { R: r, G: g, B: b };
  };

  const timelineScale = 120; // pixels per second

  return (
    <div className="flex flex-col h-screen bg-background-dark text-text-dark overflow-hidden font-sans">
      <ExportModal 
        isOpen={showExport} 
        onClose={() => setShowExport(false)} 
        project={{ id: '1', name: projectName, elements, animations, duration: 5, lastModified: Date.now() }} 
      />
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 z-[100] bg-background-dark border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(AppView.GALLERY)}>
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-glow">
            <span className="material-icons-round text-2xl">animation</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">dalley.</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-surface-dark rounded-full p-1 border border-white/5">
             <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white" title="Undo">
                <span className="material-icons-round text-xl">undo</span>
             </button>
             <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white" title="Redo">
                <span className="material-icons-round text-xl">redo</span>
             </button>
             <div className="w-px bg-white/10 mx-1 my-1"></div>
             <div className="relative">
                <button 
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className={`p-2 rounded-full hover:bg-white/5 transition-colors ${showMoreActions ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white'}`}
                >
                   <span className="material-icons-round text-xl">more_vert</span>
                </button>
                {/* More Actions Dropdown */}
                <AnimatePresence>
                   {showMoreActions && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                        onMouseLeave={() => setShowMoreActions(false)}
                      >
                         {[
                            { icon: 'layers', label: 'Group Selection' },
                            { icon: 'layers_clear', label: 'Ungroup' },
                            { icon: 'flip_to_front', label: 'Bring to Front' },
                            { icon: 'flip_to_back', label: 'Send to Back' },
                            { icon: 'lock', label: 'Lock Layer' },
                            { icon: 'visibility_off', label: 'Hide Layer' },
                         ].map((item, i) => (
                           <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-primary/20 hover:text-white text-left transition-colors">
                              <span className="material-icons-round text-lg opacity-70">{item.icon}</span>
                              {item.label}
                           </button>
                         ))}
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
          <button onClick={() => setShowExport(true)} className="px-5 py-2.5 rounded-xl bg-surface-dark border border-white/10 flex items-center gap-2 text-primary hover:bg-primary/5 transition-all shadow-plush active:scale-95 group">
            <span className="font-bold text-sm">Export</span>
            <span className="material-icons-round text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <main className="flex-1 relative flex items-center justify-center p-0 z-10 overflow-hidden bg-[#101010]">
           {/* Flat Canvas replaces the old inline loop */}
           <FlatCanvas 
              elements={elements}
              selectedElement={selectedElement?.id || null}
              onSelectElement={onSelectElement}
              onUpdateElement={onUpdateElement}
              activeTool={activeTool}
              zoom={zoom}
              setZoom={setZoom}
              animations={animations}
              currentTime={currentTime}
              isPlaying={isPlaying}
           />

            {/* Floating Workspace Tools */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="flex items-center gap-1 p-2 bg-surface-dark/90 backdrop-blur-2xl border border-white/10 rounded-pill shadow-plush">
                <button onClick={() => setActiveTool('select')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'select' ? 'bg-primary/20 text-primary shadow-glow' : 'text-gray-500 hover:text-gray-300'}`}>
                  <span className="material-icons-round text-2xl">near_me</span>
                </button>
                <button onClick={() => setActiveTool('move')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'move' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
                  <span className="material-icons-round text-2xl">open_with</span>
                </button>
                <button onClick={() => setActiveTool('resize')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'resize' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
                  <span className="material-icons-round text-2xl">aspect_ratio</span>
                </button>
                <button onClick={() => setActiveTool('rotate')} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTool === 'rotate' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
                  <span className="material-icons-round text-2xl">rotate_right</span>
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-glow active:scale-90 transition-transform">
                  <span className="material-icons-round text-2xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                </button>
              </div>
            </div>
        </main>

        {/* Bottom Tabbed Panel */}
        <div className="h-[400px] bg-background-dark border-t border-white/5 flex flex-col z-50">
          <div className="flex items-center justify-between px-8 pt-4 pb-2 bg-background-dark">
            <div className="flex gap-8">
              <button onClick={() => setBottomTab('timeline')} className={`text-lg font-bold pb-2 border-b-[3px] transition-all ${bottomTab === 'timeline' ? 'border-primary text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>Timeline</button>
              <button onClick={() => setBottomTab('properties')} className={`text-lg font-bold pb-2 border-b-[3px] transition-all ${bottomTab === 'properties' ? 'border-primary text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>Properties</button>
              <button onClick={() => setBottomTab('easing')} className={`text-lg font-bold pb-2 border-b-[3px] transition-all ${bottomTab === 'easing' ? 'border-primary text-white' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>Easing</button>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Add Element Button - Always visible as requested */}
              <div className="relative group/add">
                <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors z-[110]">
                  <span className="material-icons-round">add</span>
                </button>
                <div className="absolute bottom-full right-0 mb-4 opacity-0 pointer-events-none group-hover/add:opacity-100 group-hover/add:pointer-events-auto bg-surface-dark border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-2 gap-2 min-w-[240px] z-[120] transition-all duration-300 transform translate-y-2 group-hover/add:translate-y-0">
                  {(['Frame', 'TextLabel', 'TextButton', 'ImageLabel', 'ImageButton', 'ScrollingFrame', 'TextBox'] as RobloxElementType[]).map(type => (
                    <button key={type} onClick={() => onAddElement(type)} className="text-[11px] text-gray-300 hover:text-white p-2.5 hover:bg-white/5 rounded-xl text-left truncate transition-colors flex items-center gap-2">
                      <span className="material-icons-round text-sm opacity-50">add_box</span>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {bottomTab === 'timeline' && (
              <div className="flex h-full overflow-hidden border-t border-white/5">
                 {/* Track Labels */}
                 <div className="w-[200px] border-r border-white/5 overflow-y-auto no-scrollbar py-10 px-4 bg-background-dark shrink-0 relative">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-background-dark/95 backdrop-blur z-10 border-b border-white/5 flex items-center px-4">
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Layers</span>
                    </div>
                    {elements.map(el => (
                      <div key={el.id} className="mb-4 mt-2">
                        <div 
                          onClick={() => onSelectElement(el.id)}
                          className={`flex items-center gap-2 transition-all cursor-pointer group ${selectedElement?.id === el.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                        >
                          <span 
                            onClick={(e) => { e.stopPropagation(); toggleTimelineExpansion(el.id); }}
                            className={`material-icons-round text-sm text-gray-500 transition-transform ${expandedTimelineElements.has(el.id) ? 'rotate-0' : '-rotate-90'}`}
                          >
                            expand_more
                          </span>
                          <span className="material-icons-round text-sm text-gray-500">{el.type === 'TextLabel' ? 'text_fields' : 'image'}</span>
                          <span className="text-[11px] font-bold truncate text-white uppercase tracking-tight">{el.name}</span>
                        </div>
                        
                        <AnimatePresence>
                          {expandedTimelineElements.has(el.id) && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-6 mt-2 space-y-2 border-l border-white/5 ml-2"
                            >
                              {['Position', 'Size', 'Transparency'].map(prop => (
                                <div key={prop} className="text-[10px] text-gray-500 font-medium hover:text-gray-300 cursor-default">{prop}</div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    {elements.length === 0 && <div className="text-[10px] text-gray-600 italic py-4 text-center">No tracks available.</div>}
                 </div>

                 {/* Keyframe Grid */}
                 <div className="flex-1 relative overflow-auto no-scrollbar bg-background-dark">
                    {/* Time Scale Header - Scoped inside timeline tab */}
                    <div className="h-8 border-b border-white/5 sticky top-0 bg-background-dark z-20 flex items-center px-4 min-w-full">
                       {Array.from({ length: 60 }).map((_, i) => (
                         <div key={i} className="absolute h-full flex flex-col justify-end pb-1" style={{ left: i * (timelineScale / 5) + 16 }}>
                             <div className={`w-px bg-white/20 ${i % 5 === 0 ? 'h-3' : 'h-1.5'}`}></div>
                             {i % 5 === 0 && <span className="absolute bottom-4 -translate-x-1/2 text-[9px] text-gray-500 font-mono">{i/5}s</span>}
                         </div>
                       ))}
                    </div>

                    <div className="p-4 pt-2 relative min-h-full" style={{ width: '2000px' }}> {/* Forced width for scrolling */}
                      {/* Playhead line */}
                      <div className="absolute top-0 bottom-0 w-px bg-white z-30 pointer-events-none" style={{ left: currentTime * timelineScale + 16 }}>
                         <div className="absolute -top-1 -translate-x-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-glow" />
                      </div>

                      <div className="space-y-4 mt-2">
                        {elements.map(el => (
                          <div key={el.id} className="flex flex-col mb-4">
                            {/* Main Element Track Container */}
                            <div className="h-8 relative bg-surface-dark/40 border border-white/[0.03] rounded-pill w-full flex items-center px-4 overflow-hidden group">
                               <div className="absolute inset-y-0 left-0 right-0 bg-white/[0.01] pointer-events-none group-hover:bg-white/[0.03] transition-colors" />
                               {animations.filter(a => a.elementId === el.id).map(kf => (
                                 <div 
                                  key={kf.id} 
                                  className="absolute w-3.5 h-3.5 bg-primary rounded-full shadow-glow cursor-pointer hover:scale-125 transition-transform z-10 border-2 border-[#121212]" 
                                  style={{ left: kf.time * timelineScale }} 
                                 />
                               ))}
                               {/* Connect Keyframes Line */}
                               {animations.filter(a => a.elementId === el.id).length >= 2 && (
                                  <div className="absolute h-0.5 bg-primary/20 rounded-full" style={{ left: Math.min(...animations.filter(a => a.elementId === el.id).map(k => k.time)) * timelineScale, width: (Math.max(...animations.filter(a => a.elementId === el.id).map(k => k.time)) - Math.min(...animations.filter(a => a.elementId === el.id).map(k => k.time))) * timelineScale }} />
                               )}
                            </div>

                            {/* Expanded Property Tracks Containers */}
                            <AnimatePresence>
                              {expandedTimelineElements.has(el.id) && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-2 space-y-2"
                                >
                                  {['Position', 'Size', 'Transparency'].map(prop => (
                                    <div key={prop} className="h-4 relative w-full border-b border-white/[0.02] flex items-center">
                                       <div className="absolute h-px bg-white/5 w-full" />
                                       {/* Mock keyframe for visuals */}
                                       <div className="absolute w-2 h-2 bg-[#333] rounded-full border border-gray-600 transform rotate-45" style={{ left: 1.5 * timelineScale }} />
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {bottomTab === 'properties' && (
              <div className="h-full overflow-y-auto p-8 bg-background-dark no-scrollbar border-t border-white/5">
                {selectedElement ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    {/* Appearance Group */}
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Appearance</label>
                      <div className="space-y-4">
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                          <span className="text-[9px] text-gray-500 block mb-2">IDENTIFIER</span>
                          <input className="bg-transparent w-full text-sm font-medium outline-none text-white" value={selectedElement.name} onChange={(e) => onUpdateElement(selectedElement.id, { name: e.target.value })} />
                        </div>
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                          <span className="text-[9px] text-gray-500 block mb-2">BG COLOR3</span>
                          <div className="flex items-center gap-3">
                            <input type="color" className="h-8 rounded-lg cursor-pointer bg-black/40 border-none w-10 overflow-hidden" value={colorToHex(selectedElement.properties.BackgroundColor3)} onChange={(e) => onUpdateElementProperties(selectedElement.id, { BackgroundColor3: hexToColor(e.target.value) })} />
                            <span className="text-[11px] font-mono text-gray-400">{colorToHex(selectedElement.properties.BackgroundColor3).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                           <span className="text-[9px] text-gray-500 block mb-2">BG TRANSPARENCY</span>
                           <input type="number" min="0" max="1" step="0.1" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.BackgroundTransparency} onChange={(e) => onUpdateElementProperties(selectedElement.id, { BackgroundTransparency: parseFloat(e.target.value) })} />
                        </div>
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                           <span className="text-[9px] text-gray-500 block mb-2">BORDER PIXEL</span>
                           <input type="number" min="0" step="1" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.BorderSizePixel} onChange={(e) => onUpdateElementProperties(selectedElement.id, { BorderSizePixel: parseInt(e.target.value) })} />
                        </div>
                      </div>
                    </div>

                    {/* Dimensions Group */}
                    <div className="space-y-6">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Dimensions</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                          <span className="text-[9px] text-gray-500 block mb-2">X SCALE</span>
                          <input type="number" step="0.01" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.Position.X.Scale} onChange={(e) => onUpdateElementProperties(selectedElement.id, { Position: { ...selectedElement.properties.Position, X: { ...selectedElement.properties.Position.X, Scale: parseFloat(e.target.value) } } })} />
                        </div>
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                          <span className="text-[9px] text-gray-500 block mb-2">X OFFSET</span>
                          <input type="number" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.Position.X.Offset} onChange={(e) => onUpdateElementProperties(selectedElement.id, { Position: { ...selectedElement.properties.Position, X: { ...selectedElement.properties.Position.X, Offset: parseFloat(e.target.value) } } })} />
                        </div>
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                          <span className="text-[9px] text-gray-500 block mb-2">Y SCALE</span>
                          <input type="number" step="0.01" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.Position.Y.Scale} onChange={(e) => onUpdateElementProperties(selectedElement.id, { Position: { ...selectedElement.properties.Position, Y: { ...selectedElement.properties.Position.Y, Scale: parseFloat(e.target.value) } } })} />
                        </div>
                        <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                          <span className="text-[9px] text-gray-500 block mb-2">Y OFFSET</span>
                          <input type="number" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.Position.Y.Offset} onChange={(e) => onUpdateElementProperties(selectedElement.id, { Position: { ...selectedElement.properties.Position, Y: { ...selectedElement.properties.Position.Y, Offset: parseFloat(e.target.value) } } })} />
                        </div>
                      </div>
                    </div>

                    {/* Text Group (Conditional) */}
                    {(selectedElement.type === 'TextLabel' || selectedElement.type === 'TextButton' || selectedElement.type === 'TextBox') && (
                       <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Typography</label>
                        <div className="space-y-4">
                           <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                              <span className="text-[9px] text-gray-500 block mb-2">TEXT CONTENT</span>
                              <input className="bg-transparent w-full text-sm font-medium outline-none text-white" value={selectedElement.properties.Text || ''} onChange={(e) => onUpdateElementProperties(selectedElement.id, { Text: e.target.value })} />
                           </div>
                           <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                              <span className="text-[9px] text-gray-500 block mb-2">TEXT COLOR3</span>
                              <div className="flex items-center gap-3">
                                 <input type="color" className="h-8 rounded-lg cursor-pointer bg-black/40 border-none w-10 overflow-hidden" value={colorToHex(selectedElement.properties.TextColor3 || {R:1,G:1,B:1})} onChange={(e) => onUpdateElementProperties(selectedElement.id, { TextColor3: hexToColor(e.target.value) })} />
                                 <span className="text-[11px] font-mono text-gray-400">{colorToHex(selectedElement.properties.TextColor3 || {R:1,G:1,B:1}).toUpperCase()}</span>
                              </div>
                           </div>
                           <div className="p-4 bg-surface-dark rounded-2xl border border-white/5">
                              <span className="text-[9px] text-gray-500 block mb-2">FONT SIZE</span>
                              <input type="number" min="1" className="bg-transparent w-full text-sm font-mono outline-none text-white" value={selectedElement.properties.TextSize || 14} onChange={(e) => onUpdateElementProperties(selectedElement.id, { TextSize: parseInt(e.target.value) })} />
                           </div>
                        </div>
                       </div>
                    )}

                    <div className="flex flex-col justify-end gap-4 pb-2 md:col-span-2 lg:col-span-1">
                       <button onClick={() => onDeleteElement(selectedElement.id)} className="w-full py-5 bg-red-500/10 text-red-400 font-bold rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all">
                         Delete Element
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 italic">
                    <span className="material-icons-round text-6xl mb-3">auto_fix_high</span>
                    <p className="text-sm">Select an element to modify properties</p>
                  </div>
                )}
              </div>
            )}

            {bottomTab === 'easing' && (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 italic bg-background-dark border-t border-white/5">
                <span className="material-icons-round text-4xl mb-2 opacity-30">gesture</span>
                <p className="text-sm">Physics interpolation curve editor matched to blender curves.</p>
              </div>
            )}
          </div>

          {/* Footer bar */}
          <div className="h-12 bg-[#121212] px-8 flex items-center justify-between border-t border-white/5 shrink-0 z-50">
             <span className="text-[11px] text-gray-500 font-medium">Status: <span className="text-gray-300 font-bold">{selectedElement ? `Editing ${selectedElement.name}` : 'Ready'}</span></span>
             <div className="flex gap-6">
                <button 
                  onClick={() => selectedElement && onAddKeyframe(selectedElement.id, currentTime)}
                  className="text-xs text-primary font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  disabled={!selectedElement}
                >
                   <span className="material-icons-round text-sm">add_circle</span> Add Keyframe
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
