import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import LoadingPage from "./LoadingPage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import useAlbum from "../hooks/useAlbum";
import useAlbums from "../hooks/useAlbums";
import classes from "../util/classes";

const ReviewPage = () => {
  const { userId, albumId } = useParams();
  const currentAlbum = useAlbum(userId, albumId);
  const userAlbums = useAlbums(userId);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const numRated = Object.keys(ratings).length;
  const numRatedPositive = Object.values(ratings).filter((r) => r > 0).length;

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  // Create new album
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await userAlbums.create(
        currentAlbum.data.title,
        Object.entries(ratings)
          .filter(([key, value]) => value > 0)
          .map(([key, value]) => key)
      );
      navigate("/confirm");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  if (currentAlbum.loading) return <LoadingPage />;
  if (!currentAlbum.data) return <Navigate to="/" />;

  return (
    <Container>
      <Row className="my-2 flex-nowrap">
        <Col>
          <h1
            className={classes(
              "h1 w-100 border-0 m-0",
              !currentAlbum.data.title && "opacity-50"
            )}
          >
            {currentAlbum.data.title || "<untitled>"}
          </h1>
        </Col>
      </Row>

      <PhotoGrid className="my-3">
        {currentAlbum.images?.map((image) => (
          <Photo key={image._id} image={image}>
            <button
              className={classes(ratings[image._id] < 0 && "text-danger")}
              onClick={() => handleRating(image._id, -1)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <button
              className={classes(ratings[image._id] > 0 && "text-success")}
              onClick={() => handleRating(image._id, 1)}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </Photo>
        ))}
      </PhotoGrid>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex align-items-center gap-2 my-3">
        <span className="fs-4 fw-bold">
          {numRatedPositive} / {currentAlbum.images?.length}
        </span>
        <span>Accepted images</span>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 my-3">
        <Button
          disabled={currentAlbum.images?.length !== numRated || loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>

        <Button variant="outline-danger" onClick={() => setRatings({})}>
          Reset
        </Button>

        {currentAlbum.images?.length !== numRated && (
          <p className="text-danger w-100">
            Cannot submit before rating every photo
          </p>
        )}
      </div>
    </Container>
  );
};

export default ReviewPage;
