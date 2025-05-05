import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  collection,
  Timestamp,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-qkNBCzUvQlVOLIh_oQNs_KGW85Nw-YQ",
  authDomain: "pepsa-userapp.firebaseapp.com",
  projectId: "pepsa-userapp",
  storageBucket: "pepsa-userapp.appspot.com",
  messagingSenderId: "791902017949",
  appId: "1:791902017949:web:775c939a3f65c5750eb774",
  measurementId: "G-RXR5ZVZ0PH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Types
export interface RegisterData {
  email: string;
  phoneNumber: string;
  name: string;
  password: string;
}

export type UserProfile = {
  email: string;
  phoneNumber: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} & Record<string, unknown>;

// Context value shape
type FirebaseContextProps = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<UserCredential>;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  getUserProfile: () => Promise<UserProfile>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteUserProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextProps | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (uid: string): Promise<UserProfile> => {
    const ref = doc(db, "diadem-pepsa", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Profile not found");
    return snap.data() as UserProfile;
  };

  const createProfile = async (uid: string, data: Partial<UserProfile>) => {
    const ref = doc(db, "diadem-pepsa", uid);
    await setDoc(ref, { ...data, createdAt: serverTimestamp() }, { merge: true });
  };

  const updateProfile = async (uid: string, data: Partial<UserProfile>) => {
    const ref = doc(db, "diadem-pepsa", uid);
    // Use setDoc with merge to persist new fields
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  };

  const deleteProfile = async (uid: string) => {
    const ref = doc(db, "diadem-pepsa", uid);
    await deleteDoc(ref);
  };

  const register = async ({ email, phoneNumber, name, password }: RegisterData): Promise<UserCredential> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
  
    // Save full profile in diadem-pepsa
    await createProfile(uid, { email, phoneNumber, name });
  
    // Save auth identifiers in a single doc in authIdentifiers
    await setDoc(doc(db, "authIdentifiers", uid), {
      uid,
      email,
      phoneNumber,
    });
  
    return cred;
  };
  

  const login = async (identifier: string, password: string) => {
    let emailToUse = identifier;
  
    if (!identifier.includes("@")) {
      // Look for phone number in authIdentifiers
      const q = query(
        collection(db, "authIdentifiers"),
        where("phoneNumber", "==", identifier)
      );
      const snap = await getDocs(q);
      if (snap.empty) throw new Error("No user found with that phone number");
      emailToUse = snap.docs[0].data().email as string;
    }
  
    const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
    return cred.user;
  };

  const logout = () => signOut(auth);

  const getUserProfile = async (): Promise<UserProfile> => {
    if (!user) throw new Error("No user logged in");
    return fetchUserProfile(user.uid);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in");
    await updateProfile(user.uid, data);
  };

  const deleteUserProfile = async () => {
    if (!user) throw new Error("No user logged in");
    await deleteProfile(user.uid);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      setUser(fbUser);
      if (fbUser) {
        try {
          const p = await fetchUserProfile(fbUser.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const p = await fetchUserProfile(user.uid);
      setProfile(p);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      setProfile(null);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        profile,
        loading,
        register,
        login,
        logout,
        getUserProfile,
        updateUserProfile,
        deleteUserProfile,
        refreshProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFirebase = (): FirebaseContextProps => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("useFirebase must be used within FirebaseProvider");
  return ctx;
};
