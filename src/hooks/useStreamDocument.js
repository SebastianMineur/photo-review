import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const useStreamDocument = (col, id) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const ref = doc(db, col, id);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        setData(false);
        setLoading(false);
        return;
      }

      setData(snapshot.data());
      setLoading(false);
    });

    return unsubscribe;
  }, [id]);

  return {
    loading,
    data,
  };
};

export default useStreamDocument;
