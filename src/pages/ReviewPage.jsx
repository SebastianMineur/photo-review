import { useState } from "react";
import { useParams } from "react-router-dom";
import useStreamDocument from "../hooks/useStreamDocument";
import useStreamCollection from "../hooks/useStreamCollection";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import useImagesByAlbum from "../hooks/useImagesByAlbum";
import {
  doc,
  serverTimestamp,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const ReviewPage = () => {
  const { userId, albumId } = useParams();
  const albumDoc = useStreamDocument(`users/${userId}/albums`, albumId);
  const [ratings, setRatings] = useState({});
  const albumsCollection = useStreamCollection(`users/${userId}/albums`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const albumImages = useImagesByAlbum(userId, albumId);

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create new album
      const newAlbum = await albumsCollection.add({
        title: albumDoc.data.title,
        timestamp: serverTimestamp(),
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
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Container>
      <Row className="my-2 flex-nowrap">
        <Col>
          <h1 className="h1 w-100 border-0 m-0">
            {albumDoc?.data?.title || "<untitled>"}
          </h1>
        </Col>
      </Row>

      <PhotoGrid className="my-3">
        {albumImages.data?.map((image) => (
          <Photo
            key={image._id}
            image={image}
            onChange={(rating) => handleRating(image._id, rating)}
          />
        ))}
      </PhotoGrid>

      {error && <Alert variant="danger">{error}</Alert>}

      {albumImages?.data?.length !== Object.keys(ratings).length && (
        <p className="mt-3 mb-1">
          <b>Note:</b> You cannot submit before rating every photo
        </p>
      )}
      <Button
        className="mb-3"
        disabled={
          albumImages?.data?.length !== Object.keys(ratings).length || loading
        }
        onClick={handleSubmit}
      >
        Submit ratings
      </Button>
    </Container>
  );
};

export default ReviewPage;
