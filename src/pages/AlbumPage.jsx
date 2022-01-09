import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useAuthContext } from "../contexts/AuthContext";
import Dropzone from "../components/Dropzone";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import InputAutoHeight from "../components/InputAutoHeight";
import LoadingPage from "./LoadingPage";
import styles from "./AlbumPage.module.css";
import useAlbum from "../hooks/useAlbum";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const album = useAlbum(albumId);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Update album title directly in firestore
  const handleChangeTitle = (e) => {
    album.update({ title: e.target.value });
  };

  // Upload files received from Dropzone
  const handleDrop = async (files) => {
    setError(null);
    try {
      await album.images.upload(files);
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete this album
  const handleDelete = async () => {
    setError(null);
    try {
      await album.remove();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  // Link for reviewing this album
  const reviewUrl =
    `${window.location.protocol}//${window.location.host}` +
    `/review/${currentUser.uid}/${albumId}`;

  if (!album.data) return <LoadingPage />;

  return (
    <Container>
      <Row className="my-2 flex-nowrap">
        <Col>
          <InputAutoHeight
            value={album.data.title}
            className={styles.title + " h1"}
            onChange={handleChangeTitle}
            placeholder="Album title..."
          />

          <p className="mb-0">
            {new Date(album.data.timestamp.seconds * 1000).toLocaleString()}
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

      {album.uploading ? (
        <ProgressBar animated now={album.images.upload.progress * 100} />
      ) : (
        <Dropzone onDrop={handleDrop} className="my-3" />
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {album.images?.length > 0 && (
        <PhotoGrid>
          {album.images.map((image) => (
            <Photo key={image._id} image={image} />
          ))}
        </PhotoGrid>
      )}

      <Button variant="danger" onClick={handleDelete} className="my-3">
        Delete album
      </Button>
    </Container>
  );
};

export default AlbumPage;
