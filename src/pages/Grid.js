export default function Grid() {

    const canvasWidth = 1500;
    const canvasHeight = 900;
    const squareSize = 15;

    const drawSquareWithBorder = (ctx, x, y, size=50, fill="white", stroke = "black") => {
        ctx.fillStyle = fill;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = stroke;
        ctx.lineWidth   = 2;
        ctx.strokeRect(x,y, size, size);
    }
    const drawButtonEvent = () => {
        const canvas = document.getElementById("gridCanvas"); //TODO: Do something about the hardcoding of the id.
        const ctx = canvas.getContext("2d");
        for (let x = 0; x<canvasWidth/squareSize; x++) {
            for (let y = 0; y<canvasHeight/squareSize; y++) {
                drawSquareWithBorder(ctx, squareSize*x, squareSize*y);
            }
        }
    }

    const drawDungeonRoom = (ctx) => {
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

        ctx.fillStyle = "blue";
        ctx.fillRect(x * squareSize, y * squareSize, squareSize*width - 1, squareSize*height - 1);
    }

    const drawDungeonEvent = () => {
        const canvas = document.getElementById("dungeonCanvas"); //TODO: Do something about the hardcoding of the id.
        const ctx = canvas.getContext("2d");
        //drawSquareWithBorder(ctx, canvasWidth/2 - squareSize/2, canvasHeight/2 - squareSize/2, squareSize, "rgba(0, 0, 0, 0.2)"); //transparency example rgba(0, 0, 0, 0.2)
        drawDungeonRoom(ctx);
    }

    const draw100DungeonRooms = () => {
        for(let z = 0;z<100;z++) {
            drawDungeonEvent();
        }
    }


    return (
        <main>
            <section>
                <button onClick={drawButtonEvent}>Draw Grid</button>
                <button onClick={draw100DungeonRooms}>Draw 100 Dungeon Rooms</button>
            </section>
            <canvas id="gridCanvas" width={canvasWidth} height={canvasHeight} style={{border: "1px solid black", margin: "10px", position: "absolute"}}></canvas>
            <canvas id="dungeonCanvas" width={canvasWidth} height={canvasHeight} style={{border: "1px solid black", margin: "10px", position: "absolute"}}></canvas>
        </main>
    )
}