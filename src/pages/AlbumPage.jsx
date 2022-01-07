import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import { doc, arrayUnion, arrayRemove, writeBatch } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import useStreamDocument from "../hooks/useStreamDocument";
import useImageUpload from "../hooks/useImageUpload";
import useImagesByAlbum from "../hooks/useImagesByAlbum";
import Dropzone from "../components/Dropzone";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import LoadingPage from "./LoadingPage";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const uploadImage = useImageUpload();
  const albumDoc = useStreamDocument(
    `users/${currentUser.uid}/albums`,
    albumId
  );
  const albumImages = useImagesByAlbum(currentUser.uid, albumId);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Update album title directly in firestore
  const handleChangeTitle = (e) => {
    albumDoc.update({ title: e.target.value });
  };

  // Upload files received from Dropzone
  const handleDrop = async (files) => {
    setError(null);
    const batch = writeBatch(db);
    try {
      const results = await uploadImage.upload(files);
      for (const imageDoc of results) {
        batch.update(imageDoc, { albums: arrayUnion(albumId) });
      }
      await batch.commit();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    setError(null);
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

    try {
      // Commit all database operations
      await batch.commit();
      // Delete all files
      await Promise.all(fileRefs.map((fileRef) => deleteObject(fileRef)));
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  // Link for reviewing this album
  const reviewUrl =
    `${window.location.protocol}//${window.location.host}` +
    `/review/${currentUser.uid}/${albumId}`;

  if (!albumDoc.data) return <LoadingPage />;

  return (
    <Container>
      <Row className="my-2 flex-nowrap">
        <Col>
          <input
            value={albumDoc.data.title ?? ""}
            onChange={handleChangeTitle}
            className="h1 w-100 border-0 m-0"
            placeholder="Album title..."
          />

          <p className="mb-0">
            {new Date(albumDoc.data.timestamp.seconds * 1000).toLocaleString()}
          </p>
        </Col>
      </Row>

      <Alert variant="primary">
        <b>Review link:</b>
        <br />
        <Link
          style={{ overflowWrap: "anywhere" }}
          to={`/review/${currentUser.uid}/${albumId}`}
        >
          {reviewUrl}
        </Link>
      </Alert>

      {uploadImage.loading ? (
        <ProgressBar animated now={uploadImage.progress * 100} />
      ) : (
        <Dropzone onDrop={handleDrop} className="my-2" />
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {albumImages.data?.length > 0 && (
        <PhotoGrid className="my-3">
          {albumImages.data.map((image) => (
            <Photo key={image._id} image={image} />
          ))}
        </PhotoGrid>
      )}

      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </Container>
  );
};

export default AlbumPage;
