import React, { useEffect, useState } from "react";
export default function GridSVG() {

    const [data, setData] = useState([]);
    const [canvasWidth, setCanvasWidth] = useState(1000);
    const [canvasHeight, setCanvasHeight] = useState(500);
    const [inputWidth, setInputWidth] = useState(1000);
    const [inputHeight, setInputHeight] = useState(500);

    const squareSize = 25;
    const minWH = 100;

    const handleWidthChange = (event) => {
        setInputWidth(event.target.value);
    }
    const handleHeightChange = (event) => {
        const value = event.target.value;
        setInputHeight(value)
    }

    const drawSquareWithBorder = (x, y, width, height, fill="white", stroke = "black") => {
        const room = {
            fill,
            stroke,
            strokeWidth: 2,
            x,
            y,
            width,
            height
        };
        return room;
    }

    const gridSquares = () => {
        const squares = [];
        for (let x = 0; x<canvasWidth/squareSize; x++) {
            for (let y = 0; y<canvasHeight/squareSize; y++) {
                const square = drawSquareWithBorder(squareSize*x, squareSize*y, squareSize, squareSize);
                squares.push(square);
            }
        }
        return squares;
    }

    const resizeGrid = () => {
        setCanvasWidth(inputWidth); //TODO: Should not be able to change grid size here to inappropriate value
        setCanvasHeight(inputHeight);
    }

    const drawDungeonRoom = () => {
        const maxRoomWidth = 5;
        const minRoomWidth = 2;
        const maxRoomHeight = 5;
        const minRoomHeight = 2;

        //choose random size of dungeon room
        const width = Math.floor(Math.random() * (maxRoomWidth - minRoomWidth + 1) + minRoomWidth);
        const height = Math.floor(Math.random() * (maxRoomHeight - minRoomHeight + 1) + minRoomHeight);
        console.log(`Draw Room width: ${width} height: ${height}`)
        
        //determine random location
        const x = Math.floor(Math.random() * (canvasWidth/squareSize - width + 1));
        const y = Math.floor(Math.random() * (canvasHeight/squareSize - height + 1));
        console.log(`Place room at x: ${x * squareSize}, y: ${y * squareSize}`)
        
        const room = drawSquareWithBorder(x * squareSize, y * squareSize, squareSize*width - 1, squareSize*height - 1, "blue");
        const newRooms = data.concat([room]);
        setData(newRooms);
    }

    const grid = gridSquares().map((room, index) => <rect key={index} fill={room.fill} stroke={room.stroke} strokeWidth={room.strokeWidth} x={room.x} y={room.y} width={room.width} height={room.height} />);
    const rooms = data.map((room, index) => <rect key={index} fill={room.fill} stroke={room.stroke} strokeWidth={room.strokeWidth} x={room.x} y={room.y} width={room.width} height={room.height} />);

    return (
        <main>
            <section>
                <button onClick={drawDungeonRoom}>Add Room</button>
                <button onClick={resizeGrid}>Resize Grid</button>
                Width: <input type="number" value={inputWidth} onChange={handleWidthChange} max={2000} min={minWH} step={100} />
                Height: <input type="number" value={inputHeight} onChange={handleHeightChange} max={2000} min={minWH} step={100}/>
            </section>
            <svg id="svgCanvas" width={canvasWidth} height={canvasHeight} style={{border: "1px solid black", margin: "10px"}}>
                {grid}
                {rooms}
            </svg>
        </main>
    )
}