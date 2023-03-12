(() => {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
        console.error("not found canvas");
        return;
    }
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!ctx) {
        console.error("not found canvas 2d ctx");
        return;
    }

    let radius = 10;          // 小球半径
    let mass = 20;            // 小球质量
    let maxForce = 50;        // 最大推力

    //  红色小球初始位置(画布中间)
    let redTargetPosition = new Vector3D(20, 20);
    let redTargetVelocity = new Vector3D(1, 1);
    let maxVelocity = 4
    let blackTargetPosition = new Vector3D(canvas.width / 2 + 50, canvas.height / 2 + 30);

    let desiredVelocity = new Vector3D();
    let steering = new Vector3D();

    let flee = (futurePosition: Vector3D) => {
        // 计算期望速度
        Vector3D.sub(redTargetPosition, futurePosition, desiredVelocity);
        desiredVelocity.normalize();
        desiredVelocity.scaleBy(maxVelocity);

        // 计算转向力
        Vector3D.sub(desiredVelocity, redTargetVelocity, steering);
        steering = truncate(steering, maxForce);
        steering.scaleBy(1 / mass);

        return steering;
    }

    let render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制黑色小球
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, 100, 0, 2 * Math.PI)
        ctx.closePath();
        ctx.stroke();

        if (redTargetPosition.x + radius >= canvas.width || redTargetPosition.x - radius <= 0) {
            redTargetVelocity.x *= -1;
        }
        if (redTargetPosition.y + radius >= canvas.height || redTargetPosition.y - radius <= 0) {
            redTargetVelocity.y *= -1;
        }

        // 红色小球和黑色小球的距离<40的时候，调整红球的速度
        if ((redTargetPosition.x - blackTargetPosition.x) ** 2 + (redTargetPosition.y - blackTargetPosition.y) ** 2 < 100 ** 2) {
            steering = flee(blackTargetPosition);
        } else {
            steering.setValue(redTargetVelocity.x, redTargetVelocity.y);
            steering = truncate(steering, maxForce);
            steering.scaleBy(1 / mass);
        }
        // 更新红色小球速度
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
    }
    render();
})();