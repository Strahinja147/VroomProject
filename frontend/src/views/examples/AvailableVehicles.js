// START OF FILE AvailableVehicles.js
import { useState, useEffect } from "react";
import { Card, CardHeader, Table, Container, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input } from "reactstrap";
import Header from "components/Headers/Header.js";
import api from "../../api";

const AvailableVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // State za datume
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/Vehicles/getAllVehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Greška:", error);
    }
  };

  // Otvaranje iskačućeg prozora za rezervaciju
  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDates({ startDate: "", endDate: "" });
    setModalOpen(true);
  };

  // Slanje rezervacije na Backend
  const handleReserve = async () => {
    if (!dates.startDate || !dates.endDate) {
      alert("Molimo izaberite oba datuma!");
      return;
    }

    try {
      const response = await api.post("/Reservations/create", {
        vehicleId: selectedVehicle.id,
        startDate: dates.startDate,
        endDate: dates.endDate
      });

      alert(response.data.message + " Ukupna cena: " + response.data.reservation.totalPrice + " €");
      setModalOpen(false);
      fetchVehicles(); // Osveži stanje
    } catch (error) {
      alert(error.response?.data?.message || "Greška pri rezervaciji.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Ponuda vozila za iznajmljivanje</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Marka i Model</th>
                    <th scope="col">Tip i Gorivo</th>
                    <th scope="col">Cena po danu</th>
                    <th scope="col">Dostupnost</th>
                    <th scope="col">Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <th scope="row"><span className="mb-0 text-sm font-weight-bold">{v.brand} {v.model}</span></th>
                      <td>{v.body} / {v.fuelType}</td>
                      <td>{v.pricePerDay} €</td>
                      <td>
                        {v.numberOfAvailableCars > 0 ? (
                          <span className="text-success">Dostupno ({v.numberOfAvailableCars})</span>
                        ) : (
                          <span className="text-danger">Nedostupno</span>
                        )}
                      </td>
                      <td>
                        <Button 
                          color="primary" 
                          size="sm" 
                          disabled={v.numberOfAvailableCars === 0}
                          onClick={() => openModal(v)}
                        >
                          Rezerviši
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      {/* ISKAČUĆI PROZOR ZA DATUME */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Rezervacija: {selectedVehicle?.brand} {selectedVehicle?.model}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Datum preuzimanja:</label>
            <Input 
              type="date" 
              value={dates.startDate} 
              onChange={(e) => setDates({ ...dates, startDate: e.target.value })} 
            />
          </FormGroup>
          <FormGroup>
            <label>Datum vraćanja:</label>
            <Input 
              type="date" 
              value={dates.endDate} 
              onChange={(e) => setDates({ ...dates, endDate: e.target.value })} 
            />
          </FormGroup>
          <p className="text-muted text-sm">Cena po danu: {selectedVehicle?.pricePerDay} €</p>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleReserve}>Potvrdi rezervaciju</Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>Odustani</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AvailableVehicles;