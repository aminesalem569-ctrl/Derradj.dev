"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAdminData } from "@/hooks/useAdminData";
import { CloudinaryUploader } from "@/components/CloudinaryUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generateAIReply } from "@/lib/ai-actions";
import { savePost, deletePost } from "@/lib/blog-actions";
import { 
  LayoutDashboard, Settings, ShoppingBag, LogOut, Shield, Activity, 
  Users, Mail, Trash2, Eye, BarChart2, Box, Briefcase, Sparkles, 
  Plus, Image as ImageIcon, Send, Sparkle, Loader2, Copy, Newspaper, BookText 
} from "lucide-react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loginError, setLoginError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiDraft, setAiDraft] = useState<{ [key: string]: string }>({});

  const { visits, messages, settings, products, projects, services, posts, loading, chartData, stats, markMessageRead, setSettings, setProducts, setProjects, setServices, setPosts, fetchAll } = useAdminData(isAuth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setIsAuth(!!user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const codes: Record<string, string> = {
        "auth/invalid-credential": "البريد أو كلمة المرور غير صحيحة",
        "auth/too-many-requests": "تم تجميد الحساب مؤقتاً، حاول لاحقاً",
        "auth/network-request-failed": "خطأ في الشبكة",
        "auth/operation-not-allowed": "تسجيل الدخول غير مفعّل في Firebase",
      };
      setLoginError(codes[err.code] || `خطأ: ${err.code}`);
      setAuthLoading(false);
    }
  };

  const saveToFirestore = async (data: any) => {
    setSaving(true);
    await setDoc(doc(db, "portfolio", "data"), data, { merge: true });
    setSaving(false);
    alert("✅ تم الحفظ بنجاح!");
  };

  const updateProduct = (id: string, field: string, value: any) =>
    setProducts(prev => prev.map((p: any) => p.id === id ? { ...p, [field]: value } : p));

  const updateProject = (id: string, field: string, value: any) =>
    setProjects(prev => prev.map((p: any) => p.id === id ? { ...p, [field]: value } : p));

  const updateService = (id: string, field: string, value: any) =>
    setServices(prev => prev.map((p: any) => p.id === id ? { ...p, [field]: value } : p));

  const addProductImage = (id: string, url: string) =>
    setProducts(prev => prev.map((p: any) =>
      p.id === id ? { ...p, images: [...(p.images || []), url] } : p
    ));

  const set3DModel = (id: string, url: string) => updateProduct(id, "modelUrl", url);

  const removeProductImage = (productId: string, imageUrl: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, images: p.images.filter((img: string) => img !== imageUrl) } : p));
  };

  const updatePost = (id: string, field: string, value: any) =>
    setPosts(prev => prev.map((p: any) => p.id === id ? { ...p, [field]: value } : p));

  const handleSavePost = async (post: any) => {
    setSaving(true);
    const res = await savePost(post);
    if (res.success) {
      alert("✅ تم حفظ المقال!");
      fetchAll();
    } else {
      alert("❌ خطأ: " + res.error);
    }
    setSaving(false);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    const res = await deletePost(id);
    if (res.success) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAIDraft = async (id: string, name: string, msg: string) => {
    setAiLoading(id);
    const result = await generateAIReply(name, msg);
    if (result.success && result.reply) {
      setAiDraft(prev => ({ ...prev, [id]: result.reply! }));
    } else {
      alert(result.error);
    }
    setAiLoading(null);
  };

  const navItems = [
    { key: "dashboard", label: "الإحصائيات", icon: BarChart2 },
    { key: "messages", label: "الرسائل", icon: Mail, badge: stats.unread },
    { key: "blog", label: "المدونة", icon: Newspaper },
    { key: "cms", label: "المحتوى", icon: Settings },
    { key: "services", label: "الخدمات", icon: Sparkles },
    { key: "projects", label: "الأعمال", icon: Briefcase },
    { key: "shop", label: "المتجر", icon: ShoppingBag },
  ];

  if (authLoading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="text-[#a855f7] text-lg animate-pulse">جاري التحقق...</div>
    </div>
  );

  if (!isAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] p-4" dir="rtl">
      <Card className="w-full max-w-md bg-[#161C2D] border-[#2A3441] shadow-2xl rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto bg-[#a855f7]/20 p-4 rounded-full w-fit">
            <Shield className="w-8 h-8 text-[#a855f7]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#a855f7]">بوابة الإدارة</CardTitle>
          <p className="text-sm text-gray-400">يرجى تسجيل الدخول للوصول إلى لوحة التحكم المشفرة.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)}
              className="bg-[#0B0F19] border-[#2A3441] text-white h-12 rounded-xl" />
            <Input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)}
              className="bg-[#0B0F19] border-[#2A3441] text-white h-12 rounded-xl" />
            {loginError && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg">{loginError}</p>}
            <Button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] h-12 rounded-xl font-bold text-lg" type="submit">
              تسجيل الدخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-white" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-[#161C2D] border-l border-[#2A3441] flex flex-col p-4">
        <div className="flex items-center gap-3 text-[#a855f7] font-bold text-lg px-2 mb-8 mt-2">
          <Shield className="w-5 h-5" /> Derradj.dev — Admin
        </div>
        <div className="flex-1 space-y-1">
          {navItems.map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${activeTab === item.key ? "bg-[#a855f7]/20 text-[#a855f7] font-semibold" : "text-gray-400 hover:bg-[#2A3441] hover:text-white"}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.badge ? (
                <span className="absolute left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 p-8 overflow-y-auto">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold">📊 إحصائيات الموقع</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "إجمالي الزيارات", value: stats.total, icon: Users, color: "#0ea5e9" },
                { label: "زيارات اليوم", value: stats.today, icon: Activity, color: "#a855f7" },
                { label: "زوار الجوال", value: stats.mobile, icon: Activity, color: "#f59e0b" },
                { label: "رسائل جديدة", value: stats.unread, icon: Mail, color: "#ef4444" },
              ].map(s => (
                <Card key={s.label} className="bg-[#161C2D] border-[#2A3441]">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold" style={{ color: s.color }}>{loading ? "..." : s.value}</div>
                    <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-[#161C2D] border-[#2A3441]">
              <CardHeader><CardTitle className="text-white">نمو الزيارات (آخر 7 أيام)</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3441" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: "#161C2D", borderColor: "#2A3441", color: "#fff" }} />
                    <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: "#a855f7" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">📥 صندوق الرسائل ({messages.length})</h1>
            {messages.length === 0 && !loading && <p className="text-gray-400">لا توجد رسائل بعد.</p>}
            {messages.map(msg => (
              <Card key={msg.id} className={`border-[#2A3441] transition-all ${msg.read ? "bg-[#161C2D]" : "bg-[#1a2235] border-[#a855f7]/50"}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-white">{msg.name}</span>
                        <span className="text-gray-400 text-sm">{msg.email}</span>
                        {!msg.read && <span className="text-xs bg-[#a855f7] text-black px-2 py-0.5 rounded-full font-bold">جديد</span>}
                        <span className="text-gray-500 text-xs mr-auto">{msg.timestamp ? new Date(msg.timestamp).toLocaleString("ar-DZ") : ""}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{msg.message}</p>
                    </div>
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <Button size="sm" variant="outline" className="text-[#a855f7] border-[#a855f7]/50 hover:bg-[#a855f7]/10 bg-transparent shrink-0"
                            onClick={() => markMessageRead(msg.id)}>
                            <Eye className="w-4 h-4 ml-1" /> قراءة
                          </Button>
                        )}
                        <Button size="sm" className="bg-[#0ea5e9] hover:bg-[#0284c7]" onClick={() => window.open(`mailto:${msg.email}?subject=Re: Message from Portfolio&body=Hello ${msg.name},\n\n`)}>
                          <Send className="w-4 h-4 ml-1" /> رد
                        </Button>
                        <Button size="sm" variant="glow" 
                          disabled={aiLoading === msg.id}
                          className="bg-purple-600/20 text-purple-400 border-purple-500/50 hover:bg-purple-600/40" 
                          onClick={() => handleAIDraft(msg.id, msg.name, msg.message)}>
                          {aiLoading === msg.id ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : <Sparkle className="w-4 h-4 ml-1" />}
                          مسودة AI
                        </Button>
                      </div>
                    </div>
                    {aiDraft[msg.id] && (
                      <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl relative group">
                        <p className="text-sm text-gray-300 italic whitespace-pre-wrap">{aiDraft[msg.id]}</p>
                        <Button size="icon" variant="ghost" className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                          onClick={() => { navigator.clipboard.writeText(aiDraft[msg.id]); alert("تم النسخ!"); }}>
                          <Copy className="w-4 h-4 text-purple-400" />
                        </Button>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CMS */}
        {activeTab === "cms" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">✏️ إدارة محتوى الموقع</h1>
            <Card className="bg-[#161C2D] border-[#2A3441]">
              <CardHeader><CardTitle className="text-white">الإعدادات العامة</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={async e => {
                  e.preventDefault();
                  const f = e.target as any;
                  const updated = { ...settings, name: f.name.value, email: f.email.value, about: f.about.value };
                  setSettings(updated);
                  await saveToFirestore({ settings: updated });
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">اسم العرض (يظهر في Navbar)</label>
                      <Input name="name" defaultValue={settings.name} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">بريد التواصل</label>
                      <Input name="email" defaultValue={settings.email} className="bg-[#0B0F19] border-[#2A3441] text-white" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">نص "نبذة عني"</label>
                    <Textarea name="about" defaultValue={settings.about} className="bg-[#0B0F19] border-[#2A3441] text-white min-h-[150px]" />
                  </div>
                  
                  {/* Social Links Manager */}
                  <div className="pt-4 border-t border-[#2A3441] space-y-4">
                    <h3 className="font-bold text-sm text-[#a855f7]">🔗 روابط التواصل الاجتماعي</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["facebook", "instagram", "youtube", "telegram", "whatsapp", "tiktok"].map(platform => (
                        <div key={platform}>
                          <label className="text-[10px] uppercase text-gray-500 mb-1 block">{platform}</label>
                          <Input 
                            placeholder={`رابط ${platform}`}
                            defaultValue={settings.socials?.[platform] || ""}
                            onChange={(e) => {
                              const updatedSocials = { ...(settings.socials || {}), [platform]: e.target.value };
                              setSettings({ ...settings, socials: updatedSocials });
                            }}
                            className="bg-[#0B0F19] border-[#2A3441] text-white text-xs h-9" 
                            dir="ltr"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="bg-[#a855f7] hover:bg-[#9333ea] w-full mt-4">
                    {saving ? "جاري الحفظ..." : "💾 حفظ جميع الإعدادات والروابط"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">✨ إدارة الخدمات</h1>
              <Button onClick={() => setServices(prev => [...prev, { id: Date.now().toString(), title: "خدمة جديدة", desc: "", icon: "Code2" }])}
                className="bg-[#a855f7] hover:bg-[#9333ea]">إضافة خدمة</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service: any) => (
                <Card key={service.id} className="bg-[#161C2D] border-[#2A3441]">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">اسم الخدمة</label>
                        <Input value={service.title} onChange={e => updateService(service.id, "title", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                      </div>
                      <div className="w-24">
                        <label className="text-xs text-gray-400 mb-1 block">الأيقونة</label>
                        <select value={service.icon} onChange={e => updateService(service.id, "icon", e.target.value)}
                          className="w-full h-10 rounded-md border border-[#2A3441] bg-[#0B0F19] px-2 text-xs text-white">
                          <option value="Code2">كود</option>
                          <option value="Paintbrush">تصميم</option>
                          <option value="Smartphone">تطبيقات</option>
                        </select>
                      </div>
                    </div>
                    <Textarea value={service.desc} onChange={e => updateService(service.id, "desc", e.target.value)} placeholder="وصف الخدمة..." className="bg-[#0B0F19] border-[#2A3441] text-white h-24" />
                    <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => setServices(prev => prev.filter(s => s.id !== service.id))}>حذف</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {services.length > 0 && (
              <Button onClick={() => saveToFirestore({ services })} disabled={saving} className="w-full bg-[#0ea5e9] py-6 text-lg">
                {saving ? "جاري الحفظ..." : "💾 حفظ الخدمات"}
              </Button>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">💼 إدارة الأعمال (Portfolio)</h1>
              <Button onClick={() => setProjects(prev => [...prev, { id: Date.now().toString(), title: "مشروع جديد", desc: "", image: "", tags: [] }])}
                className="bg-[#a855f7] hover:bg-[#9333ea]">إضافة مشروع</Button>
            </div>
            {projects.map((project: any) => (
              <Card key={project.id} className="bg-[#161C2D] border-[#2A3441]">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">اسم المشروع</label>
                      <Input value={project.title} onChange={e => updateProject(project.id, "title", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">الكلمات المفتاحية (مثال: Next.js, AI)</label>
                      <Input value={Array.isArray(project.tags) ? project.tags.join(", ") : project.tags} 
                             onChange={e => updateProject(project.id, "tags", e.target.value.split(",").map((s:string) => s.trim()))} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                    </div>
                  </div>
                  <Textarea value={project.desc} onChange={e => updateProject(project.id, "desc", e.target.value)} placeholder="وصف المشروع..." className="bg-[#0B0F19] border-[#2A3441] text-white min-h-[100px]" />
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">صورة المشروع</label>
                      <CloudinaryUploader label="رفع صورة" accept="images" onUpload={urls => updateProject(project.id, "image", urls[0])} />
                    </div>
                    {project.image && <img src={project.image} alt="" className="w-32 h-20 object-cover rounded-md border border-[#2A3441]" />}
                  </div>

                  <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => setProjects(prev => prev.filter(p => p.id !== project.id))}>حذف المشروع</Button>
                </CardContent>
              </Card>
            ))}
            {projects.length > 0 && (
              <Button onClick={() => saveToFirestore({ projects })} disabled={saving} className="w-full bg-[#0ea5e9] py-6 text-lg">
                {saving ? "جاري الحفظ..." : "💾 حفظ جميع الأعمال"}
              </Button>
            )}
          </div>
        )}

        {/* SHOP */}
        {activeTab === "shop" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">🛍️ إدارة المتجر</h1>
              <Button onClick={() => setProducts(prev => [...prev, { id: Date.now().toString(), title: "منتج جديد", desc: "", price: "0", icon: "Download", paymentType: "stripe", paymentLink: "", images: [], modelUrl: "" }])}
                className="bg-[#a855f7] hover:bg-[#9333ea]">إضافة منتج</Button>
            </div>
            {products.map((product: any) => (
              <Card key={product.id} className="bg-[#161C2D] border-[#2A3441]">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">اسم المنتج</label>
                      <Input value={product.title} onChange={e => updateProduct(product.id, "title", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">السعر</label>
                      <Input value={product.price} onChange={e => updateProduct(product.id, "price", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">بوابة الدفع</label>
                      <select value={product.paymentType} onChange={e => updateProduct(product.id, "paymentType", e.target.value)}
                        className="w-full h-10 rounded-md border border-[#2A3441] bg-[#0B0F19] px-3 text-sm text-white">
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="external">BaridiMob / رابط خارجي</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">رابط/معلومات الدفع</label>
                      <Input value={product.paymentLink} onChange={e => updateProduct(product.id, "paymentLink", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" dir="ltr" />
                    </div>
                  </div>
                  <Textarea value={product.desc} onChange={e => updateProduct(product.id, "desc", e.target.value)}
                    placeholder="وصف المنتج..." className="bg-[#0B0F19] border-[#2A3441] text-white min-h-[80px]" />

                  {/* Images */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <label className="text-xs text-gray-400">صور المنتج (متعددة)</label>
                      <CloudinaryUploader label="رفع صور" accept="images"
                        onUpload={urls => urls.forEach(url => addProductImage(product.id, url))} />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {(product.images || []).map((img: string, i: number) => (
                        <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-[#2A3441]">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => removeProductImage(product.id, img)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3D Model */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <label className="text-xs text-gray-400">نموذج ثلاثي الأبعاد (GLB/GLTF/OBJ)</label>
                      <CloudinaryUploader label="رفع نموذج 3D" accept="models"
                        onUpload={urls => set3DModel(product.id, urls[0])} />
                    </div>
                    {product.modelUrl && (
                      <div className="flex items-center gap-2 text-[#a855f7] text-sm bg-[#a855f7]/10 p-2 rounded-lg">
                        <Box className="w-4 h-4" />
                        <span className="truncate flex-1" dir="ltr">{product.modelUrl}</span>
                        <button onClick={() => updateProduct(product.id, "modelUrl", "")} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-2 border-t border-[#2A3441]">
                    <Button variant="outline" size="sm" className="text-red-400 border-red-500/50 hover:bg-red-500/10 bg-transparent"
                      onClick={() => setProducts(prev => prev.filter((p: any) => p.id !== product.id))}>
                      <Trash2 className="w-4 h-4 ml-1" /> حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {products.length > 0 && (
              <Button onClick={() => saveToFirestore({ products })} disabled={saving}
                className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] py-6 text-lg">
                {saving ? "جاري الحفظ..." : "💾 حفظ جميع المنتجات في Firestore"}
              </Button>
            )}
          </div>
        )}

        {/* BLOG */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">📝 إدارة المدونة</h1>
              <Button onClick={() => setPosts(prev => [{ id: `temp-${Date.now()}`, title: "عنوان المقال الجديد", content: "", excerpt: "", image: "", slug: "" }, ...prev])}
                className="bg-[#a855f7] hover:bg-[#9333ea]">كتابة مقال جديد</Button>
            </div>
            {posts.map((post: any) => (
              <Card key={post.id} className="bg-[#161C2D] border-[#2A3441]">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">عنوان المقال</label>
                      <Input value={post.title} onChange={e => updatePost(post.id, "title", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">الرابط (Slug - بالإنجليزية)</label>
                      <Input value={post.slug} onChange={e => updatePost(post.id, "slug", e.target.value.toLowerCase().replace(/ /g, "-"))} placeholder="my-new-post" className="bg-[#0B0F19] border-[#2A3441] text-white" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">وصف مختصر</label>
                    <Input value={post.excerpt} onChange={e => updatePost(post.id, "excerpt", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">المحتوى</label>
                    <Textarea value={post.content} onChange={e => updatePost(post.id, "content", e.target.value)} className="bg-[#0B0F19] border-[#2A3441] text-white min-h-[200px]" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">الصورة البارزة</label>
                      <CloudinaryUploader label="رفع صورة المقال" accept="images" onUpload={urls => updatePost(post.id, "image", urls[0])} />
                    </div>
                    {post.image && <img src={post.image} alt="" className="w-32 h-20 object-cover rounded-md border border-[#2A3441]" />}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[#2A3441]">
                    <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => handleDeletePost(post.id)}>حذف المقال</Button>
                    <Button onClick={() => handleSavePost(post)} disabled={saving} className="bg-[#0ea5e9]">
                      {saving ? "جاري الحفظ..." : "💾 حفظ المقال"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
