import Button from "@mui/material/Button";
import Lottie from "lottie-react"
import animationData from "../assets/celebration.json"
import "../styles/Shadow.css"
export default function Shadow({ gameState, initializeGame }) {
    if (gameState !== "continue") {
        return (
            <>
            <div className="shadow-layer">
            </div>
            { gameState === "win" && <Lottie id="win-animation" sizes="50px" animationData={animationData} />}
            { gameState === "win" ? <h1 className="win-message">You Win!!!</h1> : <h1 className="lose-message">You Lose</h1>}
            <Button onClick={initializeGame} id="restart-button" variant="contained">New game</Button>        
            </>
        );
    }
    
}
