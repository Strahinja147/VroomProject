import axios from 'axios';

// Promeni BASE_URL na adresu tvog backend servera
// GitHub tutorijal obicno koristi http://localhost:3500
export default axios.create({
    baseURL: 'https://localhost:7026'
});