import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useState, useEffect } from "react";
import api from "../../api"; // Naš API za komunikaciju sa C#

const Header = () => {
  // State za čuvanje podataka iz baze
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalReservations: 0
  });

  // Povlačenje podataka sa C# backenda kada se stranica učita
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Greška pri povlačenju izveštaja", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* KARTICE SA STATISTIKOM */}
            <Row>
              {/* KARTICA 1: KORISNICI */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Korisnici sistema
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.totalUsers}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> Aktivni
                      </span>
                      <span className="text-nowrap">Ukupan broj klijenata i admina</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* KARTICA 2: VOZILA */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Vozni park
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.totalVehicles}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-car" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-warning mr-2">
                        <i className="fas fa-key" /> Dostupna
                      </span>
                      <span className="text-nowrap">Ukupan broj vozila u ponudi</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* KARTICA 3: REZERVACIJE */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Ukupno Rezervacija
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.totalReservations}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-calendar-check" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-info mr-2">
                        <i className="fas fa-history" /> Istorija
                      </span>
                      <span className="text-nowrap">Sve realizovane rezervacije</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* KARTICA 4: ZAUZETOST (Za sada placeholder, implementiraćemo kasnije) */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Zauzetost Flote
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">0%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-sync" /> Real-time
                      </span>
                      <span className="text-nowrap">Trenutno izdato vozila</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;