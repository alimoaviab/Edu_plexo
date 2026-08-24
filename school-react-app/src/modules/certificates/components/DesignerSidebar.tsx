import React, { useState } from "react";
import { fabric } from "fabric";
import { useTemplateStore } from "../store/templateStore";
import { TEMPLATE_LIBRARY } from "../utils/templatesLibrary";
import { CERTIFICATE_VARIABLES } from "../types/certificate.types";
import { AppIcon } from "shared/ui/AppIcon";

export function DesignerSidebar() {
  const [activeTab, setActiveTab] = useState<"templates" | "elements" | "text" | "variables" | "layers">("templates");
  const { canvas, saveState, activeType } = useTemplateStore();

  const handleAddText = (content: string = "Heading Text", options: any = {}) => {
    if (!canvas) return;
    const text = new fabric.IText(content, {
      left: 100,
      top: 100,
      fontFamily: "Inter",
      fontSize: 24,
      fill: "#333333",
      ...options
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    saveState();
  };

  const handleAddVariable = (variableKey: string) => {
    handleAddText(variableKey, { fontSize: 18, fill: "#1e40af", fontFamily: "Courier New" });
  };

  const handleLoadTemplate = (templateData: any) => {
    if (!canvas) return;
    if (window.confirm("Loading a template will replace your current design. Continue?")) {
      canvas.loadFromJSON(templateData, () => {
        canvas.requestRenderAll();
        saveState();
      });
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 shrink-0 h-full">
      {/* Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-200 p-2 gap-1 overflow-x-auto shrink-0 custom-scrollbar">
        {[
          { id: "templates", icon: "LayoutTemplate", label: "Design" },
          { id: "elements", icon: "Shapes", label: "Elements" },
          { id: "text", icon: "Type", label: "Text" },
          { id: "variables", icon: "Braces", label: "Data" },
          { id: "layers", icon: "Layers", label: "Layers" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[56px] transition-all ${activeTab === t.id ? 'bg-white shadow-sm text-blue-600 font-bold border border-slate-200/50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          >
            <AppIcon name={t.icon} size={18} className="mb-1" />
            <span className="text-[9px] uppercase tracking-wider">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        {activeTab === "templates" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Premium Templates</h3>
            <p className="text-xs text-slate-500 mb-4">Click a design to load it into the editor.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATE_LIBRARY.filter(t => t.type === activeType).map(t => (
                <div 
                  key={t.id} 
                  onClick={() => handleLoadTemplate(t.fabricData)}
                  className="aspect-[1.414] bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all group relative overflow-hidden flex items-center justify-center p-2 text-center"
                >
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-blue-700">{t.name}</span>
                </div>
              ))}
              {TEMPLATE_LIBRARY.filter(t => t.type === activeType).length === 0 && (
                <div className="col-span-2 text-center p-4 text-slate-500 text-xs">No templates found for {activeType}.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add Text</h3>
            
            <button 
              onClick={() => handleAddText("Heading", { fontSize: 48, fontWeight: "bold" })}
              className="w-full p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
            >
              <span className="block text-2xl font-bold text-slate-900 group-hover:text-blue-700">Add a heading</span>
            </button>
            <button 
              onClick={() => handleAddText("Subheading", { fontSize: 24, fontWeight: "500" })}
              className="w-full p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
            >
              <span className="block text-lg font-medium text-slate-700 group-hover:text-blue-700">Add a subheading</span>
            </button>
            <button 
              onClick={() => handleAddText("Body text", { fontSize: 16 })}
              className="w-full p-3 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
            >
              <span className="block text-sm text-slate-600 group-hover:text-blue-700">Add a little bit of body text</span>
            </button>
          </div>
        )}

        {activeTab === "variables" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dynamic Fields</h3>
            <p className="text-xs text-slate-500 mb-2">Click to insert dynamic tags. These will be auto-filled during bulk generation.</p>
            
            <div className="space-y-1.5">
              {CERTIFICATE_VARIABLES.map(v => (
                <button
                  key={v.key}
                  onClick={() => handleAddVariable(v.key)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <span className="text-xs font-bold text-slate-700">{v.label}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100">{v.key}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "elements" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Elements</h3>
            <p className="text-xs text-slate-500">Premium SVG elements coming soon in next phase...</p>
          </div>
        )}

        {activeTab === "layers" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Layers</h3>
            <p className="text-xs text-slate-500">Layer management coming soon in next phase...</p>
          </div>
        )}

      </div>
    </div>
  );
}
