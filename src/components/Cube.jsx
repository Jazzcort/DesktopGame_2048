import "../styles/Cube.css";

export default function Cube({ number, cubeId }) {
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
