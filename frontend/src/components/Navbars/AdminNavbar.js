import { useContext } from "react"; // <--- 1. IZMENA: DODAJ OVO
import { Link, useNavigate } from "react-router-dom"; // <--- 2. IZMENA: DODAJ useNavigate // <--- 3. IZMENA: DODAJ AuthContext
import { AuthContext } from "../../context/AuthContext";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

const AdminNavbar = (props) => {
  // DODATO: Vučemo usera i logout funkciju
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Funkcija za odjavu
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/auth/login");
  };
    // -----------------------------------------------





  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          {/* ... (Brand tekst ostaje isti) ... */}

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    {/* DODATO: Ispisujemo pravo ime iz baze */}
                    <span className="mb-0 text-sm font-weight-bold">
                      {user ? `${user.firstName} (${user.role})` : "Korisnik"}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Dobrodošli!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Moj profil</span>
                </DropdownItem>
                <DropdownItem divider />

                {/* DODATO: Dugme za Logout */}
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Odjavi se</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
