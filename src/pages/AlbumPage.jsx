import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";

import Dropzone from "../components/Dropzone";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import InputAutoHeight from "../components/InputAutoHeight";
import LoadingPage from "./LoadingPage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { useAuthContext } from "../contexts/AuthContext";
import useAlbum from "../hooks/useAlbum";
import styles from "./AlbumPage.module.css";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const currentAlbum = useAlbum(currentUser.uid, albumId);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Link for reviewing this album
  const reviewUrl =
    `${window.location.protocol}//${window.location.host}` +
    `/review/${currentUser.uid}/${albumId}`;

  // Update album title directly in firestore
  const handleChangeTitle = (e) => {
    currentAlbum.update({ title: e.target.value });
  };

  // Upload files received from Dropzone
  const handleDrop = async (files) => {
    setError(null);
    try {
      await currentAlbum.upload(files);
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete this album
  const handleRemoveAlbum = async () => {
    setError(null);
    try {
      await currentAlbum.remove();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  if (currentAlbum.loading) return <LoadingPage />;
  if (!currentAlbum.data) return <Navigate to="/" />;

  return (
    <Container>
      <Row className="my-2 flex-nowrap">
        <Col>
          <InputAutoHeight
            value={currentAlbum.data.title}
            className={styles.title + " h1"}
            onChange={handleChangeTitle}
            placeholder="Album title..."
          />

          <p className="mb-0">
            {new Date(
              currentAlbum.data.timestamp.seconds * 1000
            ).toLocaleString()}
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

      {currentAlbum.uploading ? (
        <ProgressBar
          animated
          now={currentAlbum.uploadProgress * 100}
          className="my-3"
        />
      ) : (
        <Dropzone onDrop={handleDrop} className="my-3" />
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {currentAlbum.images?.length > 0 && (
        <PhotoGrid>
          {currentAlbum.images.map((image) => (
            <Photo key={image._id} image={image}>
              <button
                className="text-danger"
                onClick={() => currentAlbum.removeImage(image)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </Photo>
          ))}
        </PhotoGrid>
      )}

      <div className="d-flex align-items-center gap-2 my-3">
        <span className="fs-4 fw-bold">{currentAlbum.images?.length}</span>
        <span>Images</span>
      </div>

      <div className="my-3">
        <Button variant="danger" onClick={handleRemoveAlbum}>
          Delete album
        </Button>
      </div>
    </Container>
  );
};

export default AlbumPage;
