import React, { useState } from 'react';
import axios from 'axios';

function TennisApp() {
  const [player1, setPlayer1] = useState({ name: '', level: 5 });
  const [player2, setPlayer2] = useState({ name: '', level: 5 });
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState(null);

  const generatePoints = () => {
    const newPoints = [];
    for (let i = 0; i < 150; i++) {
      const random = Math.random();
      const winner = random < (player1.level / (player1.level + player2.level)) ? player1.name : player2.name;
      newPoints.push(`Point ${i + 1} : remporté par ${winner}`);
    }
    setPoints(newPoints);
  };

  const sendPointsToBackend = async () => {
    const response = await axios.post('http://localhost:5000/calculate-score', { points, player1: player1.name, player2: player2.name });
    setResult(response.data);
  };

  return (
    <div>
      <h1>Simulateur de Match de Tennis</h1>
      <div>
        <input
          type="text"
          placeholder="Nom Joueur 1"
          value={player1.name}
          onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Niveau Joueur 1"
          value={player1.level}
          onChange={(e) => setPlayer1({ ...player1, level: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Nom Joueur 2"
          value={player2.name}
          onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Niveau Joueur 2"
          value={player2.level}
          onChange={(e) => setPlayer2({ ...player2, level: parseInt(e.target.value) })}
        />
      </div>
      <button onClick={generatePoints}>Générer les points</button>
      <div>
        {points.map((point, index) => (
          <div key={index}>{point}</div>
        ))}
      </div>
      <button onClick={sendPointsToBackend}>Calculer le score</button>
      {result && (
        <div>
          <h2>Résultat : {result.winner ? `Vainqueur : ${result.winner}` : 'Jeu en cours, pas de vainqueur'}</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Set 1</th>
                <th>Set 2</th>
                <th>Set 3</th>
                <th>Current Game</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{player1.name}</td>
                <td>{result.scores[player1.name].set1}</td>
                <td>{result.scores[player1.name].set2}</td>
                <td>{result.scores[player1.name].set3}</td>
                <td>{result.scores[player1.name].currentGame}</td>
              </tr>
              <tr>
                <td>{player2.name}</td>
                <td>{result.scores[player2.name].set1}</td>
                <td>{result.scores[player2.name].set2}</td>
                <td>{result.scores[player2.name].set3}</td>
                <td>{result.scores[player2.name].currentGame}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TennisApp;
