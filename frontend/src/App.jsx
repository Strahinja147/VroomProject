import { useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState([])

  const testirajPovezivanje = () => {
    // PAŽNJA: Proveri port u Swaggeru (npr. http://localhost:5xxx) i zameni ovde!
    axios.get('https://localhost:7279/WeatherForecast') 
      .then(res => {
        console.log(res.data)
        setData(res.data)
        alert("Uspešno povučeni podaci sa Backenda!")
      })
      .catch(err => {
        console.error(err)
        alert("Greška! Proveri konzolu (F12).")
      })
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Vroom Projekat - Test Faza</h1>
      <button onClick={testirajPovezivanje} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Povuci podatke sa Backenda
      </button>
      
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.date}: {item.summary} ({item.temperatureC}°C)</li>
        ))}
      </ul>
    </div>
  )
}

export default App