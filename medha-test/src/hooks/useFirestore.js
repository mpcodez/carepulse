import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, appId } from '../firebase/config';

/**
 * Real-time Firestore hook for a per-user sub-collection.
 *
 * @param {string|null} userId - Firebase UID (null while unauthenticated)
 * @param {string} collectionName - e.g. 'healthLogs', 'medications'
 * @param {Array} fallbackData - data used when Firestore is empty or user is null
 * @param {object} [options]
 * @param {function} [options.sort] - comparator passed to Array.sort
 */
export function useFirestore(userId, collectionName, fallbackData = [], options = {}) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  // Resolve the Firestore collection path
  const getColRef = () =>
    collection(db, 'artifacts', appId, 'users', userId, collectionName);

  useEffect(() => {
    if (!userId) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    const colRef = getColRef();

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (options.sort) {
            docs.sort(options.sort);
          }
          setData(docs);
        } else {
          // Seed initial data into Firestore
          fallbackData.forEach(async (item) => {
            try {
              await addDoc(colRef, item);
            } catch (err) {
              console.error(`Error seeding ${collectionName}:`, err);
            }
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore ${collectionName} error:`, err);
        setLoading(false);
      }
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, collectionName]);

  // --- Mutation helpers ---

  const add = async (item) => {
    if (userId) {
      await addDoc(getColRef(), item);
    } else {
      setData((prev) => [...prev, { ...item, id: Date.now().toString() }]);
    }
  };

  const update = async (docId, fields) => {
    if (userId) {
      await updateDoc(
        doc(db, 'artifacts', appId, 'users', userId, collectionName, docId),
        fields
      );
    } else {
      setData((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, ...fields } : d))
      );
    }
  };

  const remove = async (docId) => {
    if (userId) {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', userId, collectionName, docId)
      );
    } else {
      setData((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  return { data, loading, add, update, remove };
}
