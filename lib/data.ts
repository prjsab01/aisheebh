import { collection, getDocs, query, where, orderBy, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Profile, Highlight, Entry } from '@/types';

export async function getProfile(): Promise<Profile | null> {
  const q = query(collection(db, 'profiles'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Profile;
  }
  return null;
}

export async function updateProfile(profile: Profile): Promise<void> {
  const profileRef = doc(db, 'profiles', profile.id);
  await setDoc(profileRef, profile, { merge: true });
}

export async function getHighlights(): Promise<Highlight[]> {
  const q = query(collection(db, 'highlights'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Highlight));
}

export async function addHighlight(highlight: Omit<Highlight, 'id'>): Promise<void> {
  await addDoc(collection(db, 'highlights'), highlight);
}

export async function updateHighlight(highlight: Highlight): Promise<void> {
  const highlightRef = doc(db, 'highlights', highlight.id);
  await setDoc(highlightRef, highlight, { merge: true });
}

export async function deleteHighlight(id: string): Promise<void> {
  await deleteDoc(doc(db, 'highlights', id));
}

export async function getExperiences(): Promise<Entry[]> {
  const q = query(collection(db, 'entries'), where('sectionId', '==', 'experience'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Entry));
}

export async function addExperience(experience: Omit<Entry, 'id'>): Promise<void> {
  await addDoc(collection(db, 'entries'), experience);
}

export async function updateExperience(experience: Entry): Promise<void> {
  const experienceRef = doc(db, 'entries', experience.id);
  await setDoc(experienceRef, experience, { merge: true });
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, 'entries', id));
}