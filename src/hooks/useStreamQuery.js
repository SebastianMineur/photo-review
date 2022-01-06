import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

const useStreamQuery = (query) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (snapshot) => {
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

export default useStreamQuery;
