import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { arrayUnion } from "firebase/firestore";
import { useAuthContext } from "../contexts/AuthContext";
import useStreamDocument from "../hooks/useStreamDocument";
import useImageUpload from "../hooks/useImageUpload";
import Dropzone from "../components/Dropzone";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const uploadImage = useImageUpload();
  const albumDoc = useStreamDocument(
    `users/${currentUser.uid}/albums`,
    albumId
  );

  // Update album title directly in firestore
  const handleChangeTitle = (e) => {
    albumDoc.update({ title: e.target.value });
  };

  // Upload files received from Dropzone
  const handleDrop = async (files) => {
    for (const file of files) {
      const imageDoc = await uploadImage.upload(file);
      await albumDoc.update({ images: arrayUnion(imageDoc.id) });
    }
  };

  // Link for reviewing this album
  const reviewUrl =
    `${window.location.protocol}//${window.location.host}` +
    `/review/${currentUser.uid}/${albumId}`;

  return (
    <Container>
      <Row className="my-2 flex-nowrap">
        <Col>
          <input
            value={albumDoc?.data?.title ?? ""}
            onChange={handleChangeTitle}
            className="h1 w-100 border-0 m-0"
            placeholder="Album title..."
          />
        </Col>
      </Row>

      <Alert variant="primary">
        <b>Review link:</b>
        <br />
        <a style={{ overflowWrap: "anywhere" }} href={reviewUrl}>
          {reviewUrl}
        </a>
      </Alert>

      <Dropzone onDrop={handleDrop} className="mb-3" />

      <PhotoGrid>
        {albumDoc.data?.images?.map((id) => (
          <Photo key={id} path={`users/${currentUser.uid}/images/${id}`} />
        ))}
      </PhotoGrid>
    </Container>
  );
};

export default AlbumPage;
