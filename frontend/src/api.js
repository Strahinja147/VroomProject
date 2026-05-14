import axios from 'axios';

// Pravimo "našu" verziju axios-a
const api = axios.create({
    baseURL: 'https://localhost:7279/api', // PAZI: Proveri opet da li je ovo tvoj port!
});

// Presretač (Interceptor): Pre nego što zahtev ode na C#, uradi sledeće:
api.interceptors.request.use(
    (config) => {
        // Vadi "vroom_user" iz sefa (localStorage)
        const storedUser = localStorage.getItem('vroom_user');

        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Ako korisnik ima token, zalepi ga u zaglavlje kao "Bearer [token]"
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;