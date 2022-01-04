import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { register } = useAuthContext();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (e.target.password.value !== e.target.confirmPassword.value) {
        throw new Error("Error: Passwords do not match.");
      }
      await register(e.target.email.value, e.target.password.value);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Register</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                required
                disabled={loading}
              />
            </Form.Group>

            {error && <Alert variant={"danger"}>{error}</Alert>}

            <div className="d-flex gap-3">
              <Button variant="primary" type="submit" disabled={loading}>
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
