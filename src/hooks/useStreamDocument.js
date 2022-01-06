import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const useStreamDocument = (path, id) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const docRef = useRef();

  const update = async (data) => {
    return await updateDoc(docRef.current, data);
  };

  useEffect(() => {
    setLoading(true);

    docRef.current = doc(db, path, id);

    const unsubscribe = onSnapshot(docRef.current, (snapshot) => {
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
    update,
  };
};

export default useStreamDocument;
