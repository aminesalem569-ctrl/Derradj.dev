"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart, Download, Smartphone, ChevronLeft, ChevronRight, Box, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import dynamic from "next/dynamic";
import { createCheckoutSession } from "@/lib/stripe-actions";
import { Loader2 } from "lucide-react";

// Lazy load 3D viewer to avoid SSR issues
const ThreeViewer = dynamic(() => import("@/components/ThreeViewer").then(m => ({ default: m.ThreeViewer })), { ssr: false });

const defaultProducts = [
  { id: "1", title: "Pro SaaS Template", desc: "Complete Next.js SaaS boilerplate with auth & payments.", price: "$49", icon: "Download", type: "Source Code", images: [], modelUrl: "", paymentType: "", paymentLink: "" },
  { id: "2", title: "Fitness App UI Kit", desc: "Premium React Native UI kit for fitness applications.", price: "$29", icon: "Smartphone", type: "Mobile App Kit", images: [], modelUrl: "", paymentType: "", paymentLink: "" },
  { id: "3", title: "Admin Dashboard", desc: "Beautifully crafted admin dashboard using shadcn/ui.", price: "$39", icon: "Download", type: "Template", images: [], modelUrl: "", paymentType: "", paymentLink: "" },
];

function ProductGallery({ images, modelUrl }: { images: string[]; modelUrl?: string }) {
  const [current, setCurrent] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const allImages = images || [];

  if (!allImages.length && !modelUrl) return null;

  return (
    <div className="relative w-full">
      {show3D && modelUrl ? (
        <div className="relative">
          <ThreeViewer url={modelUrl} height="240px" />
          <button onClick={() => setShow3D(false)} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : allImages.length > 0 ? (
        <div className="relative w-full h-52 overflow-hidden rounded-t-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={allImages[current]}
              alt="product"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {allImages.length > 1 && (
            <>
              <button onClick={() => setCurrent(p => (p - 1 + allImages.length) % allImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCurrent(p => (p + 1) % allImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
          {modelUrl && (
            <button onClick={() => setShow3D(true)}
              className="absolute top-2 left-2 bg-primary/90 hover:bg-primary text-black rounded-lg px-2 py-1 text-xs font-bold flex items-center gap-1 transition-colors">
              <Box className="w-3 h-3" /> 3D
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function Shop({ products }: { products?: any[] }) {
  const t = useTranslations("Shop");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const displayProducts = products && products.length > 0 ? products : defaultProducts;

  const [paying, setPaying] = useState<string | null>(null);

  const handleBuy = async (product: any) => {
    if (product.paymentType === "stripe") {
      setPaying(product.id);
      try {
        // Parse price from string like "$49" to number 49
        const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, ""));
        const result = await createCheckoutSession(
          product.id,
          product.title,
          priceNum,
          product.images?.[0] || ""
        );

        if (result.url) {
          window.location.href = result.url;
        } else {
          alert("خطأ في الاتصال بـ Stripe: " + result.error);
        }
      } catch (err) {
        console.error(err);
        alert("حدث خطأ غير متوقع.");
      } finally {
        setPaying(null);
      }
    } else if (product.paymentType === "paypal") {
      window.open(product.paymentLink || "#", "_blank");
    } else if (product.paymentType === "external") {
      alert(`معلومات الدفع:\n${product.paymentLink}`);
    }
  };

  return (
    <section id="shop" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-secondary/10 rounded-full blur-[100px] -z-10" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}<span className="text-secondary">.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => {
            const Icon = product.icon === "Smartphone" ? Smartphone : Download;
            const hasMedia = (product.images && product.images.length > 0) || product.modelUrl;
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.15 }}>
                <Card className="h-full bg-background border-border/50 hover:border-secondary hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 overflow-hidden group flex flex-col">
                  <div className="relative">
                    {hasMedia ? (
                      <ProductGallery images={product.images || []} modelUrl={product.modelUrl} />
                    ) : (
                      <div className="w-full h-40 bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-14 h-14 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    )}
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-primary hover:text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary/10 text-secondary border border-secondary/20">{product.type}</span>
                    </div>
                    <CardTitle className="text-xl mb-2 cursor-pointer hover:text-secondary transition-colors" onClick={() => setSelectedProduct(product)}>
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-4 line-clamp-2">{product.desc}</CardDescription>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-foreground">{product.price}</span>
                      </div>
                      <Button className="w-full gap-2" variant="glow" disabled={paying === product.id} onClick={() => handleBuy(product)}>
                        {paying === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                        {t("buy_now")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] bg-[#0B0F19] border-[#2A3441] text-white p-0 overflow-hidden flex flex-col md:flex-row rounded-3xl">
          {selectedProduct && (
            <>
              <div className="flex-[1.5] bg-black/40 relative flex flex-col items-center justify-center border-l border-[#2A3441]">
                {selectedProduct.modelUrl ? (
                  <div className="w-full h-full relative">
                    <ThreeViewer url={selectedProduct.modelUrl} height="100%" />
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">3D Preview Mode</p>
                    </div>
                  </div>
                ) : selectedProduct.images?.length > 0 ? (
                  <div className="w-full h-full">
                    <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-contain p-4" />
                  </div>
                ) : (
                  <div className="text-gray-600">لا توجد وسائط متاحة</div>
                )}
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-4 left-4 md:hidden bg-black/60 p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-8 flex flex-col h-full overflow-y-auto">
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-primary text-black uppercase">{selectedProduct.type}</span>
                  </div>
                  <DialogTitle className="text-3xl font-bold text-white mb-2">{selectedProduct.title}</DialogTitle>
                  <div className="text-3xl font-bold text-[#10b981]">{selectedProduct.price}</div>
                </DialogHeader>

                <div className="space-y-6 flex-1">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">وصف المنتج</h4>
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{selectedProduct.desc}</p>
                  </div>

                  {selectedProduct.images?.length > 1 && (
                    <div>
                       <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">صور إضافية</h4>
                       <div className="flex gap-2 flex-wrap">
                          {selectedProduct.images.map((img: string, i: number) => (
                            <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-xl border border-[#2A3441] hover:border-primary transition-all cursor-pointer" />
                          ))}
                       </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-[#2A3441]">
                  <Button className="w-full h-14 text-lg font-bold gap-3 rounded-2xl" variant="glow" onClick={() => handleBuy(selectedProduct)}>
                    <ShoppingCart className="w-6 h-6" />
                    شراء المنتج الآن
                  </Button>
                  <p className="text-center text-xs text-gray-500 mt-4 italic">الدفع آمن ومشفر عبر بوابات عالمية</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
