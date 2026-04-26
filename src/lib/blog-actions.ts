"use server";

import { db } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export async function savePost(post: any) {
  // SECURITY NOTE: Ensure Firebase Security Rules are set to:
  // allow write: if request.auth != null;
  try {
    if (post.id && !post.id.startsWith("temp-")) {
      const { id, ...data } = post;
      await updateDoc(doc(db, "posts", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true, id };
    } else {
      const { id, ...data } = post;
      const docRef = await addDoc(collection(db, "posts"), {
        ...data,
        timestamp: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    }
  } catch (error: any) {
    console.error("Save Post Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePost(id: string) {
  try {
    await deleteDoc(doc(db, "posts", id));
    return { success: true };
  } catch (error: any) {
    console.error("Delete Post Error:", error);
    return { success: false, error: error.message };
  }
}
