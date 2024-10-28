export default class AnimatedGlyph {
    constructor(p5, x, y, width, startWidth = 0, lifetime = 0, direction = '') {
        this.p = p5;
        this.hue = this.p.random(0, 360);
        this.origin = this.p.createVector(x, y);
        this.width = startWidth;
        this.maxWidth = width;
        this.rotation = 0;
        this.lifeTime = lifetime ? lifetime : this.p.random(5000, 15000);
        this.startTime = this.p.millis();
        this.endTime = this.startTime + this.lifeTime;
        
        const randY =  this.p.random(0, this.p.height);
        const randX =  this.p.random(0, this.p.width);
        this.direction = direction ? direction : this.p.random(['left', 'right', 'up', 'down']);
        switch (this.direction) {
            case 'left':
                this.destination = this.p.createVector(0, randY);
                break;
            case 'right':
                this.destination = this.p.createVector(this.p.width, randY);
                break;
            case 'up':
                this.destination = this.p.createVector(randX, 0);
                break;
            case 'down':
                this.destination = this.p.createVector(randX, this.p.height);
                break;
        }

        this.clockwiseRotation = Math.random() < 0.5;
    }

    update() {
        if(this.width < this.maxWidth) {
            this.width = this.width + (Math.random() / 4);
        }
        if(this.clockwiseRotation){
            this.rotation++;
        }
        else {
            this.rotation--;
        }
    }

    draw() {
        const x1 = 0 - (this.width/2),   
            y1 = 0 + (this.width/2), 
            x2 = 0,
            y2 = 0 - (this.width/2),
            x3 = 0 + (this.width/2), 
            y3 = 0 + (this.width/2),
            currentTime = this.p.millis();
        if(currentTime < this.endTime){
            const scale = this.p.min(1, (currentTime - this.startTime) / (this.endTime - this.startTime)),
                dist = window.p5.Vector.sub(this.destination, this.origin).mult(scale),
                pos = window.p5.Vector.add(this.origin, dist);
            this.p.translate(pos.x, pos.y);
            this.p.rotate(this.rotation);
            this.p.strokeWeight(4);
            this.p.stroke(this.hue, 100, 100);
            this.p.fill(this.hue, 100, 100, 0.25);
            this.p.triangle(x1, y1, x2, y2, x3, y3);
            this.p.rotate(-this.rotation);
            this.p.translate(-pos.x, -pos.y);
        }
    }
}