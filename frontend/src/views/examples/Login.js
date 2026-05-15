import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Tvoj API sa tokenom
import { AuthContext } from "../../context/AuthContext"; // Tvoj kontekst

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  // 1. NAŠA LOGIKA (State, Navigate, Context)
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Šaljemo podatke na C# backend
      const response = await api.post("/auth/login", formData);

      const userData = {
        id: response.data.userId,
        firstName: response.data.firstName,
        lastName: response.data.lastName, // DODATO
        email: response.data.email,       // DODATO
        role: response.data.role,
        token: response.data.token,
      };

      // Čuvamo u kontekst i localStorage
      login(userData);

      alert("Uspešna prijava! Dobrodošli u Vroom Admin Panel.");

      // Prebacujemo korisnika na glavni dashboard u Argonu
      navigate("/admin/index");

    } catch (error) {
      alert(error.response?.data?.message || "Greška pri prijavi. Proverite podatke.");
    }
  };

  // 2. ARGONOV DIZAJN
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Prijava sa postojećim nalogom</small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            {/* OBRATI PAŽNJU: Ovde smo dodali onSubmit */}
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  {/* OBRATI PAŽNJU: Dodali smo name i onChange */}
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    autoComplete="new-email"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  {/* OBRATI PAŽNJU: Dodali smo name i onChange */}
                  <Input
                    placeholder="Lozinka"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Zapamti me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Prijavi se
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>Zaboravili ste lozinku?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>Napravite novi nalog</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;