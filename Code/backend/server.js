const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const SCORE_MAP = ['0', '1', '2', '3', '4', '5', '6'];

function calculateGameScore(points, name1, name2) {
    let score = { player1: 0, player2: 0 };
    points.forEach(point => {
        if (point.includes('remporté par')) {
            const winner = point.split('remporté par ')[1];
            console.log("winner", winner, name1, name2);
            if (winner === name1) {
                score.player1 += 1;
            }
            if (winner === name2) {
                score.player2 += 1;
            }
        }
    });
    const { player1, player2 } = score;

    if (player1 >= 4 && player1 >= player2 + 2) return "Game Player1";
    if (player2 >= 4 && player2 >= player1 + 2) return "Game Player2";
    if (player1 >= 3 && player2 >= 3) {
        if (player1 === player2) return "40 - 40";
        return player1 > player2 ? "AV -" : "- AV";
    }
    return `${SCORE_MAP[player1] || '40'} - ${SCORE_MAP[player2] || '40'}`;
}

function calculateMatchScore(points, player1, player2) {
    let sets = [
        { player1: 0, player2: 0 },
        { player1: 0, player2: 0 },
        { player1: 0, player2: 0 }
    ];
    let currentSet = 0;
    let currentGame = [];
    let matchWinner = null;

    points.forEach(point => {
        currentGame.push(point);
        const gameScore = calculateGameScore(currentGame, player1, player2);
        if (gameScore === "Game Player1" || gameScore === "Game Player2") {
            sets[currentSet][gameScore === "Game Player1" ? 'player1' : 'player2']++;
            currentGame = [];

            if (sets[currentSet].player1 >= 6 && sets[currentSet].player1 >= sets[currentSet].player2 + 2) {
                currentSet++;
            } else if (sets[currentSet].player2 >= 6 && sets[currentSet].player2 >= sets[currentSet].player1 + 2) {
                currentSet++;
            }
        }
    });

    const player1Wins = sets.filter(set => set.player1 > set.player2).length;
    const player2Wins = sets.filter(set => set.player2 > set.player1).length;

    if (player1Wins >= 2) matchWinner = player1;
    if (player2Wins >= 2) matchWinner = player2;

    return {
        winner: matchWinner,
        scores: {
            [player1]: {
                set1: sets[0].player1,
                set2: sets[1].player1,
                set3: sets[2].player1,
                currentGame: currentGame.length > 0 ? calculateGameScore(currentGame, player1, player2) : "0 - 0"
            },
            [player2]: {
                set1: sets[0].player2,
                set2: sets[1].player2,
                set3: sets[2].player2,
                currentGame: currentGame.length > 0 ? calculateGameScore(currentGame, player1, player2) : "0 - 0"
            }
        }
    };
}

app.post('/calculate-score', (req, res) => {
    const { points, player1, player2 } = req.body;
    const { winner, scores } = calculateMatchScore(points, player1, player2);
    console.log('Winner:', winner);
    console.log('Scores:', scores);
    console.log("player1", player1);
    console.log("player2", player2);
    res.json({ winner, scores });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
