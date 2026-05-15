import { useState, useEffect } from "react";
import { Card, CardHeader, Table, Container, Row, Button } from "reactstrap";
import Header from "components/Headers/Header.js";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/Vehicles/getAllVehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Greška pri preuzimanju vozila:", error);
    }
  };

  const deleteVehicle = async (id) => {
  if (window.confirm("Da li ste sigurni da želite da obrišete ovo vozilo?")) {
    try {
      // Pazi na tačnu putanju prema tvom backendu
      await api.delete(`/Vehicles/deleteVehicle/${id}`); 
      fetchVehicles(); // Osveži listu
    } 
    catch (error) {
      console.error(error);
      alert("Greška pri brisanju.");
    }
    }
  };
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between">
                <h3 className="mb-0">Lista svih vozila u floti</h3>
                <Button color="primary" onClick={() => navigate("/admin/add-vehicle")}>
                  Dodaj novo vozilo
                </Button>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Marka i Model</th>
                    <th scope="col">Godište</th>
                    <th scope="col">Tip</th>
                    <th scope="col">Cena po danu</th>
                    <th scope="col">Status</th>
                    <th scope="col">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <th scope="row">
                        <span className="mb-0 text-sm">{v.brand} {v.model}</span>
                      </th>
                      <td>{v.modelYear}</td>
                      <td>{v.body}</td>
                      <td>{v.pricePerDay} €</td>
                      <td>
                        {v.numberOfAvailableCars > 0 ? (
                          <span className="text-success">● Dostupno ({v.numberOfAvailableCars})</span>
                        ) : (
                          <span className="text-danger">● Nema na stanju</span>
                        )}
                      </td>
                      <td>
                        <Button color="info" size="sm" onClick={() => navigate(`/admin/edit-vehicle/${v.id}`)}> Izmeni </Button>
                        <Button color="danger" size="sm" onClick={() => deleteVehicle(v.id)}> Obriši </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Vehicles;