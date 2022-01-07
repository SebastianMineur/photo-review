import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import {
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
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

  // Update album title directly in firestore
  const handleChangeTitle = (e) => {
    albumDoc.update({ title: e.target.value });
  };

  // Upload files received from Dropzone
  const handleDrop = async (files) => {
    for (const file of files) {
      const imageDoc = await uploadImage.upload(file);
      await updateDoc(imageDoc, { albums: arrayUnion(albumId) });
    }
  };

  const handleDelete = async () => {
    // Create batch operations
    const batch = writeBatch(db);
    const fileRefs = [];

    // Album to be deleted
    const albumRef = doc(db, `users/${currentUser.uid}/albums/${albumId}`);
    batch.delete(albumRef);

    for (const image of albumImages.data) {
      const imageRef = doc(db, `users/${currentUser.uid}/images/${image._id}`);
      if (image.albums.length > 1) {
        // Image will still exist in other albums. Just remove reference to this album
        batch.update(imageRef, { albums: arrayRemove(albumId) });
      } else {
        // Image will not be in any albums. Remove the image itself
        batch.delete(imageRef);
        // Also delete the actual file from storage
        fileRefs.push(ref(storage, image.path));
      }
    }

    try {
      // Commit all operations at once
      await batch.commit();
      // Delete all files at once
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

      <Dropzone onDrop={handleDrop} className="my-2" />

      <PhotoGrid className="my-3">
        {albumImages.data?.map((image) => (
          <Photo key={image._id} image={image} />
        ))}
      </PhotoGrid>

      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </Container>
  );
};

export default AlbumPage;
