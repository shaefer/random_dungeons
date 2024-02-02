const buildGridBackground = () => {
    const canvas = document.getElementById("gridCanvas"); //TODO: Do something about the hardcoding of the id.
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(20, 10, 150, 100);
}