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

    let radius = 10;     // 小球半径
    let maxVelocity = 5; // 最大速度
    let mass = 20;       // 小球质量
    let maxForce = 50;   // 最大推力

    //  红色小球初始位置(画布中间)
    let redTargetPosition = new Vector3D(30, canvas.height - 50);

    // 黑色小球初始位置
    let blackTargetPosition = new Vector3D(10, 50);
    let blackTargetVelocity = new Vector3D(1, 0);
    // 蓝色色小球初始位置
    let blueTargetPosition = new Vector3D(10, 550);
    let blueTargetVelocity = new Vector3D(1, 0);
    // 当前追捕的目标
    let targetPosition: Vector3D = blackTargetPosition;

    let redTargetVelocity = new Vector3D(3, -1);   // 红色小球初始速度
    let desiredVelocity = new Vector3D();      // 红色小球期望速度
    let steering = new Vector3D();             // 红色小球受到的推力
    let futurePosition = new Vector3D();             // 红色小球受到的推力

    let seek = (futurePosition: Vector3D) => {
        // 计算期望速度
        Vector3D.sub(futurePosition, redTargetPosition, desiredVelocity);
        desiredVelocity.normalize();
        desiredVelocity.scaleBy(maxVelocity);
        // 计算转向力
        Vector3D.sub(desiredVelocity, redTargetVelocity, steering);
        steering = truncate(steering, maxForce);
        steering.scaleBy(1 / mass);

        return steering;
    }

    let pursuit = (redTargetPosition: Vector3D, position: Vector3D, velocity: Vector3D) => {
        let distance = futurePosition;  // 临时借用一下 futurePosition 
        Vector3D.sub(redTargetPosition, position, distance);
        let t = distance.length / maxVelocity;
        Vector3D.scaleBy(velocity, t, futurePosition);
        Vector3D.add(position, futurePosition, futurePosition)
        return seek(futurePosition);
    }

    let render = () => {

        // 红色小球和黑色/蓝色小球的距离<3的时候，改变目标
        let dxBlack = Math.abs(redTargetPosition.x - blackTargetPosition.x);
        let dyBlack = Math.abs(redTargetPosition.y - blackTargetPosition.y);
        let dxBlue = Math.abs(redTargetPosition.x - blueTargetPosition.x);
        let dyBlue = Math.abs(redTargetPosition.y - blueTargetPosition.y);
        if (dxBlack < 3 && dyBlack < 3) {
            targetPosition = blueTargetPosition;
        }
        if (dxBlue < 3 && dyBlue < 3) {
            targetPosition = blackTargetPosition; 
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        steering = pursuit(redTargetPosition, targetPosition, blackTargetVelocity);

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

        // 绘制蓝色色小球
        blueTargetPosition.add(blueTargetVelocity);
        if (blueTargetPosition.x + radius >= canvas.width || blueTargetPosition.x - radius <= 0) {
            blueTargetVelocity.x *= -1;
        }
        if (blueTargetPosition.y + radius >= canvas.height || blueTargetPosition.y - radius <= 0) {
            blueTargetVelocity.y *= -1;
        }
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(blueTargetPosition.x, blueTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

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