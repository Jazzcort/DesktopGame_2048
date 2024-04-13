import "../styles/ScoreBoard.css";
export default function ScoreBoard({ curScore, maxScore }) {
    return (
        <div className="score-board">
            <div className="cur-score">
                <p>Current Score: {curScore}</p>
            </div>
            <div className="max-score">
                <p>Max Score: {maxScore}</p>
            </div>
        </div>
    );
}
