"use strict";
(() => {
    let canvas = document.getElementById("canvas");
    if (!canvas) {
        console.error("not found canvas");
        return;
    }
    let ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("not found canvas 2d ctx");
        return;
    }
    let radius = 10; // 小球半径
    let slowingRadius = 100; // 减速半径
    let redTargetPosition = new Vector3D(20, 20); // 红色小球初始位置
    let redTargetVelocity = new Vector3D(1, 1); // 红色小球初始速度
    let maxVelocity = 4; // 最大速度
    let blackTargetPosition = new Vector3D(300, 300); // 黑色小球位置
    let desiredVelocity = new Vector3D();
    let steering = new Vector3D();
    canvas.addEventListener('click', (evt) => {
        redTargetPosition.x = evt.offsetX;
        redTargetPosition.y = evt.offsetY;
    });
    let arrivel = (futurePosition) => {
        // 计算期望速度
        Vector3D.sub(futurePosition, redTargetPosition, desiredVelocity);
        let distance = desiredVelocity.length;
        if (distance < slowingRadius) {
            // distance / slowingRadius 逐渐变小
            desiredVelocity.normalize().scaleBy(maxVelocity).scaleBy(distance / slowingRadius);
        }
        else {
            desiredVelocity.normalize().scaleBy(maxVelocity);
        }
        // 转向力逐渐变大
        Vector3D.sub(desiredVelocity, redTargetVelocity, steering);
        return steering;
    };
    let render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制黑色小球
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        // 绘制减速边界
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, slowingRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        steering = arrivel(blackTargetPosition);
        // 红色小球的速度逐渐变小，最终 redTargetVelocity = -steering
        redTargetVelocity.add(steering);
        redTargetVelocity = truncate(redTargetVelocity, maxVelocity);
        redTargetPosition.add(redTargetVelocity);
        // 绘制红色小球
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(redTargetPosition.x, redTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        requestAnimationFrame(render);
    };
    render();
})();
