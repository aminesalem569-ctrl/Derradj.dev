"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploaderProps {
  onUpload: (urls: string[]) => void;
  label?: string;
  accept?: "images" | "models" | "all";
}

const MODEL_EXTENSIONS = ["glb", "gltf", "obj", "fbx", "stl", "dae"];

export function CloudinaryUploader({ onUpload, label = "رفع الصور", accept = "all" }: CloudinaryUploaderProps) {
  useEffect(() => {
    if (!document.getElementById("cloudinary-script")) {
      const script = document.createElement("script");
      script.id = "cloudinary-script";
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("⚠️ يرجى إضافة NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME و NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET في ملف .env.local");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: true,
        maxFiles: accept === "models" ? 1 : 10,
        sources: ["local", "url", "camera"],
        clientAllowedFormats:
          accept === "images"
            ? ["jpg", "jpeg", "png", "webp", "gif", "svg"]
            : accept === "models"
            ? MODEL_EXTENSIONS
            : ["jpg", "jpeg", "png", "webp", "gif", "svg", ...MODEL_EXTENSIONS],
        resourceType: "auto",
        language: "ar",
        text: {
          ar: {
            or: "أو",
            back: "رجوع",
            advanced: "خيارات متقدمة",
            close: "إغلاق",
            no_results: "لا توجد نتائج",
            upload_successful: "تم الرفع بنجاح!",
          },
        },
        styles: {
          palette: {
            window: "#161C2D",
            windowBorder: "#2A3441",
            tabIcon: "#10b981",
            menuIcons: "#FFFFFF",
            textDark: "#FFFFFF",
            textLight: "#FFFFFF",
            link: "#10b981",
            action: "#0ea5e9",
            inactiveTabIcon: "#9ca3af",
            error: "#ef4444",
            inProgress: "#0ea5e9",
            complete: "#10b981",
            sourceBg: "#0B0F19",
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result?.event === "success") {
          onUpload([result.info.secure_url]);
        }
        if (!error && result?.event === "queues-end") {
          widget.close();
        }
      }
    );
    widget.open();
  };

  return (
    <Button
      type="button"
      onClick={openWidget}
      variant="outline"
      className="flex items-center gap-2 border-dashed border-[#2A3441] text-gray-300 hover:border-[#10b981] hover:text-[#10b981] bg-transparent"
    >
      <Upload className="w-4 h-4" />
      {label}
    </Button>
  );
}
