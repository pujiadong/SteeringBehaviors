"use strict";
class Vector3D {
    static add(vector1, vector2, result) {
        if (!result) {
            result = new Vector3D();
        }
        for (let i = 0; i < vector1.element.length; i++) {
            result.element[i] = vector1.element[i] + vector2.element[i];
        }
        return result;
    }
    static sub(vector1, vector2, result) {
        if (!result) {
            result = new Vector3D();
        }
        for (let i = 0; i < vector1.element.length; i++) {
            result.element[i] = vector1.element[i] - vector2.element[i];
        }
        return result;
    }
    static scaleBy(vector, value, result) {
        if (!result) {
            result = new Vector3D();
        }
        for (let i = 0; i < vector.element.length; i++) {
            result.element[i] = vector.element[i] * value;
        }
        return result;
    }
    constructor(x, y, z) {
        this.vector = [x || 0, y || 0, z || 0];
    }
    setValue(x, y, z) {
        this.vector[0] = x;
        this.vector[1] = y;
        this.vector[2] = z || 0;
        return this;
    }
    get x() {
        return this.vector[0];
    }
    get y() {
        return this.vector[1];
    }
    get z() {
        return this.vector[2];
    }
    set x(value) {
        this.vector[0] = value;
    }
    set y(value) {
        this.vector[1] = value;
    }
    set z(value) {
        this.vector[2] = value;
    }
    clone() {
        return new Vector3D(this.x, this.y, this.x);
    }
    normalize() {
        const norm = Math.sqrt(this.vector.reduce((sum, val) => sum + val ** 2, 0));
        if (norm === 0) {
            return this;
        }
        for (let i = 0; i < this.vector.length; i++) {
            this.vector[i] /= norm;
        }
        return this;
    }
    scaleBy(value) {
        for (let i = 0; i < this.vector.length; i++) {
            this.vector[i] *= value;
        }
        return this;
    }
    add(vector) {
        for (let i = 0; i < vector.element.length; i++) {
            this.vector[i] += vector.element[i];
        }
        return this;
    }
    get element() {
        return this.vector;
    }
    get length() {
        return Math.sqrt(this.vector.reduce((pre, cur) => pre + cur ** 2, 0));
    }
    rotate(angle) {
        let x = this.vector[0] * Math.cos(angle) - this.vector[1] * Math.sin(angle);
        let y = this.vector[0] * Math.sin(angle) + this.vector[1] * Math.cos(angle);
        this.vector[0] = x;
        this.vector[1] = y;
        return this;
    }
}
function truncate(vector, max) {
    let i = max / vector.length;
    i = i < 1.0 ? i : 1.0;
    vector.scaleBy(i);
    return vector;
}
