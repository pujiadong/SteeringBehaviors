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


    let radius = 10;                                                     // 小球半径
    let position = new Vector3D(canvas.width / 2, canvas.height / 2);  // 红色小球初始位置
    let velocity = new Vector3D(1, 1);                                 // 红色小球初始速度
    let wanderForce = new Vector3D();
    let maxVelocity = 1;                                                 // 最大速度
    let CIRCLE_DISTANCE = 60;       
    let CIRCLE_RADIUS = 30;
    let CIRCLE_POSITION = new Vector3D();
    let wanderAngle = 1 / 9 * Math.PI;          // 位移力夹角
    let ANGLE_CHANGE = 1 / 3 * Math.PI;         // 随机位移力夹角范围
    let maxForce = 50;       // 最大推力
    let mass = 20;           // 小球质量

    function wander() {
        let circleCenter = velocity.clone();
        circleCenter.normalize();
        circleCenter.scaleBy(CIRCLE_DISTANCE);
        let displacement = new Vector3D(0, -1);
        displacement.scaleBy(CIRCLE_RADIUS);
        displacement.rotate(wanderAngle);
        wanderAngle += (Math.random() * ANGLE_CHANGE) - (ANGLE_CHANGE * 0.5);
        // 计算转向力
        Vector3D.add(circleCenter, displacement, wanderForce);
        wanderForce = truncate(wanderForce, maxForce);
        wanderForce.scaleBy(1 / mass);

        return { wanderForce, circleCenter, displacement };
    }



    let render = () => {
        let x = position.element[0],
            y = position.element[1];
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
            position.setValue(canvas.width / 2, canvas.height / 2);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制红色小球前的圆圈
        let info = wander();
        let circleCenter = info.circleCenter;
        ctx.strokeStyle = 'black'
        ctx.beginPath();
        Vector3D.add(circleCenter, position, CIRCLE_POSITION);
        ctx.arc(CIRCLE_POSITION.element[0], CIRCLE_POSITION.element[1], CIRCLE_RADIUS, 0, 2 * Math.PI)
        ctx.closePath();
        ctx.stroke();

        // 绘制原始速度方向和位移力方向
        let displacement = info.displacement;
        ctx.strokeStyle = 'black'
        ctx.beginPath();
        ctx.moveTo(position.element[0], position.element[1]);
        ctx.lineTo(CIRCLE_POSITION.element[0],CIRCLE_POSITION.element[1])
        ctx.lineTo(CIRCLE_POSITION.element[0] + displacement.element[0], CIRCLE_POSITION.element[1] + displacement.element[1])
        ctx.stroke();


        // 计算红色小球最新速度和最新位置
        let steering = info.wanderForce;
        velocity.add(steering)
        velocity = truncate(velocity, maxVelocity)
        position.add(velocity);

        // 绘制红色小球
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(position.element[0], position.element[1], radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // 绘制红色小球最新速度方向
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(position.element[0], position.element[1])
        ctx.lineTo(CIRCLE_POSITION.element[0] + displacement.element[0], CIRCLE_POSITION.element[1] + displacement.element[1])
        ctx.stroke();

        requestAnimationFrame(render);
    }

    render();

})();