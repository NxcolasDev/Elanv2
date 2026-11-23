import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../services/firebase";
import { api } from "../services/api";
import { AuthContext } from "./authContext";
import { setActiveStorageUser } from "../utils/storageScope";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setActiveStorageUser(firebaseUser?.uid || "demo");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    try {
      await api.post("/api/users/sync");
    } catch {
      console.warn("Não foi possível sincronizar o perfil.");
    }

    return firebaseUser;
  };

  const logout = () => signOut(auth);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginWithGoogle,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
