import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ facts, setFacts ] = useState([]);
  const [ listening, setListening ] = useState(false);

		console.log("Outside Here");
  useEffect( () => {
		console.log(listening);
    if (!listening) {
      const events = new EventSource('http://localhost:8888/stream');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData)
        setFacts((facts) => facts.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, facts]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
      {
        facts.map((fact, i) =>
            <tr key={i}>
              <td>{fact}</td>
              {/*<td>{fact.source}</td>*/}
            </tr>

        )
      }

      </tbody>
    </table>
  );
}

export default App;
