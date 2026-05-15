import { useState } from "react";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from "reactstrap";
import api from "../../api"; 
import { useNavigate } from "react-router-dom";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    brand: "", model: "", modelYear: 2024, pricePerDay: 0,
    body: "", fuelType: "", automatic: false,
    numberOfSuitcases: 0, offroad: false, numberOfSeats: 5,
    rating: 0, numberOfAvailableCars: 1
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicle({
      ...vehicle,
      [name]: type === "checkbox" ? checked : (type === "number" ? parseInt(value) : value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Vehicles/addVehicle", vehicle);
      alert("Vozilo uspešno dodato!");
      navigate("/admin/vehicles");
    } catch (error) {
      console.error("DEBUG ERROR:", error.response?.data);
      alert("Greška: " + JSON.stringify(error.response?.data));
    }
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" />
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader className="bg-white border-0">
            <h3>Dodavanje novog vozila u flotu</h3>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="4"><FormGroup><label>Marka</label><Input name="brand" onChange={handleChange} required /></FormGroup></Col>
                <Col md="4"><FormGroup><label>Model</label><Input name="model" onChange={handleChange} required /></FormGroup></Col>
                <Col md="4"><FormGroup><label>Godina</label><Input name="modelYear" type="number" onChange={handleChange} /></FormGroup></Col>
                
                <Col md="3"><FormGroup><label>Cena po danu</label><Input name="pricePerDay" type="number" onChange={handleChange} /></FormGroup></Col>
                <Col md="3"><FormGroup><label>Karoserija</label><Input name="body" onChange={handleChange} /></FormGroup></Col>
                <Col md="3"><FormGroup><label>Tip goriva</label><Input name="fuelType" onChange={handleChange} /></FormGroup></Col>
                <Col md="3"><FormGroup><label>Dostupno komada</label><Input name="numberOfAvailableCars" type="number" onChange={handleChange} /></FormGroup></Col>

                <Col md="2"><FormGroup><label>Koferi</label><Input name="numberOfSuitcases" type="number" onChange={handleChange} /></FormGroup></Col>
                <Col md="2"><FormGroup><label>Sedišta</label><Input name="numberOfSeats" type="number" onChange={handleChange} /></FormGroup></Col>
                <Col md="2"><FormGroup><label>Ocena</label><Input name="rating" type="number" onChange={handleChange} /></FormGroup></Col>

                <Col md="3" className="d-flex align-items-center mt-4">
                  <FormGroup check>
                    <Input name="automatic" type="checkbox" onChange={handleChange} />{' '} Automatizovan menjač
                  </FormGroup>
                </Col>
                <Col md="3" className="d-flex align-items-center mt-4">
                  <FormGroup check>
                    <Input name="offroad" type="checkbox" onChange={handleChange} />{' '} Offroad sposobnosti
                  </FormGroup>
                </Col>
              </Row>

              <Button className="mt-4" color="primary" type="submit">Sačuvaj vozilo</Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default AddVehicle;