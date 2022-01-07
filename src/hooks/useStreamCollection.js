import { db } from "../firebase";
import { collection, query, addDoc } from "firebase/firestore";
import useStreamQuery from "./useStreamQuery";

const useStreamCollection = (collectionPath) => {
  const queryRef = query(collection(db, collectionPath));
  const streamQuery = useStreamQuery(queryRef);

  const add = (data) => {
    return addDoc(collection(db, collectionPath), data);
  };

  return {
    ...streamQuery,
    add,
  };
};

export default useStreamCollection;
