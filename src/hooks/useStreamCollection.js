import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, addDoc } from "firebase/firestore";

const useStreamCollection = (collectionPath) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const add = async (data) => {
    setLoading(true);
    return await addDoc(collection(db, collectionPath), data);
  };

  useEffect(() => {
    const ref = collection(db, collectionPath);
    const queryRef = query(ref);

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return {
          _id: doc.id,
          ...doc.data(),
        };
      });

      setData(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    loading,
    data,
    add,
  };
};

export default useStreamCollection;
