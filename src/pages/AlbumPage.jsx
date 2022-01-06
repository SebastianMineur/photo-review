import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../contexts/AuthContext";
import useStreamDocument from "../hooks/useStreamDocument";
import useImageUpload from "../hooks/useImageUpload";
import Dropzone from "../components/Dropzone";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";
import useImagesByAlbum from "../hooks/useImagesByAlbum";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const uploadImage = useImageUpload();
  const albumDoc = useStreamDocument(
    `users/${currentUser.uid}/albums`,
    albumId
  );
  const albumImages = useImagesByAlbum(currentUser.uid, albumId);

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
          <p className="m-0">
            {new Date(
              albumDoc?.data?.timestamp.seconds * 1000
            ).toLocaleString()}
          </p>
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
        {albumImages.data?.map((image) => (
          <Photo key={image._id} image={image} />
        ))}
      </PhotoGrid>
    </Container>
  );
};

export default AlbumPage;
