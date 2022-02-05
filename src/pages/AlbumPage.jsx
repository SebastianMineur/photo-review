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
import Spinner from "../components/Spinner";
import LoadingPage from "./LoadingPage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

import { useAuthContext } from "../contexts/AuthContext";
import useAlbum from "../hooks/useAlbum";
import useAlbums from "../hooks/useAlbums";
import styles from "./AlbumPage.module.css";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const currentAlbum = useAlbum(currentUser.uid, albumId);
  const userAlbums = useAlbums(currentUser.uid);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  // Link for reviewing this album
  const reviewUrl =
    `${window.location.protocol}//${window.location.host}` +
    `/review/${currentUser.uid}/${albumId}`;

  // Array of selected images
  const [selected, setSelected] = useState([]);

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
    setUpdating(true);
    try {
      await currentAlbum.remove();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setUpdating(false);
  };

  const toggleSelected = (image) => {
    if (selected.includes(image)) {
      // Deselect image
      setSelected(selected.filter((img) => img !== image));
    } else {
      // Select image
      setSelected([...selected, image]);
    }
  };

  // Create new album from selection
  const handleCreateAlbum = async () => {
    setError(null);
    setUpdating(true);
    try {
      // Create new album
      await userAlbums.create(
        currentAlbum.data.title,
        selected.map((img) => img._id)
      );
      navigate("/confirm");
    } catch (error) {
      setError(error.message);
    }
    setUpdating(false);
  };

  // Remove selected images from album
  const handleRemoveImages = async () => {
    setError(null);
    setUpdating(true);
    try {
      await currentAlbum.removeImages(selected);
    } catch (error) {
      setError(error.message);
    }
    setSelected([]);
    setUpdating(false);
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
              <button onClick={() => toggleSelected(image)}>
                {selected.includes(image) ? (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-primary"
                  />
                ) : (
                  <FontAwesomeIcon icon={faCircle} />
                )}
              </button>
            </Photo>
          ))}
        </PhotoGrid>
      )}

      {updating && (
        <div className="d-flex align-items-center gap-3 text-black-50 my-3">
          <Spinner size="2rem" />
          <span>Updating...</span>
        </div>
      )}

      {selected?.length > 0 && !updating && (
        <div className="d-flex flex-column gap-1 my-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4 fw-bold">
              {selected?.length} / {currentAlbum.images?.length}
            </span>
            <span>Selected</span>
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleCreateAlbum}>
              Create album
            </Button>
            <Button variant="outline-danger" onClick={handleRemoveImages}>
              Delete selected
            </Button>
          </div>
        </div>
      )}

      {!updating && (
        <div className="d-flex flex-column align-items-start gap-1 my-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-4 fw-bold">{currentAlbum.images?.length}</span>
            <span>Images</span>
          </div>

          <Button variant="outline-danger" onClick={handleRemoveAlbum}>
            Delete album
          </Button>
        </div>
      )}
    </Container>
  );
};

export default AlbumPage;
