import { doc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import useStreamDocument from "../hooks/useStreamDocument";
import useFileUpload from "../hooks/useFileUpload";
import useImagesByAlbum from "../hooks/useImagesByAlbum";

const useAlbum = (albumId) => {
  const { currentUser } = useAuthContext();
  const albumDoc = useStreamDocument(
    `users/${currentUser.uid}/albums`,
    albumId
  );
  const albumImages = useImagesByAlbum(currentUser.uid, albumId);
  const fileUpload = useFileUpload();

  const remove = async () => {
    const batch = writeBatch(db);
    const albumRef = doc(db, `users/${currentUser.uid}/albums/${albumId}`);
    const fileRefs = [];

    // Set album to be deleted
    batch.delete(albumRef);

    for (const image of albumImages.data) {
      const imageRef = doc(db, `users/${currentUser.uid}/images/${image._id}`);
      if (image.albums.length > 1) {
        // Image will still exist in other albums,
        // just remove reference to this album
        batch.update(imageRef, { albums: arrayRemove(albumId) });
      } else {
        // Image will not be in any albums.
        // Remove the image itself
        batch.delete(imageRef);
        // Also delete the file from storage
        fileRefs.push(ref(storage, image.path));
      }
    }

    // Commit all database operations
    await batch.commit();
    // Delete all files
    await Promise.all(fileRefs.map((fileRef) => deleteObject(fileRef)));
  };

  const uploadImages = async (files) => {
    const batch = writeBatch(db);
    const results = await fileUpload.upload(files);
    for (const imageDoc of results) {
      batch.update(imageDoc, { albums: arrayUnion(albumId) });
    }
    await batch.commit();
    await albumDoc.update({
      count: albumImages.data.length + results.length,
    });
  };

  return {
    data: albumDoc.data,
    error: albumDoc.error ?? albumImages.error,
    update: albumDoc.update,
    remove: remove,
    images: {
      data: albumImages.data,
      loading: albumImages.loading,
      upload: uploadImages,
      uploading: fileUpload.loading,
      uploadProgress: fileUpload.progress,
      uploadError: fileUpload.error,
    },
  };
};

export default useAlbum;
