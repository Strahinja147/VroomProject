import { useState } from 'react';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PROVERI PORT OVDE (da li je 7081 ili neki drugi iz tvog Swaggera!)
      const response = await api.post('/auth/register', formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Greška pri registraciji");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Registracija - Vroom</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="firstName" placeholder="Ime" onChange={handleChange} required />
        <input name="lastName" placeholder="Prezime" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Lozinka" onChange={handleChange} required />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Registruj se
        </button>
      </form>
    </div>
  );
}

export default Register;