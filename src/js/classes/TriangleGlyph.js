import AnimatedGlyph from './AnimatedGlyph.js';
import ShuffleArray from '../functions/ShuffleArray.js';

export default class TriangleGlyph extends AnimatedGlyph {

    constructor(p5, x, y, width) {
        super(p5, x, y, width, width / 4, p5.random(3000, 5000));
        this.hue = ShuffleArray([30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360])[0];

        this.satCircles = {
            brightness: [100, 0, 100],
            alpha: [0.1875, 0.625, 0.375],
            size: [
                width / 3,
                width / 6,
                width / 12,
            ]
        };
    }

    draw() {
        const x1 = 0 - (this.width/2),   
            y1 = 0 + (this.width/2), 
            x2 = 0,
            y2 = 0 - (this.width/2),
            x3 = 0 + (this.width/2), 
            y3 = 0 + (this.width/2),
            x4 = 0 - (this.width/2),   
            y4 = 0 - (this.width/2), 
            x5 = 0,
            y5 = 0 + (this.width/2),
            x6 = 0 + (this.width/2), 
            y6 = 0 - (this.width/2),
            currentTime = this.p.millis();
        if(currentTime < this.endTime){
            const scale = this.p.min(1, (currentTime - this.startTime) / (this.endTime - this.startTime)),
                dist = window.p5.Vector.sub(this.destination, this.origin).mult(scale),
                pos = window.p5.Vector.add(this.origin, dist);
            this.p.translate(pos.x, pos.y);
            this.p.rotate(this.rotation);

             // Draw the circles that represent the saturation dimension
            this.p.stroke(0);
            for (let i = 0; i < 3; i++) {
                this.p.fill(0, 0, this.satCircles.brightness[i], this.satCircles.alpha[i]);
                this.p.ellipse(0, 0, this.satCircles.size[i]);
            }
            
            this.p.strokeWeight(4);
            this.p.stroke(this.hue, 100, 100);
            this.p.fill(this.hue, 100, 100, 0.1);
            this.p.triangle(x1, y1, x2, y2, x3, y3);
            this.p.triangle(x4, y4, x5, y5, x6, y6);

            const oppositeHue = (this.hue + 180) % 360;
            this.p.stroke(this.hue, 0, 100);
            this.p.fill(oppositeHue, 100, 100, 0.5);
            this.p.push();
            this.p.scale(0.75);
            this.p.triangle(x1, y1, x2, y2, x3, y3);
            this.p.triangle(x4, y4, x5, y5, x6, y6);
            this.p.stroke(this.hue, 0, 0);
            this.p.fill(this.hue, 100, 100, 0.5);
            this.p.scale(0.5);
            this.p.triangle(x1, y1, x2, y2, x3, y3);
            this.p.triangle(x4, y4, x5, y5, x6, y6);
            this.p.pop();



            this.p.rotate(-this.rotation);
            this.p.translate(-pos.x, -pos.y);
            this.p.strokeWeight(1);
        }
    }

    /**
     * function to draw a hexagon shape
     * adapted from: https://p5js.org/examples/form-regular-polygon.html
     * @param {Number} x  - x-coordinate of the hexagon
     * @param {Number} y  - y-coordinate of the hexagon
     * @param {Number} radius - radius of the hexagon
     */
    octagon(x, y, radius) {
        this.p.angleMode(this.p.RADIANS);
        const angle = this.p.TWO_PI / 8;
        this.p.beginShape();
        for (let a = this.p.TWO_PI/16; a < this.p.TWO_PI + this.p.TWO_PI/16; a += angle) {
            const sx = x + this.p.cos(a) * radius;
            const sy = y + this.p.sin(a) * radius;
            this.p.vertex(sx, sy);
        }
        this.p.endShape(this.p.CLOSE);
        this.p.angleMode(this.p.DEGREES);
    }
}