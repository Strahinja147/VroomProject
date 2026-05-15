import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
  Button, Card, CardHeader, CardBody, FormGroup, Form, Input, InputGroupAddon,
  InputGroupText, InputGroup, Row, Col
} from "reactstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Lozinke se ne poklapaju!");
      return;
    }

    try {
      // Šaljemo podatke na C#
      await api.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      alert("Registracija uspešna! Sada se možete ulogovati.");
      navigate("/auth/login");
    } catch (error) {
      alert(error.response?.data?.message || "Greška pri registraciji.");
    }
  };

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">Registracija</div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              <Row>
                <Col><FormGroup><Input placeholder="Ime" name="firstName" onChange={handleChange} required /></FormGroup></Col>
                <Col><FormGroup><Input placeholder="Prezime" name="lastName" onChange={handleChange} required /></FormGroup></Col>
              </Row>
              <FormGroup><Input placeholder="Email" name="email" type="email" onChange={handleChange} required /></FormGroup>
              <FormGroup><Input placeholder="Lozinka" name="password" type="password" onChange={handleChange} required /></FormGroup>
              <FormGroup><Input placeholder="Potvrdi lozinku" name="confirmPassword" type="password" onChange={handleChange} required /></FormGroup>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">Napravi nalog</Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;