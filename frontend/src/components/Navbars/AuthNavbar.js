import { useContext } from "react"; // <--- 1. Uvezi useContext
import { Link, useNavigate } from "react-router-dom"; // <--- 2. Uvezi useNavigate
import AuthContext from "../../context/AuthProvider"; // <--- 3. Uvezi Context
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AdminNavbar = () => {
  // Izvlacimo auth podatke i funkciju za logout (setAuth)
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Funkcija za odjavljivanje
  const handleLogout = () => {
    setAuth({}); // Brisemo podatke o korisniku
    navigate("/auth/login"); // Vracamo na login
  };


  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/argon-react-white.png")}
            />
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/">
                    <img
                      alt="..."
                      src={require("../../assets/img/brand/argon-react.png")}
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link-icon" to="/" tag={Link}>
                  <i className="ni ni-planet" />
                  <span className="nav-link-inner--text">Dashboard</span>
                </NavLink>
              </NavItem>
              {/* --- AKO KORISNIK NIJE ULOGOVAN (nema accessToken) --- */}
              {!auth?.accessToken && (
                <>
                  <NavItem>
                    <NavLink
                      className="nav-link-icon"
                      to="/auth/register"
                      tag={Link}
                    >
                      <i className="ni ni-circle-08" />
                      <span className="nav-link-inner--text">Register</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="nav-link-icon" to="/auth/login" tag={Link}>
                      <i className="ni ni-key-25" />
                      <span className="nav-link-inner--text">Login</span>
                    </NavLink>
                  </NavItem>
                </>
              )}

              {/* --- AKO JE KORISNIK ULOGOVAN (ima accessToken) --- */}
              {auth?.accessToken && (
                <>
                  <NavItem>
                    <NavLink
                      className="nav-link-icon"
                      to="/admin/user-profile"
                      tag={Link}
                    >
                      <i className="ni ni-single-02" />
                      <span className="nav-link-inner--text">Profile</span>
                    </NavLink>
                  </NavItem>

                  {/* Dodao sam i Logout dugme jer je logicno da postoji ako je Login sklonjen */}
                  <NavItem>
                    <NavLink
                        className="nav-link-icon"
                        onClick={handleLogout}
                        style={{cursor: "pointer"}}
                    >
                      <i className="ni ni-user-run" />
                      <span className="nav-link-inner--text">Logout</span>
                    </NavLink>
                  </NavItem>
                </>
              )}

            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
