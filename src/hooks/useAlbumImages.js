import { db } from "../firebase";
import { collection, query, where } from "firebase/firestore";
import useStreamQuery from "./useStreamQuery";

const useAlbumImages = (userId, albumId) => {
  const ref = collection(db, `users/${userId}/images`);
  const queryRef = query(ref, where("albums", "array-contains", albumId));

  return useStreamQuery(queryRef);
};

export default useAlbumImages;
