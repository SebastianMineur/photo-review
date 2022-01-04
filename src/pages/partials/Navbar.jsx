import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const NavbarWrapper = () => {
  const { currentUser, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Photo Review</Navbar.Brand>
        <Nav className="justify-content-end">
          {currentUser ? (
            <NavDropdown title={currentUser.email}>
              <NavDropdown.Item href="/">My albums</NavDropdown.Item>
              <NavDropdown.Divider />
              <div className="px-3">
                <Button
                  className="w-100"
                  variant="danger"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </NavDropdown>
          ) : (
            <Link to="/" className="nav-link">
              Login
            </Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarWrapper;
