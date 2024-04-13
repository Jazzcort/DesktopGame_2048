import { useState } from "react";
import reactLogo from "./assets/react.svg";

import "./App.css";
import "./components/Cube";
import GameControl from "./components/GameControl";


function App() {
    return (
        <div className="container">
            <GameControl />
        </div>
    );
}

export default App;
