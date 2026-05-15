import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from "reactstrap";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    api.get(`/Vehicles/${id}`).then(res => setVehicle(res.data));
  }, [id]);

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
      await api.put(`/Vehicles/updateVehicle/${id}`, vehicle);
      alert("Vozilo uspešno ažurirano!");
      navigate("/admin/vehicles");
    } catch (error) {
      alert("Greška pri izmeni.");
    }
  };

  if (!vehicle) return <div>Učitavanje...</div>;

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8" />
      <Container className="mt--7" fluid>
        <Card className="shadow">
          <CardHeader className="bg-white border-0"><h3>Izmena vozila</h3></CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="4"><FormGroup><label>Marka</label><Input name="brand" value={vehicle.brand} onChange={handleChange} required /></FormGroup></Col>
                <Col md="4"><FormGroup><label>Model</label><Input name="model" value={vehicle.model} onChange={handleChange} required /></FormGroup></Col>
                <Col md="4"><FormGroup><label>Godina</label><Input name="modelYear" type="number" value={vehicle.modelYear} onChange={handleChange} /></FormGroup></Col>
                
                <Col md="3"><FormGroup><label>Cena po danu</label><Input name="pricePerDay" type="number" value={vehicle.pricePerDay} onChange={handleChange} /></FormGroup></Col>
                <Col md="3"><FormGroup><label>Karoserija</label><Input name="body" value={vehicle.body} onChange={handleChange} /></FormGroup></Col>
                <Col md="3"><FormGroup><label>Tip goriva</label><Input name="fuelType" value={vehicle.fuelType} onChange={handleChange} /></FormGroup></Col>
                <Col md="3"><FormGroup><label>Dostupno komada</label><Input name="numberOfAvailableCars" type="number" value={vehicle.numberOfAvailableCars} onChange={handleChange} /></FormGroup></Col>

                <Col md="2"><FormGroup><label>Koferi</label><Input name="numberOfSuitcases" type="number" value={vehicle.numberOfSuitcases} onChange={handleChange} /></FormGroup></Col>
                <Col md="2"><FormGroup><label>Sedišta</label><Input name="numberOfSeats" type="number" value={vehicle.numberOfSeats} onChange={handleChange} /></FormGroup></Col>
                <Col md="2"><FormGroup><label>Ocena</label><Input name="rating" type="number" value={vehicle.rating} onChange={handleChange} /></FormGroup></Col>

                <Col md="3" className="d-flex align-items-center mt-4">
                  <FormGroup check>
                    <Input name="automatic" type="checkbox" checked={vehicle.automatic} onChange={handleChange} />{' '} Automatizovan menjač
                  </FormGroup>
                </Col>
                <Col md="3" className="d-flex align-items-center mt-4">
                  <FormGroup check>
                    <Input name="offroad" type="checkbox" checked={vehicle.offroad} onChange={handleChange} />{' '} Offroad sposobnosti
                  </FormGroup>
                </Col>
              </Row>
              <Button className="mt-4" color="primary" type="submit">Sačuvaj izmene</Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default EditVehicle;