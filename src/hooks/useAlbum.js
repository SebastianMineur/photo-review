import {
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import useStreamDocument from "./useStreamDocument";
import useFileUpload from "./useFileUpload";
import useAlbumImages from "./useAlbumImages";

const useAlbum = (userId, albumId) => {
  const albumDoc = useStreamDocument(`users/${userId}/albums`, albumId);
  const albumImages = useAlbumImages(userId, albumId);
  const fileUpload = useFileUpload();

  const remove = async () => {
    const batch = writeBatch(db);
    const albumRef = doc(db, `users/${userId}/albums/${albumId}`);
    const fileRefs = [];

    // Set album to be deleted
    batch.delete(albumRef);

    for (const image of albumImages.data) {
      const imageRef = doc(db, `users/${userId}/images/${image._id}`);
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

  const upload = async (files) => {
    const batch = writeBatch(db);
    // Upload files
    const results = await fileUpload.upload(files);
    // Add reference to this album to each new image
    for (const imageDoc of results) {
      batch.update(imageDoc, { albums: arrayUnion(albumId) });
    }
    await batch.commit();
    // Update image count in album
    await albumDoc.update({
      count: albumImages.data.length + results.length,
    });
  };

  const removeImages = async (images) => {
    // So we can pass single image or array as param
    const arr = Array.isArray(images) ? images : [images];
    await Promise.all(
      arr.map(async (image) => {
        const imageRef = doc(db, `users/${userId}/images/${image._id}`);
        if (image.albums.length > 1) {
          // Image will still exist in other albums,
          // just remove reference to this album
          await updateDoc(imageRef, { albums: arrayRemove(albumId) });
        } else {
          // Image will not be in any albums.
          // Remove the image itself
          await deleteDoc(imageRef);
          // Also delete the file from storage
          await deleteObject(ref(storage, image.path));
        }
      })
    );
    // Update image count in album
    await albumDoc.update({
      count: albumImages.data.length - arr.length,
    });
  };

  return {
    data: albumDoc.data,
    loading: albumDoc.loading,
    error: albumDoc.error,
    update: albumDoc.update,
    remove: remove,
    images: albumImages.data,
    removeImages: removeImages,
    imagesLoading: albumImages.loading,
    imagesError: albumImages.error,
    upload: upload,
    uploading: fileUpload.loading,
    uploadProgress: fileUpload.progress,
    uploadError: fileUpload.error,
  };
};

export default useAlbum;
