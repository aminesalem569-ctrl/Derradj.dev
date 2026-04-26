"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, updateDoc, doc } from "firebase/firestore";

export interface VisitRecord {
  id: string;
  page: string;
  country: string;
  device: string;
  timestamp: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export function useAdminData(isAuth: boolean) {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<any>({ name: "Derradj.dev" });
  const [products, setProducts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuth) return;
    fetchAll();
  }, [isAuth]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Fetch visits
      const visitsSnap = await getDocs(
        query(collection(db, "visits"), orderBy("timestamp", "desc"), limit(200))
      );
      const visitsData = visitsSnap.docs.map(d => ({ id: d.id, ...d.data() } as VisitRecord));
      setVisits(visitsData);

      // Fetch messages
      const msgSnap = await getDocs(
        query(collection(db, "messages"), orderBy("timestamp", "desc"))
      );
      const msgData = msgSnap.docs.map(d => {
        const data = d.data();
        // Convert Firestore Timestamps to ISO strings
        const timestamp = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp;
        return { id: d.id, ...data, timestamp } as Message;
      });
      setMessages(msgData);

      // Fetch portfolio data
      const portSnap = await getDocs(collection(db, "portfolio"));
      portSnap.forEach(d => {
        const data = d.data();
        if (data.settings) setSettings(data.settings);
        if (data.products) setProducts(data.products);
        if (data.projects) setProjects(data.projects);
        if (data.services) setServices(data.services);
      });

      // Fetch posts collection separately for better organization
      const postsSnap = await getDocs(query(collection(db, "posts"), orderBy("timestamp", "desc")));
      const postsData = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(postsData);
    } catch (e) {
      console.error("Fetch error:", e);
    }
    setLoading(false);
  };

  const markMessageRead = async (id: string) => {
    await updateDoc(doc(db, "messages", id), { read: true });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  // Aggregate visits by date for chart
  const chartData = (() => {
    const map: Record<string, number> = {};
    visits.forEach(v => {
      const date = new Date(v.timestamp).toLocaleDateString("ar-DZ");
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map).slice(-7).map(([date, count]) => ({ date, count }));
  })();

  const stats = {
    total: visits.length,
    today: visits.filter(v => new Date(v.timestamp).toDateString() === new Date().toDateString()).length,
    mobile: visits.filter(v => v.device === "mobile").length,
    unread: messages.filter(m => !m.read).length,
  };

  return { visits, messages, settings, products, projects, services, posts, loading, chartData, stats, markMessageRead, setSettings, setProducts, setProjects, setServices, setPosts, fetchAll };
}
