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
    let maxVelocity = 5; // 最大速度
    let mass = 20; // 小球质量
    let maxForce = 100; // 最大推力
    //  红色小球初始位置(画布中间)
    let redTargetPosition = new Vector3D(30, canvas.height - 50);
    // 黑色小球初始位置
    let blackTargetPosition = new Vector3D(10, 50);
    let blackTargetVelocity = new Vector3D(1, 0);
    let redTargetVelocity = new Vector3D(3, -1); // 红色小球初始速度
    let desiredVelocity = new Vector3D(); // 红色小球期望速度
    let steering = new Vector3D(); // 红色小球受到的推力
    let futurePosition = new Vector3D(); // 红色小球受到的推力
    let seek = (futurePosition) => {
        // 计算期望速度
        Vector3D.sub(futurePosition, redTargetPosition, desiredVelocity);
        desiredVelocity.normalize();
        desiredVelocity.scaleBy(maxVelocity);
        // 计算转向力
        Vector3D.sub(desiredVelocity, redTargetVelocity, steering);
        steering = truncate(steering, maxForce);
        steering.scaleBy(1 / mass);
        return steering;
    };
    let pursuit = (redTargetPosition, position, velocity) => {
        let distance = futurePosition; // 临时借用一下 futurePosition 
        Vector3D.sub(redTargetPosition, position, distance);
        let t = distance.length / maxVelocity;
        Vector3D.scaleBy(velocity, t, futurePosition);
        Vector3D.add(position, futurePosition, futurePosition);
        return seek(futurePosition);
    };
    let render = () => {
        // 红色小球和黑色小球的距离<2的时候，重新随机黑色小球的位置
        if (Math.abs(redTargetPosition.x - blackTargetPosition.x) < 3 &&
            Math.abs(redTargetPosition.y - blackTargetPosition.y) < 3) {
            blackTargetPosition.y = blackTargetPosition.y === 550 ? 50 : 550;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        steering = pursuit(redTargetPosition, blackTargetPosition, blackTargetVelocity);
        // 更新红色小球速度和位置 
        redTargetVelocity.add(steering);
        redTargetVelocity = truncate(redTargetVelocity, maxVelocity);
        redTargetPosition.add(redTargetVelocity);
        // 绘制黑色小球
        blackTargetPosition.add(blackTargetVelocity);
        if (blackTargetPosition.x + radius >= canvas.width || blackTargetPosition.x - radius <= 0) {
            blackTargetVelocity.x *= -1;
        }
        if (blackTargetPosition.y + radius >= canvas.height || blackTargetPosition.y - radius <= 0) {
            blackTargetVelocity.y *= -1;
        }
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
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
