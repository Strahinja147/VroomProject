import { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalReservations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Čim se stranica učita, tražimo podatke od C#
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/dashboard');
        setStats(response.data);
      } catch (error) {
        alert("Greška pri učitavanju izveštaja.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center' }}>Učitavanje izveštaja...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Menadžerski Izveštaj</h2>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '30%' }}>
          <h3>Korisnici</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.totalUsers}</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '30%' }}>
          <h3>Vozila u Floti</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.totalVehicles}</p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '30%' }}>
          <h3>Aktivne Rezervacije</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{stats.totalReservations}</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;