import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import useStreamCollection from "../hooks/useStreamCollection";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";

const HomePage = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const albumsCollection = useStreamCollection(
    `users/${currentUser.uid}/albums`
  );
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const albumDoc = await albumsCollection.add({
        title: "",
        count: 0,
        timestamp: serverTimestamp(),
      });
      navigate("/albums/" + albumDoc.id);
    } catch (error) {
      setCreating(false);
      throw error;
    }
  };

  return (
    <Container>
      <Row>
        <Col md={9} className="mb-2">
          <h1 className="text-center text-md-start m-0">My albums</h1>
        </Col>
        <Col className="d-flex justify-content-center justify-content-md-end align-items-end mb-2">
          <Button onClick={handleCreate} disabled={creating}>
            New album
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <ul className="list-group">
            {albumsCollection.data?.length > 0 &&
              albumsCollection.data.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                >
                  <div>
                    <p className="m-0">
                      <b>{album.title || "<untitled>"}</b>
                    </p>
                    {album.timestamp && (
                      <p className="m-0">
                        {new Date(
                          album.timestamp.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className="badge bg-primary rounded-pill">
                    {album.count}
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
