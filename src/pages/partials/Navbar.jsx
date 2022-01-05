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

  const Dropdown = () => {
    return (
      <NavDropdown title={currentUser.email} align="end">
        <Link to="/" className="dropdown-item">
          My albums
        </Link>
        <NavDropdown.Divider />
        <div className="px-3">
          <Button className="w-100" variant="danger" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </NavDropdown>
    );
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Link to="/" className="navbar-brand">
          Photo Review
        </Link>
        <Nav className="justify-content-end">
          {currentUser && <Dropdown />}
          {!currentUser && (
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
