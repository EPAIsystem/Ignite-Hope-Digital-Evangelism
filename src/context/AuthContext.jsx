import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, EmailAuthProvider,
  reauthenticateWithCredential, updatePassword,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { upsertUserProfile, getUserProfile, getAllUsers } from "../lib/store";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const DEMO_SESSION_KEY = "ihde_demo_session";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid) => {
    const p = await getUserProfile(uid);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsub = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) await loadProfile(user.uid);
        else setProfile(null);
        setLoading(false);
      });
      return unsub;
    }
    const saved = localStorage.getItem(DEMO_SESSION_KEY);
    if (saved) {
      const u = JSON.parse(saved);
      setCurrentUser(u);
      loadProfile(u.uid).then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadProfile]);

  async function signUpWithEmail({ name, email, password, role = "public", team = null }) {
    if (isFirebaseConfigured) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await upsertUserProfile(cred.user.uid, { name, email, role, team });
      await loadProfile(cred.user.uid);
      return cred.user.uid;
    }
    const uid = `demo-${Date.now()}`;
    const user = { uid, email };
    await upsertUserProfile(uid, { name, email, role, team, password });
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    setCurrentUser(user);
    await loadProfile(uid);
    return uid;
  }

  async function loginWithEmail({ email, password }) {
    if (isFirebaseConfigured) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await loadProfile(cred.user.uid);
      return;
    }
    const users = await getAllUsers();
    const match = users.find((u) => u.email === email && u.password === password);
    if (!match) throw new Error("Invalid email or password.");
    const user = { uid: match.uid, email };
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
    setCurrentUser(user);
    await loadProfile(match.uid);
  }

  async function loginWithGoogle() {
    if (!isFirebaseConfigured) throw new Error("Google sign-in requires a connected Firebase project.");
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    const existing = await getUserProfile(cred.user.uid);
    if (!existing) {
      await upsertUserProfile(cred.user.uid, {
        name: cred.user.displayName, email: cred.user.email, role: "public", team: null,
      });
    }
    await loadProfile(cred.user.uid);
  }

  async function logout() {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem(DEMO_SESSION_KEY);
      setCurrentUser(null);
      setProfile(null);
    }
  }

  async function changeOwnPassword(currentPassword, newPassword) {
    if (isFirebaseConfigured) {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in.");
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return;
    }
    if (profile?.password !== currentPassword) throw new Error("Current password is incorrect.");
    await upsertUserProfile(currentUser.uid, { password: newPassword });
  }

  const value = {
    currentUser, profile, loading, isFirebaseConfigured,
    signUpWithEmail, loginWithEmail, loginWithGoogle, logout, changeOwnPassword,
    refreshProfile: () => currentUser && loadProfile(currentUser.uid),
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
