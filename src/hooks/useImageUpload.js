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

  const upload = async (images) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Keep separate progress for each file
    const progressList = new Array(images.length);

    try {
      const results = await Promise.all(
        images.map(
          (image, index) =>
            new Promise((resolve, reject) => {
              const uuid = uuidv4();
              const ext = image.name.substring(image.name.lastIndexOf(".") + 1);
              const fileRef = ref(storage, `${currentUser.uid}/${uuid}.${ext}`);
              const uploadTask = uploadBytesResumable(fileRef, image);

              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  // Calculate progress for this file
                  progressList[index] =
                    snapshot.bytesTransferred / snapshot.totalBytes;
                  // Total progress for all files
                  setProgress(
                    progressList.reduce((acc, val) => acc + val) / images.length
                  );
                },
                // Error handler
                (error) => {
                  reject(error);
                },
                // Success handler
                async () => {
                  const url = await getDownloadURL(fileRef);
                  const collectionRef = collection(
                    db,
                    `users/${currentUser.uid}/images`
                  );
                  // Create and return a document with metadata
                  // for this image
                  const result = await addDoc(collectionRef, {
                    name: image.name,
                    path: fileRef.fullPath,
                    size: image.size,
                    type: image.type,
                    ext,
                    url,
                    uuid,
                    albums: [],
                  });
                  resolve(result);
                }
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
