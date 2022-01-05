import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

const useStreamCollection = (col) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, col);
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
  };
};

export default useStreamCollection;
