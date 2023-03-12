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
    let maxVelocity = 4; // 最大速度
    let mass = 20; // 小球质量
    let maxForce = 50; // 最大推力
    //  红色小球初始位置(画布中间)
    let redTargetPosition = new Vector3D(canvas.width / 2, canvas.height / 2);
    // 黑色小球初始位置(随机生成)
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let blackTargetPosition = new Vector3D(x, y);
    let redTargetVelocity = new Vector3D(1, 1); // 红色小球初始速度
    let desiredVelocity = new Vector3D(); // 红色小球期望速度
    let steering = new Vector3D(); // 红色小球受到的推力
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
    let render = () => {
        // 红色小球和黑色小球的距离<2的时候，重新随机黑色小球的位置
        if (Math.abs(redTargetPosition.x - blackTargetPosition.x) < 2 &&
            Math.abs(redTargetPosition.y - blackTargetPosition.y) < 2) {
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            blackTargetPosition.setValue(x, y);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        steering = seek(blackTargetPosition);
        // 更新红色小球速度和位置
        redTargetVelocity.add(steering);
        redTargetVelocity = truncate(redTargetVelocity, maxVelocity);
        redTargetPosition.add(redTargetVelocity);
        // 绘制黑色小球
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
