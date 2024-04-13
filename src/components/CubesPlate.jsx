
import "./Cube";
import Cube from "./Cube";

import "../styles/CubesPlate.css";

export default function CubesPlate( {matrix}) {
    

    return (
        <div className="cubes-palate">
            {matrix.map((row, rInd) => (
                <div className="cube-row" key={rInd}>
                    {row.map((num, cInd) => (
                        <Cube key={cInd} number={num} cubeId={(4 * rInd) + cInd} />
                    ))}
                </div>
            ))}
            
        </div>
    );
}
