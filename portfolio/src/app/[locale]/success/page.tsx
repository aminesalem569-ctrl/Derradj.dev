"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg bg-green-500/10 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card/20 border border-green-500/20 backdrop-blur-xl rounded-3xl p-8 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">شكراً لك! 🎉</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          تمت عملية الدفع بنجاح. لقد استلمنا طلبك وسنقوم بمعالجته فوراً. ستصلك تفاصيل العملية على بريدك الإلكتروني.
        </p>

        {sessionId && (
          <div className="bg-white/5 rounded-xl p-3 mb-8 text-[10px] font-mono text-gray-500 break-all">
            Order ID: {sessionId}
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold gap-2">
            <Link href="/">
              العودة للرئيسية <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5 gap-2">
            <Link href="/#shop">
              متابعة التسوق <ShoppingBag className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
