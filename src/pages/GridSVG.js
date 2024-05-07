/* 
    https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/ 
    Donjon doesn't put rooms adjacent so there is always space to cutout a door.

    https://dev.to/alvarosabu/the-magic-of-svg-clip-path-1lf0 -> Learned how to clipPath
*/

import React, { useEffect, useState } from "react";
import hashCode from "./util/HashCode";
export default function GridSVG() {

    useEffect(() => {
        console.log("effect", data);
    });

    const [data, setData] = useState([]);
    const [canvasWidth, setCanvasWidth] = useState(1000);
    const [canvasHeight, setCanvasHeight] = useState(500);
    const [inputWidth, setInputWidth] = useState(1000);
    const [inputHeight, setInputHeight] = useState(500);

    const squareSize = 25;
    const minWH = 100;
    const preventCollisions = true;
    const maxRoomPlacementTries = 10;

    const handleWidthChange = (event) => {
        setInputWidth(event.target.value);
    }
    const handleHeightChange = (event) => {
        const value = event.target.value;
        setInputHeight(value)
    }

    const drawSquareWithBorder = (x, y, width, height, fill="white", stroke = "black") => {
        const room = {
            id: hashCode(`${x}${y}${width}${height}`),
            fill,
            stroke,
            strokeWidth: 1, //TODO: Had to go to 3 to get it to show through the clipPath correctly. Probably a way to keep the outer edge at 3 and the inner grid lines at 1.
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
                const square = drawSquareWithBorder(squareSize*x, squareSize*y, squareSize, squareSize, "white", "gray");
                squares.push(square);
            }
        }
        return squares;
    }

    const resizeGrid = () => {
        setCanvasWidth(inputWidth); //TODO: Should not be able to change grid size here to inappropriate value
        setCanvasHeight(inputHeight);
    }

    const chooseRandomXY = (width, height) => {
        //determine random location
        const x = Math.floor(Math.random() * (canvasWidth/squareSize - width + 1));
        const y = Math.floor(Math.random() * (canvasHeight/squareSize - height + 1));
        //console.log(`Place room at x: ${x * squareSize}, y: ${y * squareSize}`)
        return {x, y};
    }

    const drawDungeonRooms = (rooms) => {
        const successfulRooms = [];
        for(let x = 0;x<rooms;x++) {
            const room = drawDungeonRoom(successfulRooms);
            if (room) {successfulRooms.push(room)};
        }
        console.log(`Placed ${successfulRooms.length}/${rooms}`)
        setData(data.concat(successfulRooms));
    }

    //TODO: Insert doors to nearly adjacent rooms. For the next closest room draw a hallway. 
    //TODO: Create different methods of placing hallways and connections.
    //TODO: Create different methods of placing rooms...more intentional to create more uniform designs. 
    //TODO: More of donjons dungeons are lined up more nicely. There is probably some preference toward order versus randomness. Create this by making there a chance that the next room is based off previous rather than random.
    //TODO: Make different shaped rooms. (Donjons looks like it takes rectangles and transforms rather than have specialized collision logic.)
    const drawDungeonRoom = (placedRooms) => {
        const smallerDimension = Math.min(Math.floor(canvasWidth/squareSize * .3), Math.floor(canvasHeight/squareSize * .3));
        const maxRoomWidth = smallerDimension;
        const minRoomWidth = 2;
        const maxRoomHeight = smallerDimension;
        const minRoomHeight = 2;

        //choose random size of dungeon room
        const width = Math.floor(Math.random() * (maxRoomWidth - minRoomWidth + 1) + minRoomWidth);
        const height = Math.floor(Math.random() * (maxRoomHeight - minRoomHeight + 1) + minRoomHeight);
        //console.log(`Draw Room width: ${width} height: ${height}`)
        
        if (preventCollisions) {
            let tries = 0;
            while(tries <= maxRoomPlacementTries) {
                const location = chooseRandomXY(width, height);
                const roomPlacement = trySelectLocationAndPlaceRoom(width, height, location.x, location.y, placedRooms);
                if (roomPlacement.result) {
                    return roomPlacement.room;
                } else {
                    tries++;
                }
            }
        } else {

        }
    }

    //draw hallways through all open areas

    //Find all grid squares that a door could be connected to (open)
    //Find the nearest edge to the next room. 
    //Pick a grid square on that edge
    //start and end with door and then hallway of connections if more than 1 step to next room. Draw a door if only 1 step away. Avoid double door if 2 steps?

    //https://stackoverflow.com/questions/4620880/javascript-arrays-of-objects-subtract-one-from-another (includes)
    const findNearbyRoom = (room, otherRooms, distance = 1 * squareSize) => {
        console.log("FindNearbyRoom at distance: " + distance)
        const result = findRoomAtDistance(room, otherRooms, distance);
        if (!result && distance < (10 * squareSize)) {
            //If we didn't find a room in that radius or the radius is too big try again with a larger radius.
            return findNearbyRoom(room, otherRooms, distance + (1 * squareSize))
        } else {
            //If we did find a room in that radius get that first room and return the two rooms that we are connecting and remove the found one from the room list.
            //TODO: Do we need to return the coordinates of the collision? We probably could with some alteration to the underlying function.
            const remainingRooms = otherRooms.filter(a => ![result].map(b=>b.id).includes(a.id))
            return {room1: room, room2: result, remainingRooms}
        }
    }

    const findRoomAtDistance = (room, otherRooms, distance) => {
        for(let r = 0;r<otherRooms.length;r++) {
            const currentRoom = otherRooms[r];
            if (isCollision(room, currentRoom, distance)) {
                return currentRoom;
            }
        }
        return false;
    }

    const isAnyCollision = (room, allRooms, distance = (1 * squareSize)) => {
        for(let r = 0;r<allRooms.length;r++) {
            const currentRoom = allRooms[r];
            if (isCollision(room, currentRoom, distance)) {
                return true;
            }
        }
        return false;
    }

    const isCollision = (r1, r2, distance = 0) => {
        return (r1.x + r1.width + distance >= r2.x &&
            r1.x - distance <= r2.x + r2.width &&
            r1.y + r1.height + distance >= r2.y &&
            r1.y - distance <= r2.y + r2.height) ? true : false;
    }

    const trySelectLocationAndPlaceRoom = (width, height, x, y, placedRooms) => {
        const room = drawSquareWithBorder(x * squareSize, y * squareSize, squareSize*width - 1, squareSize*height - 1, "blue");

        //check for collision with existing rect.
        const success = !(isAnyCollision(room, data.concat(placedRooms)));

        return {room: room, result: success};
    }

    const cutoutId = "cutoutrooms";
    const cutoutUrl = `url(#${cutoutId})`
    const grid = gridSquares().map((room, index) => <rect key={index} fill={room.fill} stroke={room.stroke} strokeWidth={room.strokeWidth} x={room.x} y={room.y} width={room.width} height={room.height} clipPath={cutoutUrl}/>);
    const roomCutouts = data.map((room, index) => {
        return (<rect key={index} fill={room.fill} stroke={room.stroke} strokeWidth={room.strokeWidth} x={room.x} y={room.y} width={room.width + 1} height={room.height + 1} />) //+1 to handle stroke width.
    });

    const roomClick = (event) => {
        console.log(event.target.getAttribute("roomnumber"));
        console.log(data);
        const currentRoom = data.filter(r => r.id == event.target.getAttribute("id"));
        console.log(currentRoom[0]);
        const remainingRooms = data.filter(a => !currentRoom.map(b=>b.id).includes(a.id))
        console.log(remainingRooms)
        console.log(findNearbyRoom(currentRoom[0], remainingRooms))
    }
    const rooms = data.map((room, index) => {
        return (<rect key={index} id={room.id} roomnumber={index} fill={room.fill} fillOpacity={0} stroke={room.stroke} strokeWidth={room.strokeWidth} x={room.x} y={room.y} width={room.width + 1} height={room.height + 1} onClick={roomClick} />) //+1 to handle stroke width.
    });

    return (
        <main>
            <section>
                <button onClick={() => {drawDungeonRooms(20)}}>Add Room</button>
                <button onClick={resizeGrid}>Resize Grid</button>
                Width: <input type="number" value={inputWidth} onChange={handleWidthChange} max={2000} min={minWH} step={100} />
                Height: <input type="number" value={inputHeight} onChange={handleHeightChange} max={2000} min={minWH} step={100}/>
            </section>
            <svg id="svgCanvas" width={canvasWidth} height={canvasHeight} style={{border: "1px solid black", margin: "10px", backgroundColor:"black"}} >
                <clipPath id={cutoutId}>{roomCutouts}</clipPath>
                {grid}
                {rooms}
            </svg>
        </main>
    )
}