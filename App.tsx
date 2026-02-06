import React, { useState } from 'react';
import { AppView, UIElement, AnimationKeyframe, RobloxElementType } from './types';
import { GalleryView } from './components/GalleryView';
import { EditorView } from './components/EditorView';
import { LogicView } from './components/LogicView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.EDITOR);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elements, setElements] = useState<UIElement[]>([]);
  const [animations, setAnimations] = useState<AnimationKeyframe[]>([]);
  const [projectName, setProjectName] = useState<string>('Roblox Plush UI');

  const addElement = (type: RobloxElementType) => {
    const newId = crypto.randomUUID();
    const newElement: UIElement = {
      id: newId,
      type,
      name: `${type}_${elements.length + 1}`,
      visible: true,
      locked: false,
      functions: [],
      properties: {
        Position: { X: { Scale: 0.5, Offset: 0 }, Y: { Scale: 0.5, Offset: 0 } },
        Size: { X: { Scale: 0, Offset: 120 }, Y: { Scale: 0, Offset: 50 } },
        AnchorPoint: { X: 0.5, Y: 0.5 },
        BackgroundColor3: { R: 0.1, G: 0.1, B: 0.12 },
        BackgroundTransparency: 0,
        BorderColor3: { R: 0, G: 0, B: 0 },
        BorderSizePixel: 0,
        ClipsDescendants: false,
        Visible: true,
        ZIndex: elements.length + 1,
        Rotation: 0,
        Text: type.includes('Text') ? 'New Button' : undefined,
        TextColor3: { R: 1, G: 1, B: 1 },
        Font: 'SourceSans'
      }
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newId);
  };

  const updateElement = (id: string, updates: Partial<UIElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const updateElementProperties = (id: string, props: Partial<UIElement['properties']>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, properties: { ...el.properties, ...props } } : el));
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setAnimations(prev => prev.filter(anim => anim.elementId !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const addKeyframe = (elementId: string, time: number) => {
    const el = elements.find(e => e.id === elementId);
    if (!el) return;
    
    const newKeyframe: AnimationKeyframe = {
      id: crypto.randomUUID(),
      elementId,
      time,
      properties: JSON.parse(JSON.stringify(el.properties)),
      sprSettings: { dampingRatio: 0.8, undampedFrequency: 15 }
    };
    setAnimations(prev => [...prev, newKeyframe]);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  return (
    <div className="w-full h-full">
      {currentView === AppView.GALLERY && (
        <GalleryView onNavigate={setCurrentView} projectName={projectName} />
      )}
      {currentView === AppView.EDITOR && (
        <EditorView 
          onNavigate={setCurrentView}
          elements={elements}
          animations={animations}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElementId}
          onAddElement={addElement}
          onUpdateElementProperties={updateElementProperties}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onAddKeyframe={addKeyframe}
          onUpdateKeyframe={(id, updates) => setAnimations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))}
          onDeleteKeyframe={(id) => setAnimations(prev => prev.filter(a => a.id !== id))}
          projectName={projectName}
          setProjectName={setProjectName}
        />
      )}
      {currentView === AppView.LOGIC && (
        <LogicView onNavigate={setCurrentView} selectedElement={selectedElement} />
      )}
    </div>
  );
};

export default App;
