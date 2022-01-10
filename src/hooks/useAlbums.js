import { db } from "../firebase";
import { collection, query, addDoc, orderBy } from "firebase/firestore";
import useStreamQuery from "./useStreamQuery";

const useAlbums = (userId) => {
  const path = `users/${userId}/albums`;

  const queryRef = query(collection(db, path), orderBy("timestamp", "desc"));
  const streamQuery = useStreamQuery(queryRef);

  const add = (data) => {
    return addDoc(collection(db, path), data);
  };

  return {
    ...streamQuery,
    add,
  };
};

export default useAlbums;
