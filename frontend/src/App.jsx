import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react'; // Dodaj useState
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // DODATO
import api from './api'; // Uvozimo naš specijalni axios koji sam lepi token!

function App() {
  const { user, logout } = useContext(AuthContext);

 return (
    <Router>
      <nav style={{ padding: '20px', backgroundColor: '#f4f4f4', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ marginRight: '15px' }}>Početna</Link>

          {/* Link do Izveštaja se vidi samo ako je neko ulogovan */}
          {user && (
            <Link to="/dashboard" style={{ marginRight: '15px', color: 'blue' }}>Izveštaji</Link>
          )}

          {!user && (
            <>
              <Link to="/register" style={{ marginRight: '15px' }}>Registracija</Link>
              <Link to="/login" style={{ marginRight: '15px' }}>Prijava</Link>
            </>
          )}
        </div>

        {user && (
          <div>
            <span style={{ marginRight: '15px', fontWeight: 'bold' }}>Ćao, {user.firstName}</span>
            <button onClick={logout} style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Odjavi se</button>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* DODATO */}
        <Route path="/" element={<h1 style={{ textAlign: 'center' }}>Dobrodošli na Vroom Platformu</h1>} />
      </Routes>
    </Router>
  );
}

export default App;