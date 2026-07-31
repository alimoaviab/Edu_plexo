import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

interface CertificateRendererProps {
  canvasJSON: string;
  metadata?: Record<string, string>;
  width?: number; // Optional scaling width
}

export const CertificateRenderer: React.FC<CertificateRendererProps> = ({ canvasJSON, metadata = {}, width }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Use default dimensions from the preset A4 landscape usually: 1123x794
    const baseWidth = 1123;
    const baseHeight = 794;

    const displayWidth = width || containerRef.current.clientWidth || baseWidth;
    const calculatedScale = displayWidth / baseWidth;

    const staticCanvas = new fabric.StaticCanvas(canvasRef.current, {
      width: displayWidth,
      height: baseHeight * calculatedScale,
      backgroundColor: "#ffffff"
    });

    try {
      if (canvasJSON) {
        staticCanvas.loadFromJSON(canvasJSON, () => {
          
          // Apply variable replacements
          staticCanvas.getObjects().forEach((obj) => {
            if (obj.type === 'i-text' || obj.type === 'text') {
              const textObj = obj as fabric.IText;
              if (textObj.text) {
                let newText = textObj.text;
                Object.entries(metadata).forEach(([key, value]) => {
                  newText = newText.replace(new RegExp(`{{${key}}}`, 'g'), value);
                });
                textObj.set({ text: newText });
              }
            }
          });

          // Apply scale to everything
          if (calculatedScale !== 1) {
            staticCanvas.setZoom(calculatedScale);
          }
          
          staticCanvas.requestRenderAll();
        });
      }
    } catch (e) {
      console.error("Failed to load certificate JSON:", e);
    }

    return () => {
      staticCanvas.dispose();
    };
  }, [canvasJSON, metadata, width]);

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};
