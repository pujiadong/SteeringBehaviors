abstract class IBoid {
    public abstract getVelocity(): Vector3D;
    public abstract getMaxVelocity(): number;
    public abstract getPosition(): Vector3D;
    public abstract getMass(): number;
}


class SteeringManager {

    public static MAX_FORCE: number;

    public steering: Vector3D;
    public host: IBoid;

    public force: Vector3D;
    public desired: Vector3D;
    public targetVelocity: Vector3D;
    public targetPosition: Vector3D;

    constructor(host: IBoid) {
        this.host = host;
        this.steering = new Vector3D();
        this.force = new Vector3D();
        this.desired = new Vector3D();
        this.targetVelocity = new Vector3D();
        this.targetPosition = new Vector3D();
    }

    public seek(target: Vector3D, slowRadius: number = 20) {
        this.steering.add(this.doSeek(target, slowRadius));
    }

    public doSeek(target: Vector3D, slowRadius: number = 20) {
        this.force.reset();
        this.desired.reset();
        Vector3D.sub(target, this.host.getPosition(), this.desired);
        let distance = this.desired.length;
        this.desired.normalize();
        if (distance <= slowRadius) {
            this.desired.scaleBy(this.host.getMaxVelocity() * distance / slowRadius);
        } else {
            this.desired.scaleBy(this.host.getMaxVelocity());
        }

        Vector3D.sub(this.desired, this.host.getVelocity(), this.force);

        return this.force;
    }

    public flee(target: Vector3D) { }
    public doFlee(target: Vector3D) { }

    public wander() { }
    public doWander() { }

    public evade(target: IBoid) { }
    public doEvade(target: IBoid) { }

    public pursuit(target: IBoid) {
        this.steering.add(this.doPursuit(target));
    }

    public doPursuit(target: IBoid) {
        Vector3D.sub(target.getPosition(), this.host.getPosition(), this.desired)
        let updatesNeed = this.desired.length / this.host.getMaxVelocity();
        let tv = target.getVelocity().clone();
        tv.scaleBy(updatesNeed);
        let targetFurturePosition = target.getPosition().clone().add(tv);
        return this.doSeek(targetFurturePosition);   
    }

    public update() {
        let velocity = this.host.getVelocity();
        let position = this.host.getPosition();
        truncate(this.steering, SteeringManager.MAX_FORCE);
        this.steering.scaleBy(1 / this.host.getMass());
        velocity.add(this.steering);
        truncate(velocity, this.host.getMaxVelocity());
        position.add(velocity);
    }

    public reset() { }
}