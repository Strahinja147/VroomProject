// START OF FILE AllReservations.js
import { useState, useEffect } from "react";
import { Card, CardHeader, Table, Container, Row, Button, Badge } from "reactstrap";
import Header from "components/Headers/Header.js";
import api from "../../api";

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchAllReservations = async () => {
    try {
      const response = await api.get("/Reservations/all");
      setReservations(response.data);
    } catch (error) {
      console.error("Greška:", error);
      alert("Nemate administratorska prava za ovu stranicu!");
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      // Šaljemo novi status kao JSON string
      await api.put(`/Reservations/change-status/${id}`, `"${newStatus}"`, {
        headers: { "Content-Type": "application/json" }
      });
      alert(`Status promenjen u: ${newStatus}`);
      fetchAllReservations(); // Osveži tabelu
    } catch (error) {
      alert("Greška pri promeni statusa.");
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("sr-RS");

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Upravljanje svim rezervacijama (Admin Panel)</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID Korisnika</th>
                    <th scope="col">ID Vozila</th>
                    <th scope="col">Od - Do</th>
                    <th scope="col">Iznos</th>
                    <th scope="col">Status</th>
                    <th scope="col">Administracija</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id}>
                      <td className="text-sm">{res.userId}</td>
                      <td className="text-sm">{res.vehicleId}</td>
                      <td>{formatDate(res.startDate)} - {formatDate(res.endDate)}</td>
                      <td>{res.totalPrice} €</td>
                      <td>
                        {res.status === "Potvrđena" ? <Badge color="success">Potvrđena</Badge> : 
                         res.status === "Otkazana" ? <Badge color="danger">Otkazana</Badge> : 
                         <Badge color="info">{res.status}</Badge>}
                      </td>
                      <td>
                        {res.status === "Potvrđena" && (
                          <Button color="info" size="sm" onClick={() => changeStatus(res.id, "Završena")}>
                            Označi kao Završeno
                          </Button>
                        )}
                        {res.status === "Potvrđena" && (
                          <Button color="danger" size="sm" onClick={() => changeStatus(res.id, "Otkazana")}>
                            Otkaži
                          </Button>
                        )}
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

export default AllReservations;