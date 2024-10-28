import AnimatedGlyph from './AnimatedGlyph.js';
import ShuffleArray from '../functions/ShuffleArray.js';

export default class StarGlyph extends AnimatedGlyph {

    constructor(p5, x, y, width) {
        super(p5, x, y, width);
        this.hueSet = ShuffleArray([30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]);
    }

    draw() {
        const currentTime = this.p.millis();
        if(currentTime < this.endTime){
            const scale = this.p.min(1, (currentTime - this.startTime) / (this.endTime - this.startTime)),
                dist = window.p5.Vector.sub(this.destination, this.origin).mult(scale),
                pos = window.p5.Vector.add(this.origin, dist);

            let angle = this.p.TWO_PI / 5;
            let halfAngle = angle / 2.0;
            this.p.push();
            this.p.translate(pos.x, pos.y);
            this.p.rotate(this.rotation);
            this.p.strokeWeight(2);
            this.p.stroke(this.hueSet[0], 0, 100, this.p.starGlyphOpacity);
            this.p.fill(this.hueSet[0], 100, 100, this.p.starGlyphOpacity / 4);
            this.p.angleMode(this.p.RADIANS);
            this.p.scale(0.1 + 1 / this.maxWidth * this.width)
            this.p.beginShape();
            for (let a = 0; a < this.p.TWO_PI; a += angle) {
                let sx = 0 + this.p.cos(a) * 70;
                let sy = 0 + this.p.sin(a) * 70;
                this.p.vertex(sx, sy);
                sx = 0 + this.p.cos(a + halfAngle) * 30;
                sy = 0 + this.p.sin(a + halfAngle) * 30;
                this.p.vertex(sx, sy);
            }
            this.p.endShape(this.p.CLOSE);
            this.p.fill(this.hueSet[2], 100, 100, this.p.starGlyphOpacity / 4);
            this.p.scale((0.1 + 1 / this.maxWidth * this.width) / 2)
            this.p.beginShape();
            for (let a = 0; a < this.p.TWO_PI; a += angle) {
                let sx = 0 + this.p.cos(a) * 70;
                let sy = 0 + this.p.sin(a) * 70;
                this.p.vertex(sx, sy);
                sx = 0 + this.p.cos(a + halfAngle) * 30;
                sy = 0 + this.p.sin(a + halfAngle) * 30;
                this.p.vertex(sx, sy);
            }
            this.p.endShape(this.p.CLOSE);
            this.p.fill(this.hueSet[0], 100, 100, this.p.starGlyphOpacity / 4);
            this.p.scale((0.1 + 1 / this.maxWidth * this.width) / 4)
            this.p.beginShape();
            for (let a = 0; a < this.p.TWO_PI; a += angle) {
                let sx = 0 + this.p.cos(a) * 70;
                let sy = 0 + this.p.sin(a) * 70;
                this.p.vertex(sx, sy);
                sx = 0 + this.p.cos(a + halfAngle) * 30;
                sy = 0 + this.p.sin(a + halfAngle) * 30;
                this.p.vertex(sx, sy);
            }
            this.p.endShape(this.p.CLOSE);
            this.p.angleMode(this.p.DEGREES);
            this.p.rotate(-this.rotation);
            this.p.translate(-pos.x, -pos.y);
            this.p.pop();
        }
    }
}