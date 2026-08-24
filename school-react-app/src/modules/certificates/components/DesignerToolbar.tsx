import React from "react";
import { fabric } from "fabric";
import { useTemplateStore } from "../store/templateStore";
import { 
  Undo, Redo, ZoomIn, ZoomOut, Grid, Sparkles, Layers,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline
} from "lucide-react";
import { AppIcon } from "shared/ui/AppIcon";

const FONTS_LIST = [
  // Modern Sans
  "Inter", "Montserrat", "Poppins", "Raleway",
  // Formal Serif
  "Playfair Display", "Merriweather", "Cormorant Garamond", "EB Garamond", "Georgia", "Times New Roman",
  // Elegant Script
  "Great Vibes", "Dancing Script", "Sacramento",
  // Urdu/Multilingual
  "Noto Nastaliq Urdu", "Jameel Noori Nastaleeq"
];

export function DesignerToolbar() {
  const { 
    canvas, zoom, setZoom, showGrid, setShowGrid,
    snapToGrid, setSnapToGrid, selectedObject, 
    undoStack, redoStack, undo, redo,
    isPreviewMode, setIsPreviewMode
  } = useTemplateStore();

  const handleZoom = (delta: number) => {
    setZoom(Math.max(0.1, Math.min(3, zoom + delta)));
  };

  const updateSelectedObject = (key: string, value: any) => {
    if (!canvas || !selectedObject) return;
    (selectedObject as any).set(key, value);
    canvas.requestRenderAll();
    useTemplateStore.getState().saveState();
  };

  const isText = selectedObject && (selectedObject.type === "text" || selectedObject.type === "i-text" || selectedObject.type === "textbox");

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      
      {/* Left side: Canvas controls */}
      <div className="flex items-center gap-1.5">
        <button onClick={undo} disabled={undoStack.length === 0} className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-md hover:bg-slate-100" title="Undo (Ctrl+Z)">
          <Undo size={18} />
        </button>
        <button onClick={redo} disabled={redoStack.length === 0} className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-md hover:bg-slate-100" title="Redo (Ctrl+Y)">
          <Redo size={18} />
        </button>
        
        <div className="w-px h-6 bg-slate-200 mx-2" />
        
        <button onClick={() => handleZoom(-0.1)} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100" title="Zoom Out">
          <ZoomOut size={18} />
        </button>
        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => handleZoom(0.1)} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100" title="Zoom In">
          <ZoomIn size={18} />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        <button 
          onClick={() => setShowGrid(!showGrid)} 
          className={`p-1.5 rounded-md transition-colors ${showGrid ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          title="Toggle Grid"
        >
          <Grid size={18} />
        </button>
        
        <button 
          onClick={() => setSnapToGrid(!snapToGrid)} 
          className={`p-1.5 rounded-md transition-colors ${snapToGrid ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          title="Snap to Grid"
        >
          <AppIcon name="Magnet" size={18} />
        </button>
      </div>

      {/* Middle: Context Controls (Text/Shape formatting) */}
      <div className="flex-1 flex justify-center items-center">
        {isText && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <select 
              className="text-xs border-none bg-transparent font-medium text-slate-700 focus:ring-0 w-36 cursor-pointer"
              value={(selectedObject as any).fontFamily || "Inter"}
              onChange={(e) => updateSelectedObject("fontFamily", e.target.value)}
            >
              {FONTS_LIST.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
            
            <div className="w-px h-4 bg-slate-300 mx-1" />
            
            <input 
              type="number" 
              className="w-14 text-xs border-none bg-transparent font-medium text-center focus:ring-0 p-0"
              value={(selectedObject as any).fontSize || 16}
              onChange={(e) => updateSelectedObject("fontSize", parseInt(e.target.value))}
            />
            
            <div className="w-px h-4 bg-slate-300 mx-1" />

            {/* Colors */}
            <input 
              type="color"
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              value={(selectedObject as any).fill || "#000000"}
              onChange={(e) => updateSelectedObject("fill", e.target.value)}
              title="Text Color"
            />

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button 
              onClick={() => updateSelectedObject("fontWeight", (selectedObject as any).fontWeight === "bold" ? "normal" : "bold")}
              className={`p-1 rounded ${((selectedObject as any).fontWeight === "bold") ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <Bold size={14} />
            </button>
            <button 
              onClick={() => updateSelectedObject("fontStyle", (selectedObject as any).fontStyle === "italic" ? "normal" : "italic")}
              className={`p-1 rounded ${((selectedObject as any).fontStyle === "italic") ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <Italic size={14} />
            </button>
            <button 
              onClick={() => updateSelectedObject("underline", !(selectedObject as any).underline)}
              className={`p-1 rounded ${((selectedObject as any).underline) ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <Underline size={14} />
            </button>

            <div className="w-px h-4 bg-slate-300 mx-1" />

            <button 
              onClick={() => updateSelectedObject("textAlign", "left")}
              className={`p-1 rounded ${((selectedObject as any).textAlign === "left") ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <AlignLeft size={14} />
            </button>
            <button 
              onClick={() => updateSelectedObject("textAlign", "center")}
              className={`p-1 rounded ${((selectedObject as any).textAlign === "center") ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <AlignCenter size={14} />
            </button>
            <button 
              onClick={() => updateSelectedObject("textAlign", "right")}
              className={`p-1 rounded ${((selectedObject as any).textAlign === "right") ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              <AlignRight size={14} />
            </button>

          </div>
        )}

        {!isText && selectedObject && selectedObject.type !== "image" && (
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 px-3">
              <span className="text-xs font-medium text-slate-500 mr-2">Shape Color:</span>
              <input 
                type="color"
                className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                value={(selectedObject as any).fill || "#000000"}
                onChange={(e) => updateSelectedObject("fill", e.target.value)}
              />
           </div>
        )}
      </div>

      {/* Right side: App Actions */}
      <div className="flex items-center gap-2">
        
        {/* Preview Mode Toggle */}
        <div className="flex items-center mr-4 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${!isPreviewMode ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Design Mode
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${isPreviewMode ? 'bg-white shadow-sm text-amber-600 flex items-center gap-1.5' : 'text-slate-500 hover:text-slate-700 flex items-center gap-1.5'}`}
          >
            <AppIcon name="Eye" size={12} />
            Preview Data
          </button>
        </div>

      </div>
    </div>
  );
}
