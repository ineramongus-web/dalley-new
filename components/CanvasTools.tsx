import React, { useState, useEffect } from 'react';
import { UIElement } from '../types';

interface DragHandlesProps {
  element: UIElement;
  zoom: number;
  activeTool: 'select' | 'move' | 'resize' | 'rotate';
  onDragEnd: (id: string, pos: { x: number, y: number }) => void;
  onResizeEnd: (id: string, size: { width: number, height: number }) => void;
}

export const DragHandles: React.FC<DragHandlesProps> = ({ element, zoom, activeTool, onDragEnd, onResizeEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startVal, setStartVal] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Current values (assuming simple offset for this editor version)
  const currentX = element.properties.Position.X.Offset;
  const currentY = element.properties.Position.Y.Offset;
  const currentW = element.properties.Size.X.Offset;
  const currentH = element.properties.Size.Y.Offset;

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.stopPropagation();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartVal({ x: currentX, y: currentY, w: currentW, h: currentH });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = (e.clientX - startPos.x) / zoom;
      const deltaY = (e.clientY - startPos.y) / zoom;

      if (activeTool === 'move') {
        onDragEnd(element.id, {
          x: startVal.x + deltaX,
          y: startVal.y + deltaY
        });
      } else if (activeTool === 'resize') {
        // Simple resizing from bottom right for now
        onResizeEnd(element.id, {
          width: Math.max(10, startVal.w + deltaX),
          height: Math.max(10, startVal.h + deltaY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPos, startVal, zoom, activeTool, element.id, onDragEnd, onResizeEnd]);

  // Render handles based on position
  // Note: Parent container in FlatCanvas already handles translation/rotation
  // We need to render this 'on top' or inside the element container
  // For simplicity, let's assume this component is rendered absolutely at the element's center coordinates
  // But wait, the element is transformed. It's easier if DragHandles is inside the element map loop in Canvas.
  
  // Actually, let's render a transparent overlay div that matches the element's rect
  const style: React.CSSProperties = {
     position: 'absolute',
     left: `calc(50% + ${currentX}px)`, // Assuming anchor 0.5
     top: `calc(50% + ${currentY}px)`,
     width: currentW,
     height: currentH,
     transform: `translate(-50%, -50%) rotate(${element.properties.Rotation}deg)`,
     pointerEvents: 'none', // Allow clicks to pass through to element unless hitting a handle
     zIndex: 100
  };

  return (
    <div style={style}>
       {activeTool === 'move' && (
         <div 
            className="absolute inset-0 cursor-move bg-primary/10 border border-primary pointer-events-auto"
            onMouseDown={(e) => handleMouseDown(e, 'move')}
         />
       )}
       {activeTool === 'resize' && (
         <>
            <div className="absolute inset-0 border border-primary/50 pointer-events-none" />
            <div 
               className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-nwse pointer-events-auto"
               onMouseDown={(e) => handleMouseDown(e, 'resize')}
            />
         </>
       )}
    </div>
  );
}

export const CanvasTools = () => null; // Placeholder if needed
