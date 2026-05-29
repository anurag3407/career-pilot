// import {useEffect, useRef} from "react";
// export default function 
// ParticleBackground(){
//     const canvasRef = useRef(null);
    
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         const particles = [];
//         for(let i = 0; i< 100; i++){
//             particles.push({
//                 x: Math.random() * canvas.width,
//                 y: Math.random() * canvas.height,
//                 radius: 2,
//                 dx: (Math.random() - 0.5) * 2,
//                 dy: (Math.random() - 0.5) * 2,
//             })
//         }
        
//         function animate() {
//             ctx.clearRect(0 , 0 , canvas.width, canvas.height);
//             particles.forEach((p) => {
//                 p.x += p.dx;
//                 p.y += p.dy;
//                 if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
//                 if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
//                 ctx.beginPath();
//                 ctx.arc(p.x, p.y , p.radius, 0, Math.PI * 2);
//                 ctx.fillStyle = "white";
//                 ctx.fill();
//             });
//             requestAnimationFrame(animate);
//         }
//         animate();
//     }, []);
    
//     return (
//         <canvas
//         ref = {canvasRef}
//         className="absolute top-0 left-0 w-full h-full z-0"
//         />
//     );
// }
import { useEffect , useRef} from "react";
export default function 
ParticleBackground(){
    const canvasRef = useRef(null);
    useEffect(() => {
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const mouse = {
                x: null,
                y: null,
            };
        window.addEventListener("mousemove",(e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;            
        });

    const particles = [];
        for (let i= 0 ; i<80; i++){
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random()- 0.5)* 0.5,
                radius: 2.5,
            });
        } 
        function animate() {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if(p.y <0 || p.y > canvas.height) p.dy *= -1;
                if(mouse.x && mouse.y) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    if(distance < 80) {
                        p.x += dx* 0.01;
                        p.y += 0.01;
                    }
                }
            
                ctx.beginPath();
                ctx.arc(p.x , p.y, p.radius , 0, Math.PI * 2.5);
                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.fill();
                ctx.closePath();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }, []);
    return(
        <canvas 
        ref = {canvasRef}
        className ="absolute inset-0"
        />

    );
    
}