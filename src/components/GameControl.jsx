import "./CubesPlate";
import CubesPlate from "./CubesPlate";
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect, useRef, useContext, createContext } from "react";
import Button from "@mui/material/Button";
import "../styles/GameControl.css";
import "./ScoreBoard";
import ScoreBoard from "./ScoreBoard";
// import { appDataDir } from '@tauri-apps/api/path';

const AppStateContext = createContext({});

export default function GameControl() {
    const [gameState, setGameState] = useState("continue");
    const [curScore, setCurScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [text, setText] = useState("");
    const [matrix, setMatrix] = useState([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]);
    const reference = useRef();
    reference.current = matrix;

    const keyController = useRef(new AbortController());

    useEffect(() => {
        getInitState();
        getRecords();

        // document.addEventListener("keydown", (ev) => {
        //     // setText(JSON.stringify(ev.key));
        //     if (ev.key === "ArrowUp") {
        //         handleArrowUp();
        //     } else if (ev.key === "ArrowRight") {
        //         handleArrowRight();
        //     } else if (ev.key === "ArrowLeft") {
        //         handleArrowLeft();
        //     } else if (ev.key === "ArrowDown") {
        //         handleArrowDown();
        //     }
        // }, { signal: keyController.current.signal });
    }, []);

    useEffect(() => {
        console.log("shift!!");

        async function checkGameState() {
            let res = await invoke("check_game_state", {matrix: matrix});

            setGameState(res);
        }

        checkGameState()
    }, [matrix]);

    useEffect(() => {
        if (gameState === "win") {
            // document.removeEventListener("keydown", () => {}, true)
            keyController.current.abort()
        } else if (gameState === "lose") {
            console.log("lose!!!!")
            // document.removeEventListener("keydown", () => {}, true)
            keyController.current.abort()
        }

    }, [gameState])

    useEffect(() => {
        if (curScore > maxScore) {
            setMaxScore(curScore);
        }
    }, [curScore]);

    useEffect(() => {
        // invoke("write_record", { maxScore: maxScore })
        // console.log(maxScore)
        async function testing() {
            let a = await invoke("write_record", { maxScore: maxScore });
            setText(a);
            console.log(a);
        }

        testing()
    }, [maxScore]);

    async function getInitState() {
        let a = await invoke("initiate_matrix");
        setMatrix(a);
        setCurScore(0);
        keyController.current.abort()
        keyController.current = new AbortController()
        document.addEventListener("keydown", (ev) => {
            // setText(JSON.stringify(ev.key));
            if (ev.key === "ArrowUp") {
                handleArrowUp();
            } else if (ev.key === "ArrowRight") {
                handleArrowRight();
            } else if (ev.key === "ArrowLeft") {
                handleArrowLeft();
            } else if (ev.key === "ArrowDown") {
                handleArrowDown();
            }
        }, { signal: keyController.current.signal });
    }

    async function handleArrowRight() {
        let [res, gainedScore] = await invoke("shift_right", {
            matrix: reference.current,
        });
        setMatrix(res);
        setCurScore((old) => old + gainedScore);
    }

    async function handleArrowUp() {
        let [res, gainedScore] = await invoke("shift_up", {
            matrix: reference.current,
        });
        setMatrix(res);
        setCurScore((old) => old + gainedScore);
    }

    async function handleArrowDown() {
        let [res, gainedScore] = await invoke("shift_down", {
            matrix: reference.current,
        });
        setMatrix(res);
        setCurScore((old) => old + gainedScore);
    }

    async function handleArrowLeft() {
        let [res, gainedScore] = await invoke("shift_left", {
            matrix: reference.current,
        });
        setMatrix(res);
        setCurScore((old) => old + gainedScore);
    }

    function handleClick(e) {
        getInitState();
    }

    async function getRecords() {
        let a = await invoke("read_record");
        a = JSON.parse(a);
        setMaxScore(a.max_score);
    }

    return (
        <div className="game-main">
            <AppStateContext.Provider value={{ setCurScore }}>
                <CubesPlate matrix={matrix} />

                <div className="right-display">
                    <ScoreBoard curScore={curScore} maxScore={maxScore} />
                    <div className="buttons-area">
                        <Button onClick={handleClick} variant="contained">
                            Restart
                        </Button>
                    </div>
                </div>
            </AppStateContext.Provider>
        </div>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);

    if (context === undefined) {
        throw new Error("useAppState must be used within a AppStateProvider");
    }

    return context;
}
