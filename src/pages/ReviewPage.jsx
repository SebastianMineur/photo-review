import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import useAlbum from "../hooks/useAlbum";
import useAlbums from "../hooks/useAlbums";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import LoadingPage from "./LoadingPage";
import {
  doc,
  serverTimestamp,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create new album
      const newAlbum = await userAlbums.add({
        title: currentAlbum.data.title,
        timestamp: serverTimestamp(),
        count: numRatedPositive,
      });
      // Create batch operation
      const batch = writeBatch(db);

      // For every photo that has a positive rating
      for (const id in ratings) {
        if (ratings[id] <= 0) continue;

        // Create operation to add reference to new the album
        const docRef = doc(db, `users/${userId}/images/${id}`);
        batch.update(docRef, {
          albums: arrayUnion(newAlbum.id),
        });
      }
      // Commit all operations at once
      await batch.commit();
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
          <Photo
            key={image._id}
            image={image}
            rating={ratings[image._id]}
            onChange={(rating) => handleRating(image._id, rating)}
          />
        ))}
      </PhotoGrid>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex align-items-center gap-2 my-3">
        <span className="fs-4 fw-bold">
          {numRatedPositive} / {currentAlbum.images?.length}
        </span>
        <span>Accepted images</span>
      </div>

      <div className="d-flex align-items-center gap-2 my-3">
        <Button
          disabled={currentAlbum.images?.length !== numRated || loading}
          onClick={handleSubmit}
        >
          Submit ratings
        </Button>

        {currentAlbum.images?.length !== numRated && (
          <span className="text-danger">
            Cannot submit before rating every photo
          </span>
        )}
      </div>
    </Container>
  );
};

export default ReviewPage;
