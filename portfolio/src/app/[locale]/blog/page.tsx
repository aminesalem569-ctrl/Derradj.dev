"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, User } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function BlogPage() {
  const t = useTranslations("Blog");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts?orderBy=timestamp desc`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.documents) {
          const formatted = data.documents.map((d: any) => {
            const fields = d.fields;
            return {
              id: d.name.split("/").pop(),
              title: fields.title?.stringValue || "",
              excerpt: fields.excerpt?.stringValue || "",
              content: fields.content?.stringValue || "",
              image: fields.image?.stringValue || "",
              slug: fields.slug?.stringValue || "",
              date: fields.timestamp?.timestampValue || new Date().toISOString(),
            };
          });
          setPosts(formatted);
        }
      } catch (e) {
        console.error("Fetch posts error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0B0F19] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            {t("title")}<span className="text-[#10b981]">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug || post.id}`}>
                  <Card className="group h-full bg-[#161C2D] border-[#2A3441] overflow-hidden hover:border-[#10b981]/50 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#0B0F19] flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-[#10b981] text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                        Technical
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> Admin</span>
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-[#10b981] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                        {t("read_more")} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
