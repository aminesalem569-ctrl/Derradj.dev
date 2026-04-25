"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const t = useTranslations("Blog");
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        // Fetch all and filter by slug for simplicity (or use Firestore structuredQuery)
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.documents) {
          const allPosts = data.documents.map((d: any) => {
            const fields = d.fields;
            return {
              id: d.name.split("/").pop(),
              title: fields.title?.stringValue || "",
              content: fields.content?.stringValue || "",
              image: fields.image?.stringValue || "",
              slug: fields.slug?.stringValue || "",
              date: fields.timestamp?.timestampValue || new Date().toISOString(),
            };
          });
          
          const found = allPosts.find((p: any) => p.slug === slug || p.id === slug);
          setPost(found);
        }
      } catch (e) {
        console.error("Fetch post error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
      <Link href="/blog" className="text-[#10b981] flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> {t("back_to_blog")}
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0B0F19] text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/blog" className="text-gray-400 hover:text-[#10b981] flex items-center gap-2 text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t("back_to_blog")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-xs text-[#10b981] font-bold mb-6 uppercase tracking-widest">
             <span className="bg-[#10b981]/10 px-3 py-1 rounded">Development</span>
             <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 mb-12 py-6 border-y border-gray-800">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-[#10b981] to-[#0ea5e9] rounded-full flex items-center justify-center font-bold text-black">
                   A
                </div>
                <div>
                   <div className="text-sm font-bold">Amine Derradj</div>
                   <div className="text-xs text-gray-500">Full-Stack Developer</div>
                </div>
             </div>
             <div className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString()}
             </div>
          </div>

          {post.image && (
            <div className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
              <img src={post.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-emerald max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Share this:</span>
                <button className="p-2 bg-gray-800 hover:bg-[#10b981] rounded-full transition-colors"><Share2 className="w-4 h-4" /></button>
             </div>
             <div className="text-sm text-gray-500">
                End of article.
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
