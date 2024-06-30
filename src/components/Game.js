import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendurl } from "../urls";
import Cross from "../assets/cross.png";
import Circle from "../assets/circle.png";

const Game = () => {

    const navigate = useNavigate();
    
    const { id } = useParams();

    const [game, setGame] = useState(null);
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [turn, setTurn] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [winner, setWinner] = useState("");
    const [draw, setDraw] = useState(false);

    const fetchGame = async () => {
        try {
            const res = await axios.get(`${backendurl}/game/get/${id}`);
            console.log(res.status)
            if (res.status === 400) {
                navigate("/");
            }
            if (res.data.playerO) {
                setGame(res.data);
                setPlayer1(res.data.playerX.name);
                setPlayer2(res.data.playerO.name);
                setTurn(res.data.turn.playerid);
                if (res.data.winner) {
                    setDisabled(true);
                    setWinner(res.data.winner === res.data.playerX.uid ? res.data.playerX.name : res.data.playerO.name);
                }
                if (res.data.draw) {
                    setDraw(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchGame();
        const interval = setInterval(fetchGame, 1000);
        return () => clearInterval(interval);
    }, [id])



    const move = async (idx) => {
        try {
            const res = await axios.put(`${backendurl}/game/move/${id}`, {
                index: idx,
                playerid: JSON.parse(localStorage.getItem("playerid"))
            })
            setGame(res.data.game);
        } catch (error) {
            console.log(error)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${game.playerX.name} is Inviting you to play a game`,
                    text: `Copy the id: ${id} to play the game. \n This game is designed and developed by Srijan Sinha.`,
                });
            } catch (error) {
                console.error('Error sharing the link:', error);
            }
        } else {
            console.error('Web Share API is not supported in your browser.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${backendurl}/game/delete/${id}`);
            navigate("/");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {
                game ?
                <>
                <div className="d-flex mh-100vh align-center justify-center">
                    <div className="game-box">
                        <div className="d-flex align-center justify-between">
                            <h6>{player1}</h6>
                            <h6>{player2}</h6>
                        </div>
                        {!disabled && <h2 style={{ textAlign: "center" }}>It is {turn === game.playerX.uid ? game.playerX.name : game.playerO.name}'s Turn</h2>}
                        <div className="tac-boxes">
                        {game.board.map((cell, index) => (
                            <button key={index} onClick={() => move(index)} disabled={disabled}>
                                {cell.mark === "X" && <img src={Cross} alt="Cross"/>}
                                {cell.mark === "O" && <img src={Circle} alt="Circle"/>}
                            </button>
                            ))}
                        </div>
                        {disabled && <p>{winner} is the winner!</p>}
                        {draw && <p>The game is draw!</p>}
                        {disabled && <button className="btn-primary" onClick={() => handleDelete()}>End Game</button>}
                    </div>
                </div>
                </>
                :
                <>
                <button className="btn_share" onClick={() => handleShare()}><i classname='bx bx-share'></i> Share</button>
                <div>Waiting for oponent</div>
                </>
            }
        </>
    )
}

export default Game;