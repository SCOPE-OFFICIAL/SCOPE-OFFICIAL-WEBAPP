import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function GET() {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "Firebase is working 🚀",
      createdAt: new Date()
    });

    return Response.json({ success: true, id: docRef.id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}