import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

interface TemplateThumbnailProps {
  fabricData: any;
  category: "Certificates" | "Fee Challans" | "Result Cards" | "Admission Forms" | "ID Cards";
}

// Native dimensions per category — module-level so the object identity is
// stable across renders and effects don't re-run needlessly.
const DIMENSIONS = {
  "Certificates": { width: 842, height: 595 }, // A4 Landscape
  "Fee Challans": { width: 595, height: 842 }, // A4 Portrait
  "Result Cards": { width: 595, height: 842 },
  "Admission Forms": { width: 595, height: 842 },
  "ID Cards": { width: 638, height: 1013 }, // CR80 Portrait
} as const;

export function TemplateThumbnail({ fabricData, category }: TemplateThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const staticCanvasRef = useRef<fabric.StaticCanvas | null>(null);
  const [scale, setScale] = useState(0.2); // default scale

  const nativeSize = DIMENSIONS[category] || DIMENSIONS["Certificates"];

  // Calculate dynamic scale to fit within parent
  useEffect(() => {
    if (!wrapperRef.current) return;
    const updateScale = () => {
      const parent = wrapperRef.current;
      if (parent) {
        // Find the scale that fits the native size into the parent box, with some padding
        const scaleX = (parent.clientWidth - 16) / nativeSize.width;
        const scaleY = (parent.clientHeight - 16) / nativeSize.height;
        setScale(Math.min(scaleX, scaleY));
      }
    };

    // Initial and resize
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapperRef.current);
    updateScale();

    return () => observer.disconnect();
  }, [nativeSize.width, nativeSize.height]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize static canvas
    const staticCanvas = new fabric.StaticCanvas(canvasRef.current, {
      width: nativeSize.width,
      height: nativeSize.height,
      backgroundColor: "#ffffff",
    });
    
    staticCanvasRef.current = staticCanvas;

    // Load template data
    if (fabricData) {
      // Replace merge tags with dummy sample data here to make the thumbnail look like a finished document
      let jsonString = JSON.stringify(fabricData);
      jsonString = jsonString.replace(/\{\{student_name\}\}/g, "Ayesha Khan");
      jsonString = jsonString.replace(/\{\{class_name\}\}/g, "Grade 10-A");
      jsonString = jsonString.replace(/\{\{father_name\}\}/g, "Muhammad Ali");
      jsonString = jsonString.replace(/\{\{registration_no\}\}/g, "REG-2026-9081");
      jsonString = jsonString.replace(/\{\{fee_amount\}\}/g, "Rs. 15,500");
      jsonString = jsonString.replace(/\{\{school_name\}\}/g, "Eduplexo Academy");
      jsonString = jsonString.replace(/\{\{issue_date\}\}/g, "August 24, 2026");
      jsonString = jsonString.replace(/\{\{academic_year\}\}/g, "2026-2027");

      const hydratedData = JSON.parse(jsonString);

      staticCanvas.loadFromJSON(hydratedData, () => {
        staticCanvas.renderAll();
      });
    }

    // Cleanup
    return () => {
      staticCanvas.dispose();
      staticCanvasRef.current = null;
    };
  }, [fabricData, nativeSize.width, nativeSize.height]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-200" ref={wrapperRef}>
      {/* Container that acts as the scaled viewport */}
      <div 
        style={{
          width: nativeSize.width,
          height: nativeSize.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          backgroundColor: '#fff'
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
