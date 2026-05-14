import { useState, useContext } from 'react'; // Dodat useContext
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Uvozimo naš kontekst

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // "Vadimo" funkciju login iz našeg zajedničkog sefa
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);

      alert(response.data.message);

      // Umesto da samo pređemo na početnu, sada ČUVAMO korisnika u kontekst:
      // Ovi podaci dolaze iz onog Ok(...) iz tvog C# kontrolera!
      const userData = {
        id: response.data.userId,
        firstName: response.data.firstName,
        role: response.data.role,
        token: response.data.token // DODALI SMO TOKEN OVDE!
      };

      login(userData); // SPAŠENO!

      navigate('/');

    } catch (error) {
      alert(error.response?.data?.message || "Greška pri prijavi");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Prijava - Vroom</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Lozinka" onChange={handleChange} required />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Prijavi se
        </button>
      </form>
    </div>
  );
}

export default Login;