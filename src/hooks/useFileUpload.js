import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";

// Upload a single file and create a document for it
const uploadFile = (file, userId, onChange = () => {}) => {
  const uuid = uuidv4();
  const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
  const fileRef = ref(storage, `${userId}/${uuid}.${ext}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      // Progress handler
      (snapshot) => onChange(snapshot.bytesTransferred / snapshot.totalBytes),
      // Error handler
      (error) => reject(error),
      // Success handler
      async () => {
        const url = await getDownloadURL(fileRef);
        const collectionRef = collection(db, `users/${userId}/images`);
        // Create and return a document with metadata
        // for this image
        const result = await addDoc(collectionRef, {
          name: file.name,
          path: fileRef.fullPath,
          size: file.size,
          type: file.type,
          ext,
          url,
          uuid,
          albums: [],
        });
        resolve(result);
      }
    );
  });
};

const useImageUpload = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useAuthContext();

  // Upload one or more files
  const upload = async (files) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Keep separate progress for each file
    const progressList = new Array(files.length);

    try {
      const results = await Promise.all(
        files.map((file, index) =>
          uploadFile(file, currentUser.uid, (progress) => {
            progressList[index] = progress;
            // Total progress for all files
            setProgress(
              progressList.reduce((acc, val) => acc + val) / files.length
            );
          })
        )
      );
      // All files uploaded successfully
      setLoading(false);
      setSuccess(true);
      return results;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return { error, loading, success, progress, upload };
};

export default useImageUpload;
