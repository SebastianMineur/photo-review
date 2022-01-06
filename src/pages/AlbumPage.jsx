import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useAuthContext } from "../contexts/AuthContext";
import useStreamDocument from "../hooks/useStreamDocument";
import { doc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import Dropzone from "../components/Dropzone";
import useImageUpload from "../hooks/useImageUpload";
import Photo from "../components/Photo";
import PhotoGrid from "../components/PhotoGrid";

const AlbumPage = () => {
  const { currentUser } = useAuthContext();
  const { albumId } = useParams();
  const albumDoc = useStreamDocument(
    `users/${currentUser.uid}/albums`,
    albumId
  );
  const uploadImage = useImageUpload();

  const handleChangeTitle = (e) => {
    albumDoc.update({ title: e.target.value });
  };

  const handleDrop = async (files) => {
    const totalSize = files.reduce((acc, val) => acc + val.size, 0);
    console.log(files, totalSize);
    let uploadedSize = 0;
    for (const file of files) {
      const imageDoc = await uploadImage.upload(file);
      await albumDoc.update({ images: arrayUnion(doc(db, imageDoc.path)) });
      uploadedSize += file.size;
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <input
            value={albumDoc?.data?.title ?? ""}
            onChange={handleChangeTitle}
            className="h1 w-100 border-0"
            placeholder="Album title..."
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Dropzone onDrop={handleDrop} className="mb-3" />
        </Col>
      </Row>

      <Row>
        <Col>
          <PhotoGrid>
            {albumDoc.data?.images?.map((image) => (
              <Photo key={image.id} id={image.path} />
            ))}
          </PhotoGrid>
        </Col>
      </Row>
    </Container>
  );
};

export default AlbumPage;
