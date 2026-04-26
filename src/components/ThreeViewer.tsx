"use client";

import { useEffect } from "react";

interface ModelViewerProps {
  url: string;
  height?: string;
  alt?: string;
}

// Uses Google's <model-viewer> web component — no heavy Three.js needed
// Supports GLB, GLTF — loads via CDN
export function ThreeViewer({ url, height = "320px", alt = "3D Model" }: ModelViewerProps) {
  useEffect(() => {
    if (!document.getElementById("model-viewer-script")) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ width: "100%", height }} className="rounded-xl overflow-hidden bg-black/30 border border-white/10">
      {/* @ts-ignore — model-viewer is a web component */}
      <model-viewer
        src={url}
        alt={alt}
        auto-rotate
        camera-controls
        shadow-intensity="1"
        style={{ width: "100%", height: "100%", background: "transparent" }}
        environment-image="neutral"
        exposure="0.8"
      />
    </div>
  );
}
