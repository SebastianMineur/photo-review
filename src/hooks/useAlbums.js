import { db } from "../firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  orderBy,
  serverTimestamp,
  query,
  writeBatch,
} from "firebase/firestore";
import useStreamQuery from "./useStreamQuery";

const useAlbums = (userId) => {
  const path = `users/${userId}/albums`;

  const queryRef = query(collection(db, path), orderBy("timestamp", "desc"));
  const streamQuery = useStreamQuery(queryRef);

  const add = (data) => {
    return addDoc(collection(db, path), data);
  };

  // Create new album
  const create = async (title, imageIds) => {
    const newAlbum = await add({
      title: title,
      timestamp: serverTimestamp(),
      count: imageIds?.length || 0,
    });
    // Create batch operation
    const batch = writeBatch(db);

    imageIds?.forEach((id) => {
      // Create operation to add reference to new the album
      const docRef = doc(db, `users/${userId}/images/${id}`);
      batch.update(docRef, {
        albums: arrayUnion(newAlbum.id),
      });
    });
    // Commit all operations at once
    await batch.commit();
    return newAlbum;
  };

  return {
    ...streamQuery,
    create,
  };
};

export default useAlbums;
