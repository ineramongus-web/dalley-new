import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UIElement, AnimationKeyframe } from '../types'
import { CanvasTools, DragHandles } from './CanvasTools'

interface FlatCanvasProps {
  elements: UIElement[]
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<UIElement>) => void
  activeTool: 'select' | 'move' | 'resize' | 'rotate'
  zoom: number
  setZoom: (zoom: number) => void
  animations: AnimationKeyframe[]
  currentTime: number
  isPlaying: boolean
}

export const FlatCanvas: React.FC<FlatCanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  activeTool,
  zoom,
  setZoom,
  animations,
  currentTime,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Helper to handle background clicks
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectElement(null)
    }
  }

  // Panning logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'select' && (e.button === 1 || e.altKey)) { // Middle click or Alt+Click for pan
      setIsPanning(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      return
    }
    if (e.target === canvasRef.current) {
      onSelectElement(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = -e.deltaY * 0.001
      setZoom(Math.min(Math.max(0.1, zoom + delta), 5))
    } else {
       // Optional: Pan on wheel if not zooming
       // setPan(p => ({ ...p, y: p.y - e.deltaY, x: p.x - e.deltaX }))
    }
  }

  const getElementStyle = (element: UIElement) => {
    // Basic animation application
    const elementKeyframes = animations.filter(kf => kf.elementId === element.id).sort((a, b) => a.time - b.time);
    let props = { ...element.properties };
    
    if (elementKeyframes.length > 0) {
      const active = [...elementKeyframes].reverse().find(k => k.time <= currentTime) || elementKeyframes[0];
      // Simple interpolation could go here, for now using step
      props = { ...props, ...active.properties };
    }

    // Convert UDim2 to pixels (simplified for preview)
    // 1 Scale = 100% of parent (or canvas width if root)
    // Canvas size assumed 1200x800 for relative calc if needed, or just standard 100%
    
    // Position
    const left = props.Position.X.Offset;
    const top = props.Position.Y.Offset;
    const leftScale = props.Position.X.Scale * 100;
    const topScale = props.Position.Y.Scale * 100;

    // Size
    const width = props.Size.X.Offset;
    const height = props.Size.Y.Offset;
    const widthScale = props.Size.X.Scale * 100;
    const heightScale = props.Size.Y.Scale * 100;

    return {
      position: 'absolute' as const,
      left: `calc(${leftScale}% + ${left}px)`,
      top: `calc(${topScale}% + ${top}px)`,
      width: `calc(${widthScale}% + ${width}px)`,
      height: `calc(${heightScale}% + ${height}px)`,
      backgroundColor: `rgba(${props.BackgroundColor3.R * 255}, ${props.BackgroundColor3.G * 255}, ${props.BackgroundColor3.B * 255}, ${1 - props.BackgroundTransparency})`,
      borderWidth: `${props.BorderSizePixel}px`,
      borderColor: `rgb(${props.BorderColor3.R * 255}, ${props.BorderColor3.G * 255}, ${props.BorderColor3.B * 255})`,
      borderRadius: props.UICorner ? `${props.UICorner.CornerRadius.Offset}px` : '0px',
      transform: `translate(-50%, -50%) rotate(${props.Rotation}deg)`, // Anchor point 0.5, 0.5 assumed for simplicity in dragging center
      zIndex: props.ZIndex,
      display: props.Visible ? 'flex' : 'none',
      alignItems: 'center', // Default center text
      justifyContent: 'center',
      overflow: props.ClipsDescendants ? 'hidden' : 'visible'
    }
  }

  // Handle Dragging Elements
  const handleDragEnd = (id: string, newPos: { x: number, y: number }) => {
     // Convert pixel drag back to offset for simplicity in this editor
     onUpdateElement(id, {
        properties: {
           // We only update offset for drag in this simplified editor to avoid scale math complexit without parent ref
           Position: { 
              X: { Scale: 0.5, Offset: newPos.x }, // Keeping scale 0.5 to match anchor center
              Y: { Scale: 0.5, Offset: newPos.y }
           }
        } as any
     })
  }
  
  const handleResizeEnd = (id: string, newSize: { width: number, height: number }) => {
     onUpdateElement(id, {
        properties: {
           Size: { 
              X: { Scale: 0, Offset: newSize.width },
              Y: { Scale: 0, Offset: newSize.height }
           }
        } as any
     })
  }

  return (
    <div 
      className="w-full h-full bg-[#1e1e20] overflow-hidden relative cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      ref={canvasRef}
    >
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
           backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
           backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
           transform: `translate(${pan.x}px, ${pan.y}px)`
        }} 
      />

      <div 
        className="absolute left-1/2 top-1/2 w-0 h-0"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` 
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/5 border border-dashed border-white/20 shadow-2xl backdrop-blur-3xl rounded-3xl">
           <div className="absolute top-[-30px] left-0 text-xs font-bold text-gray-500 uppercase tracking-widest">Workspace (800x600)</div>
           
           {elements.map(element => (
             <React.Fragment key={element.id}>
               <motion.div
                 className="absolute select-none group"
                 style={getElementStyle(element)}
                 onClick={(e) => {
                   e.stopPropagation();
                   onSelectElement(element.id);
                 }}
               >
                 {element.type.includes('Text') && (
                   <span 
                    style={{ 
                      color: `rgb(${element.properties.TextColor3?.R! * 255}, ${element.properties.TextColor3?.G! * 255}, ${element.properties.TextColor3?.B! * 255})`,
                      fontSize: element.properties.TextSize,
                      fontFamily: element.properties.Font
                    }}
                   >
                     {element.properties.Text}
                   </span>
                 )}
                 {/* Selection Overlay */}
                 {selectedElement === element.id && (
                    <div className="absolute inset-0 border-2 border-[#FF4D6D] z-50 pointer-events-none rounded-[inherit]" />
                 )}
               </motion.div>
               
               {/* Drag Handles Overlay - Rendered separately to avoid transform conflicts if needed, or integrated */}
               {selectedElement === element.id && activeTool !== 'select' && (
                 <DragHandles 
                    element={element} 
                    zoom={zoom} 
                    activeTool={activeTool}
                    onDragEnd={handleDragEnd}
                    onResizeEnd={handleResizeEnd}
                 />
               )}
             </React.Fragment>
           ))}
        </div>
      </div>
    </div>
  )
}