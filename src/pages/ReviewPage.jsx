import { useState } from "react";
import { useParams } from "react-router-dom";
import useStreamDocument from "../hooks/useStreamDocument";
import useStreamCollection from "../hooks/useStreamCollection";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";

const ReviewPage = () => {
  const { userId, albumId } = useParams();
  const albumDoc = useStreamDocument(`users/${userId}/albums`, albumId);
  const [ratings, setRatings] = useState({});
  const albumsCollection = useStreamCollection(`users/${userId}/albums`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await albumsCollection.add({
        title: albumDoc.data.title + Date.now(),
        images: Object.entries(ratings)
          .filter(([undefined, val]) => val > 0)
          .map(([key]) => key),
      });
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

      <PhotoGrid>
        {albumDoc.data?.images?.map((id) => (
          <Photo
            key={id}
            path={`users/${userId}/images/${id}`}
            onChange={(rating) => handleRating(id, rating)}
          />
        ))}
      </PhotoGrid>

      <Button
        className="my-3"
        disabled={
          albumDoc?.data?.images?.length !== Object.keys(ratings).length ||
          loading
        }
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Container>
  );
};

export default ReviewPage;
