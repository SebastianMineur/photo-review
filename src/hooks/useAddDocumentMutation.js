import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

const useAddDocumentMutation = (collectionPath) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (data) => {
    setLoading(true);
    setError(null);
    let result = null;
    try {
      result = await addDoc(collection(db, collectionPath), data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
    setLoading(false);
    return result;
  };

  return { loading, error, mutate };
};

export default useAddDocumentMutation;
