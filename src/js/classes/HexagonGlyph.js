import AnimatedGlyph from './AnimatedGlyph.js';
import ShuffleArray from '../functions/ShuffleArray.js';

export default class HexagonGlyph extends AnimatedGlyph {

    constructor(p5, x, y, width, startWidth, darkMode) {
        super(p5, x, y, width, startWidth);
        this.hueSet = ShuffleArray([30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]);
        this.hue1 = this.hueSet[0];
        this.hue2 = this.hueSet[1];
        this.hue3 = this.hueSet[2];
        this.hue4 = this.hueSet[3];
        this.stroke = darkMode ? p5.color(0, 0, 0) : p5.color(0, 0, 100);
        this.endTime = this.startTime + this.lifeTime + 1000;
    }
    drawHexagon(x, y, radius, hue) {
        this.p.angleMode(this.p.RADIANS);
        const angle = this.p.TWO_PI / 6;
        this.p.beginShape();
        this.p.stroke(this.stroke);
        this.p.fill(hue, 100, 100, 0.5);

        for (let a = this.p.TWO_PI / 12; a < this.p.TWO_PI + this.p.TWO_PI / 12; a += angle) {
            const sx = x + this.p.cos(a) * radius;
            const sy = y + this.p.sin(a) * radius;
            this.p.vertex(sx, sy);
        }
        
        this.p.endShape(this.p.CLOSE);
        this.p.angleMode(this.p.DEGREES);
    }

    draw() {
        const currentTime = this.p.millis();
        if(currentTime < this.endTime){
            const scale = this.p.min(1, (currentTime - this.startTime) / (this.endTime - this.startTime)),
                dist = window.p5.Vector.sub(this.destination, this.origin).mult(scale),
                pos = window.p5.Vector.add(this.origin, dist);

            this.p.translate(pos.x, pos.y);
            this.p.rotate(this.rotation);
            this.p.strokeWeight(1);
            
            this.drawHexagon(0, 0, this.width, this.hue1);
            this.drawHexagon(0, 0, this.width / 2, this.hue2);
            this.drawHexagon(0, 0, this.width / 4, this.hue1);
            
            this.p.rotate(-this.rotation);
            this.p.translate(-pos.x, -pos.y);
        }
    }
}