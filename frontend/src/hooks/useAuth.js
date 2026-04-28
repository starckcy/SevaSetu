import { useEffect, useState } from "react";

import { api } from "../api";
import { firebaseService } from "../services/firebase";

export function useAuth(showToast) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(firebaseService.configured);
  const [rolePromptOpen, setRolePromptOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseService.listenToAuth(async (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      try {
        const savedProfile = await api.getUserProfile(nextUser.uid);
        setProfile(savedProfile);
      } catch {
        setRolePromptOpen(true);
      }
    });

    return unsubscribe;
  }, []);

  async function signIn() {
    try {
      const signedInUser = await firebaseService.signInWithGoogle();
      setUser(signedInUser);
      setRolePromptOpen(true);
    } catch (error) {
      showToast({
        tone: "error",
        title: "Sign-in unavailable",
        message: error.message,
      });
    }
  }

  async function completeProfile(role) {
    if (!user) {
      return;
    }

    const savedProfile = await api.saveUserProfile({
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role,
    });

    setProfile(savedProfile);
    setRolePromptOpen(false);
    showToast({
      tone: "success",
      title: "Profile ready",
      message: `Signed in as ${role}.`,
    });
  }

  async function signOut() {
    await firebaseService.signOutUser();
    setUser(null);
    setProfile(null);
  }

  return {
    authLoading,
    firebaseConfigured: firebaseService.configured,
    profile,
    rolePromptOpen,
    setRolePromptOpen,
    signIn,
    signOut,
    completeProfile,
    user,
  };
}
