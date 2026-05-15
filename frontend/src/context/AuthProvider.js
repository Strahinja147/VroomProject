import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // 1. Inicijalizacija: Pokusaj da ucitas podatke iz LocalStorage-a
    // Ako postoje, koristi ih. Ako ne, koristi prazan objekat {}.
    const [auth, setAuth] = useState(() => {
        try {
            const savedAuth = localStorage.getItem("auth");
            return savedAuth ? JSON.parse(savedAuth) : {};
        } catch (error) {
            return {};
        }
    });

    // 2. Pracenje promena: Svaki put kad se 'auth' promeni, sacuvaj ga u LocalStorage
    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;