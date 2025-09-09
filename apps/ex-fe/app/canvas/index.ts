type Shape = {
    type: string,
    x: number,
    y: number,
    height: number,
    width: number
}
function initDraw(canvas: HTMLCanvasElement){
    const ctx = canvas.getContext("2d");
    
    let existingShapes: Shape[] = [];

    if(!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e)=>{
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })
    
    canvas.addEventListener("mouseup", (e)=>{
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            height,
            width
        })
    })

    canvas.addEventListener('mousemove',(e)=>{
        if(clicked){
            const width = e.clientX-startX;
            const height = e.clientY-startY;
            clearCanvas(existingShapes, ctx, canvas);
            ctx.strokeStyle = 'white',
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}
export default initDraw

function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    existingShapes.map((shape)=>{
        if(shape.type === 'rect'){
            ctx.strokeStyle = 'white';
            ctx.strokeRect(shape.x,shape.y, shape.width, shape.height);
        }
    })
}
