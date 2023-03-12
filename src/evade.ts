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
    let fleeRadius = 100;

    //  红色小球初始位置(画布中间)
    let redTargetPosition = new Vector3D(30, canvas.height / 2);

    // 黑色小球初始位置
    let blackTargetPosition = new Vector3D(fleeRadius, 100);
    let targetVelocity = new Vector3D(1, 0);
    // 蓝色色小球初始位置
    let blueTargetPosition = new Vector3D(fleeRadius, 500);
    let blueTargetVelocity = new Vector3D(1, 0);
    // 当前追捕的目标
    let targetPosition: Vector3D = blackTargetPosition;

    let redTargetVelocity = new Vector3D(3, -1);   // 红色小球初始速度
    let desiredVelocity = new Vector3D();      // 红色小球期望速度
    let steering = new Vector3D();             // 红色小球受到的推力
    let futurePosition = new Vector3D();             // 红色小球受到的推力
    let distance = new Vector3D();             // 红色小球受到的推力

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

    let pursuit = (redTargetPosition: Vector3D, position: Vector3D, velocity: Vector3D) => {
        Vector3D.sub(redTargetPosition, position, distance);
        let t = distance.length / maxVelocity;
        Vector3D.scaleBy(velocity, t, futurePosition);
        Vector3D.add(position, futurePosition, futurePosition)
        return seek(futurePosition);
    }

    let evade = (redTargetPosition: Vector3D, position: Vector3D, velocity: Vector3D) => {
        let distance = futurePosition;  // 临时借用一下 futurePosition 
        Vector3D.sub(redTargetPosition, position, distance);
        let t = distance.length / maxVelocity;
        Vector3D.scaleBy(velocity, t, futurePosition);
        Vector3D.add(position, futurePosition, futurePosition)
        return flee(futurePosition);
    } 
    
    let render = () => {
        
        steering = pursuit(redTargetPosition, targetPosition, targetVelocity);
        // 红色小球和黑色/蓝色小球的距离<3的时候，改变目标
        Vector3D.sub(redTargetPosition, blackTargetPosition, distance)
        if (distance.length < fleeRadius) {
            targetPosition = blueTargetPosition;
            steering = evade(redTargetPosition, targetPosition, targetVelocity);
        }
        Vector3D.sub(redTargetPosition, blueTargetPosition, distance)
        if (distance.length < fleeRadius) {
            targetPosition = blackTargetPosition;
            steering = evade(redTargetPosition, targetPosition, targetVelocity);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        

        // 更新红色小球速度和位置 
        redTargetVelocity.add(steering);
        redTargetVelocity = truncate(redTargetVelocity, maxVelocity);
        redTargetPosition.add(redTargetVelocity);

        // 绘制黑色小球
        blackTargetPosition.add(targetVelocity);
        if (blackTargetPosition.x + fleeRadius >= canvas.width || blackTargetPosition.x - fleeRadius <= 0) {
            targetVelocity.x *= -1;
        }
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.arc(blackTargetPosition.x, blackTargetPosition.y, fleeRadius, 0, 2 * Math.PI)
        ctx.closePath();
        ctx.stroke();

        // 绘制蓝色色小球
        blueTargetPosition.add(blueTargetVelocity);
        if (blueTargetPosition.x + fleeRadius >= canvas.width || blueTargetPosition.x - fleeRadius <= 0) {
            blueTargetVelocity.x *= -1;
        }
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(blueTargetPosition.x, blueTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'blue'
        ctx.beginPath();
        ctx.arc(blueTargetPosition.x, blueTargetPosition.y, fleeRadius, 0, 2 * Math.PI)
        ctx.closePath();
        ctx.stroke();

        // 绘制红色小球
        // redTargetPosition.add(redTargetVelocity);
        // if (redTargetPosition.x + radius >= canvas.width || redTargetPosition.x - radius <= 0) {
        //     redTargetVelocity.x *= -1;
        // }
        // if (redTargetPosition.y + radius >= canvas.height || redTargetPosition.y - radius <= 0) {
        //     redTargetVelocity.y *= -1;
        // }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(redTargetPosition.x, redTargetPosition.y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        requestAnimationFrame(render);
    }
    render();
})();