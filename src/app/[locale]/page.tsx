import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Shop } from "@/components/Shop";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

async function getCmsData() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) throw new Error("No Project ID");
    
    // Fetch from Firestore REST API to avoid needing firebase-admin on the server
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/portfolio/data`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    const json = await res.json();
    
    if (json && json.fields) {
      // Parse Firestore REST API format back to normal JSON
      const parseFirestoreValue = (val: any): any => {
        if (val.stringValue !== undefined) return val.stringValue;
        if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
        if (val.booleanValue !== undefined) return val.booleanValue;
        if (val.mapValue !== undefined) {
          const map: any = {};
          for (const key in val.mapValue.fields) {
            map[key] = parseFirestoreValue(val.mapValue.fields[key]);
          }
          return map;
        }
        if (val.arrayValue !== undefined) {
          return val.arrayValue.values ? val.arrayValue.values.map(parseFirestoreValue) : [];
        }
        return null;
      };

      return {
        settings: json.fields.settings ? parseFirestoreValue(json.fields.settings) : { name: "Derradj.dev" },
        products: json.fields.products ? parseFirestoreValue(json.fields.products) : [],
        projects: json.fields.projects ? parseFirestoreValue(json.fields.projects) : [],
        services: json.fields.services ? parseFirestoreValue(json.fields.services) : [],
      };
    }
    
    // Return empty but valid structure if document doesn't exist
    return { 
      settings: { name: "Derradj.dev", email: "contact@derradj.dev" }, 
      products: [],
      projects: [],
      services: []
    };
  } catch (error) {
    console.error("Failed to fetch CMS data from Firebase:", error);
    return { 
      settings: { name: "Derradj.dev", email: "contact@derradj.dev" }, 
      products: [],
      projects: [],
      services: []
    };
  }
}

export default async function Home() {
  const data = await getCmsData();

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      <Navbar settings={data.settings} />
      <Hero settings={data.settings} />
      <About settings={data.settings} />
      <Services services={data.services} />
      <Portfolio projects={data.projects} />
      <Shop products={data.products} />
      <Contact settings={data.settings} />
      <Footer settings={data.settings} />
    </main>
  );
}
