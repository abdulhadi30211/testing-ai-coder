import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}