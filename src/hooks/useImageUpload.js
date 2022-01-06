import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";

const useImageUpload = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useAuthContext();

  const upload = async (image) => {
    setLoading(false);
    setError(null);
    setSuccess(false);

    return await new Promise((resolve, reject) => {
      const uuid = uuidv4();
      const ext = image.name.substring(image.name.lastIndexOf(".") + 1);
      const fileRef = ref(storage, `${currentUser.uid}/${uuid}.${ext}`);
      const uploadTask = uploadBytesResumable(fileRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        // Error handler
        (error) => {
          console.error(error);
          setError(error.message);
          setLoading(false);
          reject(error);
        },
        // Success handler
        async () => {
          const url = await getDownloadURL(fileRef);
          const collectionRef = collection(
            db,
            `users/${currentUser.uid}/images`
          );
          const result = await addDoc(collectionRef, {
            name: image.name,
            path: fileRef.fullPath,
            size: image.size,
            type: image.type,
            ext,
            url,
            uuid,
          });
          setLoading(false);
          setSuccess(true);
          resolve(result);
        }
      );
    });
  };

  return { error, loading, success, progress, upload };
};

export default useImageUpload;
