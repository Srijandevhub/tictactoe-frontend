import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendurl } from "../urls";
import { toast } from "react-toastify";

const Home = () => {

    const navigate = useNavigate();

    const [tabs, setTabs] = useState(false);

    const [playerName, setPlayerName] = useState('');
    const [gameId, setGameId] = useState('');

    useEffect(() => {
        const fetchGuid = async () => {
            try {
                const res = await axios.get(`${backendurl}/getuid`);
                if (localStorage.getItem("playerid")) {
                    localStorage.removeItem("playerid");
                    localStorage.setItem("playerid", JSON.stringify(res.data));
                }
                localStorage.setItem("playerid", JSON.stringify(res.data));
            } catch (error) {
                console.log(error)
            }
        }
        fetchGuid();
    }, [])

    const createGame = async () => {
        try {
            let valid = true;

            if (playerName.length === 0) {
                valid = false;
                toast.warning("Please enter your name!");
            }


            if (valid) {
                const res = await axios.post(`${backendurl}/game/create`, {
                    playerX_id: JSON.parse(localStorage.getItem("playerid")),
                    playerX_name: playerName
                });
                if (res.status === 200) {
                    toast.success("New game Created Successfully", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        onClose: () => navigate(`/game/${res.data._id}`)
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const joinGame = async () => {
        try {
            let valid = true;

            if (playerName.length === 0) {
                valid = false;
                toast.warning("Please enter your name!");
            }
            if (gameId.length === 0) {
                valid = false;
                toast.warning("Please enter game id!");
            }

            if (valid) {

                const res = await axios.put(`${backendurl}/game/join/${gameId}`, {
                    playerO_id: JSON.parse(localStorage.getItem("playerid")),
                    playerO_name: playerName
                });
                if (res.status === 200) {
                    toast.success("Joing Game", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                        onClose: () => navigate(`/game/${res.data._id}`)
                    })
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleTabs1 = () => {
        setTabs(false);
    }
    const handleTabs2 = () => {
        setTabs(true);
    }

    return (
        <div className="d-flex mh-100vh align-center justify-center">
            <div className="box">
                <div className="home-tabs">
                    <button className={`home-tab_btn ${tabs ? "": "active"}`} onClick={() => handleTabs1()}>Create A Game</button>
                    <button className={`home-tab_btn ${tabs ? "active": ""}`} onClick={() => handleTabs2()}>Join A Game</button>
                </div>
                <div className="frm-group">
                    <input type="text" onChange={(e) => setPlayerName(e.target.value)} placeholder="Player Name"/>
                </div>
                <div className={`tab-box ${tabs ? "": "show"}`}>
                    <button className="btn-primary" onClick={() => createGame()}><i className='bx bx-game'></i> Create Game</button>
                </div>
                <div className={`tab-box ${tabs ? "show": ""}`}>
                    <div className="frm-group">
                        <input type="text" onChange={(e) => setGameId(e.target.value)} placeholder="Game ID"/>
                    </div>
                    <button className="btn-primary" onClick={() => joinGame()}><i className='bx bx-joystick'></i> Join Game</button>
                </div>
            </div>
        </div>
    )
}

export default Home;