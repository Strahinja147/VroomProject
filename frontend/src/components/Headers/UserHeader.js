import { Button, Container, Row, Col } from "reactstrap";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// DODATO: Primamo isEditing (da li je forma otključana) i toggleEdit (funkciju za klik)
const UserHeader = ({ isEditing, toggleEdit }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "400px", // Malo smanjili visinu jer nema slike
          backgroundColor: "#172b4d", // Argonova "default" tamna boja
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <span className="mask bg-gradient-default opacity-8" />
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Zdravo {user?.firstName}</h1>
              <p className="text-white mt-0 mb-5">
                Ovo je vaša profilna stranica. Ovde možete videti vaše lične podatke i
                pratiti vašu aktivnost na Vroom platformi.
              </p>

              {/* DODATO: Dinamično dugme (Plavo "Izmeni", Crveno "Odustani") */}
              <Button
                color={isEditing ? "danger" : "info"}
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault();
                  toggleEdit(); // Pozivamo funkciju za otključavanje/zaključavanje
                }}
              >
                {isEditing ? "Odustani od izmena" : "Izmeni profil"}
              </Button>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;