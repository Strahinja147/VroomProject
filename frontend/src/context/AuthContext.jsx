import { createContext, useState, useEffect } from 'react';

// 1. Kreiramo kontekst (zajedničku memoriju)
export const AuthContext = createContext();

// 2. Pravimo Provider komponentu koja obavija našu celu aplikaciju
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null znači da niko nije ulogovan

  // 3. Kada se aplikacija tek učita (ili osveži), proveri da li u memoriji browsera ima snimljen korisnik
  useEffect(() => {
    const storedUser = localStorage.getItem('vroom_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Pretvori nazad u objekat i spasi u state
    }
  }, []);

  // 4. Funkcija za Login (ovo pozivamo iz Login.jsx)
  const login = (userData) => {
    setUser(userData); // Čuvamo u React state-u (za trenutno korišćenje)
    localStorage.setItem('vroom_user', JSON.stringify(userData)); // Čuvamo u browseru (za F5)
  };

  // 5. Funkcija za Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('vroom_user');
  };

  // 6. Delimo user-a, funkciju login i funkciju logout sa celom aplikacijom
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};