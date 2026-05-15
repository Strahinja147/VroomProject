import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";

const Profile = () => {
  const { user, login } = useContext(AuthContext);

  // ----- STATE ZA OSNOVNE PODATKE -----
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || ""
  });

  // ----- STATE ZA LOZINKU -----
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || ""
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // ----- SLANJE OSNOVNIH PODATAKA -----
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-profile', formData);
      login({ ...user, firstName: formData.firstName, lastName: formData.lastName });
      setIsEditing(false);
      alert("Profil je uspešno ažuriran!");
    } catch (error) {
      alert("Greška pri ažuriranju profila.");
    }
  };

  // ----- SLANJE NOVE LOZINKE -----
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Nove lozinke se ne poklapaju!");
      return;
    }

    try {
      const response = await api.put('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      alert(response.data.message);

      // Očisti formu nakon uspešne promene
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Greška pri promeni lozinke.");
    }
  };

  return (
    <>
      <UserHeader isEditing={isEditing} toggleEdit={() => setIsEditing(!isEditing)} />

      <Container className="mt--7" fluid>
        <Row>
          {/* LEVA KARTICA */}
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <div style={{
                      width: "180px", height: "180px", borderRadius: "50%",
                      backgroundColor: "#e9ecef", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "60px", color: "#5e72e4", border: "3px solid #fff"
                    }}>
                      {user?.firstName[0]}{user?.lastName[0]}
                    </div>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
              <CardBody className="pt-0 pt-md-4 mt-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-2">
                      <div><span className="heading">0</span><span className="description">Rezervacija</span></div>
                      <div><span className="heading">0</span><span className="description">Otkazivanja</span></div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    {user?.firstName} {user?.lastName}
                    <span className="font-weight-light"> ({user?.role})</span>
                  </h3>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Vroom Platforma za iznajmljivanje vozila
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* DESNA KARTICA */}
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <h3 className="mb-0">Moj Nalog</h3>
              </CardHeader>
              <CardBody>

                {/* FORMA 1: OSNOVNI PODACI */}
                <Form onSubmit={handleSaveChanges}>
                  <h6 className="heading-small text-muted mb-4">Korisničke informacije</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Ime</label>
                          <Input className="form-control-alternative" name="firstName" value={formData.firstName} onChange={handleChange} type="text" disabled={!isEditing} required />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Prezime</label>
                          <Input className="form-control-alternative" name="lastName" value={formData.lastName} onChange={handleChange} type="text" disabled={!isEditing} required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Email adresa</label>
                          <Input className="form-control-alternative" defaultValue={user?.email} type="email" disabled />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Uloga u sistemu</label>
                          <Input className="form-control-alternative" defaultValue={user?.role} type="text" disabled />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {isEditing && (
                    <div className="text-right">
                      <Button color="success" type="submit">Sačuvaj izmene</Button>
                    </div>
                  )}
                </Form>

                <hr className="my-4" />

                {/* FORMA 2: PROMENA LOZINKE */}
                <Form onSubmit={handlePasswordSubmit}>
                  <h6 className="heading-small text-muted mb-4">Promena lozinke</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label className="form-control-label">Stara lozinka</label>
                          <Input className="form-control-alternative" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} type="password" required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Nova lozinka</label>
                          <Input className="form-control-alternative" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} type="password" required />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">Potvrdi novu lozinku</label>
                          <Input className="form-control-alternative" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} type="password" required />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <div className="text-right mt-3">
                    <Button color="primary" type="submit">Promeni lozinku</Button>
                  </div>
                </Form>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;