// services/blogs.ts (example location)
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  deleteDoc,
  Firestore
} from "firebase/firestore";
import { db as firebaseDb } from "./firebaseConfig";

let db: Firestore | null = null;

const initializeFirebase = () => {
  if (!db) db = firebaseDb;
  return db;
};

/**
 * Fetch all blogs from Firestore
 */

export const getAllBlogs = async () => {
  const firestoreDb = initializeFirebase();
  const blogsRef = collection(firestoreDb, "Blogs");
  const blogsQuery = query(blogsRef, orderBy("Created_At", "desc"));
  const snap = await getDocs(blogsQuery);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Fetch limited number of blogs from Firestore
 */

export const getLatestBlogs = async (limitCount = 3) => {
  const firestoreDb = initializeFirebase();
  const blogsRef = collection(firestoreDb, "Blogs");
  const blogsQuery = query(blogsRef, orderBy("Created_At", "desc"), limit(limitCount));
  const snap = await getDocs(blogsQuery);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/**
 * Get a single blog by its URL slug
 */

export const getBlogBySlug = async (slug: string) => {
  const firestoreDb = initializeFirebase();
  const blogsRef = collection(firestoreDb, "Blogs");
  const snap = await getDocs(blogsRef);
  const match = snap.docs.find(d => d.data().BlogURL === slug);
  return match ? { id: match.id, ...match.data() } : null;
};

/**
 * Create a new blog in Firestore
 */

export const createBlog = async (blogData: Record<string, unknown>) => {
  const firestoreDb = initializeFirebase();
  const blogsRef = collection(firestoreDb, "Blogs");
  const payload = { ...blogData, Created_At: serverTimestamp(), Updated_At: serverTimestamp() };
  const docRef = await addDoc(blogsRef, payload);
  return { id: docRef.id, ...payload };
};

/**
 * Update an existing blog in Firestore
 */

export const updateBlog = async (blogId: string, blogData: Record<string, unknown>) => {
  const firestoreDb = initializeFirebase();
  const blogRef = doc(firestoreDb, "Blogs", blogId);
  const payload = { ...blogData, Updated_At: serverTimestamp() };
  await updateDoc(blogRef, payload);
  const updated = await getDoc(blogRef);
  return { id: updated.id, ...updated.data() };
};

/**
 * Delete a blog from Firestore
 */

export const deleteBlog = async (blogId: string) => {
  const firestoreDb = initializeFirebase();
  const blogRef = doc(firestoreDb, "Blogs", blogId);
  await deleteDoc(blogRef);
  return true;
};
