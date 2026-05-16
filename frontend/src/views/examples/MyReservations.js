// START OF FILE MyReservations.js
import { useState, useEffect } from "react";
import { Card, CardHeader, Table, Container, Row, Button, Badge } from "reactstrap";
import Header from "components/Headers/Header.js";
import api from "../../api";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      // Gađamo tvoju C# metodu koja vraća samo rezervacije ulogovanog korisnika
      const response = await api.get("/Reservations/my-reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Greška pri preuzimanju ličnih rezervacija:", error);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da otkažete ovu rezervaciju?")) {
      try {
        await api.put(`/Reservations/cancel/${id}`);
        alert("Rezervacija uspešno otkazana.");
        fetchMyReservations(); // Osveži listu
      } catch (error) {
        alert(error.response?.data?.message || "Greška pri otkazivanju.");
      }
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
                <h3 className="mb-0">Moje Rezervacije</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Vozilo (ID)</th>
                    <th scope="col">Datum preuzimanja</th>
                    <th scope="col">Datum vraćanja</th>
                    <th scope="col">Ukupna cena</th>
                    <th scope="col">Status</th>
                    <th scope="col">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">Još uvek niste rezervisali nijedno vozilo.</td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id}>
                        <td><span className="text-sm font-weight-bold">{res.vehicleId}</span></td>
                        <td>{formatDate(res.startDate)}</td>
                        <td>{formatDate(res.endDate)}</td>
                        <td>{res.totalPrice} €</td>
                        <td>
                          <Badge color={res.status === "Potvrđena" ? "success" : "danger"}>
                            {res.status}
                          </Badge>
                        </td>
                        <td>
                          {res.status === "Potvrđena" && (
                            <Button color="danger" size="sm" onClick={() => handleCancel(res.id)}>
                              Otkaži
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default MyReservations;