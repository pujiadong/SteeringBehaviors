class Vector3D {

    public static add(vector1: Vector3D, vector2: Vector3D, result?: Vector3D) {
        if (!result) {
            result = new Vector3D();
        }
        for (let i = 0; i < vector1.element.length; i++) {
            result.element[i] = vector1.element[i] + vector2.element[i];
        }
        return result;
    }

    public static sub(vector1: Vector3D, vector2: Vector3D, result?: Vector3D) {
        if (!result) {
            result = new Vector3D();
        }
        for (let i = 0; i < vector1.element.length; i++) {
            result.element[i] = vector1.element[i] - vector2.element[i];
        }
        return result;
    }

    private vector: number[];

    constructor(x?: number, y?: number, z?: number) {
        this.vector = [x || 0, y || 0, z || 0];
    }

    public setValue(x: number, y: number, z?: number) {
        this.vector[0] = x;
        this.vector[1] = y;
        this.vector[2] = z || 0;
        return this;
    }

    public get x() {
        return this.vector[0];
    }

    public get y() {
        return this.vector[1];
    }

    public get z() {
        return this.vector[2];
    }

    public set x(value: number) {
        this.vector[0] = value;
    }

    public set y(value: number) {
        this.vector[1] = value;
    }

    public set z(value: number) {
        this.vector[2] = value;
    }

    public clone() {
        return new Vector3D(this.x, this.y, this.x);
    }

    public normalize() {
        const norm = Math.sqrt(this.vector.reduce((sum, val) => sum + val ** 2, 0));
        if (norm === 0) {
            return this;
        }
        for (let i = 0; i < this.vector.length; i++) {
            this.vector[i] /= norm
        }
        return this;
    }

    public scaleBy(value: number) {
        for (let i = 0; i < this.vector.length; i++) {
            this.vector[i] *= value;
        }
        return this;
    }

    public add(vector: Vector3D) {
        for (let i = 0; i < vector.element.length; i++) {
            this.vector[i] += vector.element[i];
        }
        return this;
    }

    public get element() {
        return this.vector;
    }

    public get length() {
        return Math.sqrt(this.vector.reduce((pre, cur) => pre + cur ** 2, 0))
    }

    public rotate(angle: number) {
        let x = this.vector[0] * Math.cos(angle) - this.vector[1] * Math.sin(angle);
        let y = this.vector[0] * Math.sin(angle) + this.vector[1] * Math.cos(angle);
        this.vector[0] = x;
        this.vector[1] = y;

        return this;
    }
}

function truncate(vector: Vector3D, max: number): Vector3D {
    let i = max / vector.length;
    i = i < 1.0 ? i : 1.0;
    vector.scaleBy(i);
    return vector;
}