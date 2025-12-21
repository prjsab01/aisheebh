import { collection, getDocs, query, where, orderBy, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Profile, Highlight, Entry, Section } from '@/types';

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

export async function getSections(): Promise<Section[]> {
  const q = query(collection(db, 'sections'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Section));
}

export async function addSection(section: Omit<Section, 'id'>): Promise<void> {
  await addDoc(collection(db, 'sections'), section);
}

export async function updateSection(section: Section): Promise<void> {
  const sectionRef = doc(db, 'sections', section.id);
  await setDoc(sectionRef, section, { merge: true });
}

export async function deleteSection(id: string): Promise<void> {
  await deleteDoc(doc(db, 'sections', id));
}

export async function getEntries(): Promise<Entry[]> {
  const q = query(collection(db, 'entries'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Entry));
}

export async function getEntriesBySection(sectionId: string): Promise<Entry[]> {
  const q = query(collection(db, 'entries'), where('sectionId', '==', sectionId), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Entry));
}

export async function addEntry(entry: Omit<Entry, 'id'>): Promise<void> {
  await addDoc(collection(db, 'entries'), entry);
}

export async function updateEntry(entry: Entry): Promise<void> {
  const entryRef = doc(db, 'entries', entry.id);
  await setDoc(entryRef, entry, { merge: true });
}

export async function deleteEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, 'entries', id));
}