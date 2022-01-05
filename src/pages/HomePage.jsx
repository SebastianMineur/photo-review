import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import useStreamCollection from "../hooks/useStreamCollection";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import useAddDocumentMutation from "../hooks/useAddDocumentMutation";

const HomePage = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { data: albums } = useStreamCollection(
    `users/${currentUser.uid}/albums`
  );
  const createAlbumMutation = useAddDocumentMutation(
    `users/${currentUser.uid}/albums`
  );

  const handleCreate = async () => {
    const result = await createAlbumMutation.mutate({
      title: "",
      images: [],
    });
    if (result) navigate("/albums/" + result.id);
  };

  return (
    <Container>
      <Row>
        <Col md={9} className="mb-2">
          <h1 className="text-center text-md-start m-0">My albums</h1>
        </Col>
        <Col className="d-flex justify-content-center justify-content-md-end align-items-end mb-2">
          <Button onClick={handleCreate} disabled={createAlbumMutation.loading}>
            New album
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <ul className="list-group">
            {albums?.length > 0 &&
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                >
                  {album.title}
                  <span className="badge bg-primary rounded-pill">
                    {album.images?.length}
                  </span>
                </Link>
              ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
