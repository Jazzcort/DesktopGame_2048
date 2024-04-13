import "../styles/Cube.css";
import { useRef } from "react";
import { useAppState } from "./GameControl";

export default function Cube({ number, cubeId }) {
    // let { setCurScore } = useAppState();
    let preNum = useRef(0);

    // if (preNum.current !== number) {
    //     // console.log(preNum.current)
    //     // console.log(number)
    //     // console.log(preNum.current === number)
    //     console.log("changed!!!");
    //     let a = document.getElementById(`cube-${cubeId}`)
    //     console.log(a.className)
    //     console.log(a.classList, cubeId)
    //     a.classList.toggle("cube2")
    // }
    // console.log(number, preNum)
    // setCurScore((old) => old + 100)
    // if (number === preNum * 2) {
    //     console.log("increase!!")
    //     setCurScore((old) => old + number);
    // }

    preNum.current = number;

    return (
        <div
            id={`cube-${cubeId}`}
            className={`cube${number}`}
            onAnimationStart={(e) => console.log("onAnimationStart")}
        >
            <p style={{ fontWeight: 700 }}>{number === 0 ? "" : number}</p>
        </div>
    );
}
