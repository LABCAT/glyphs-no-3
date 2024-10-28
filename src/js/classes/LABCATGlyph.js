import AnimatedGlyph from './AnimatedGlyph.js';

export default class LABCATGlyph extends AnimatedGlyph {

    constructor(p5, x, y, width, shapeType, direction) {
        super(p5, x, y, width, width / 2, p5.random(3000, 6000));

        this.width = this.maxWidth / 4;
        this.shapeType = shapeType;

        this.center = this.width / 2;
        
        // the HSB colour that this Glyph represents
        this.hsbColour = [
            Math.floor(this.p.random(0, 360)),
            this.p.random(0, 100),
            this.p.random(0, 100)
        ];
        
        // value of the hue dimension
        this.hueDegree = this.hsbColour[0];
        this.brightnessTrans = this.p.map(this.hsbColour[2], 0, 100, 0.8, 0);
        this.hueTrans = this.p.map(this.hsbColour[2], 100, 0, 0.9, 0.1);
    }

    update() {
        if(this.width < this.maxWidth) {
            this.width = this.width + (Math.random() / 4);
        }
        this.rotation++;

        this.center = this.width / 2;

        // variables created by the saturation dimension
        this.circleSize = this.p.map(this.hsbColour[1], 100, 0, this.width, 0 + this.width/16);

        // JSON object containing the different values for the three circles drawn to represent the saturation dimension
        this.satCircles = {
            'brightness' : [
                100,
                0,
                100
            ],
            'alpha' : [
                0.1875,
                0.625,
                0.375
            ],
            'size' : [
                this.circleSize,
                this.circleSize/2,
                this.circleSize/4,
            ]
        }

        // horiVertMin and horiVertMax are values that determine the positions for the alternating points (between the center of a circle and its edge)
        // of the vertical and horizontal triangles used to represent the hue dimension
        this.horiVertMin = this.p.map(this.hueDegree, 0, 179, this.center, 0);
        this.horiVertMax = this.p.map(this.hueDegree, 0, 179, this.center, this.width);
        if(this.hueDegree > 179) {
            this.horiVertMin = 0;
            this.horiVertMax = this.width;
        }

        // diagonalMin and diagonalMax are values that determine the position for the alternating points (between the center of a circle and its edge)
        // of the diagonal triangles representing the hue dimension
        this.diagonalMin = this.p.map(this.hueDegree, 359, 180, (0 + this.width/8 + this.width/32), this.center);
        this.diagonalMax = this.p.map(this.hueDegree, 359, 180, (this.width - this.width/8 - this.width/32), this.center);

        // set up the JSON objects used to store all the x and y positions of the triangles that will be drawn when this is passed to the drawStar function
        this.positions = {
            'x1': [
                this.center - this.width/32,
                this.center - this.width/32,
                this.center,
                this.center + this.width/32,
                this.center - this.width/32,
                this.center - this.width/32,
                this.center,
                this.center + this.width/32,
            ],
            'y1': [
                this.center,
                this.center - this.width/32,
                this.center - this.width/32,
                this.center - this.width/32,
                this.center,
                this.center - this.width/32,
                this.center - this.width/32,
                this.center - this.width/32
            ],
            'x2': [
                this.center,
                this.diagonalMax,
                this.horiVertMax,
                this.diagonalMax,
                this.center,
                this.diagonalMin,
                this.horiVertMin,
                this.diagonalMin
            ],
            'y2': [
                this.horiVertMin,
                this.diagonalMin,
                this.center,
                this.diagonalMax,
                this.horiVertMax,
                this.diagonalMax,
                this.center,
                this.diagonalMin
            ],
            'x3': [
                this.center + this.width/32,
                this.center + this.width/32,
                this.center,
                this.center - this.width/32,
                this.center + this.width/32,
                this.center + this.width/32,
                this.center,
                this.center - this.width/32
            ],
            'y3': [
                this.center,
                this.center + this.width/32,
                this.center + this.width/32,
                this.center + this.width/32,
                this.center,
                this.center + this.width/32,
                this.center + this.width/32,
                this.center + this.width/32
            ]
        }
    }

    draw() {
        const currentTime = this.p.millis();
        if(currentTime < this.endTime){
            const scale = this.p.min(1, (currentTime - this.startTime) / (this.endTime - this.startTime)),
                dist = window.p5.Vector.sub(this.destination, this.origin).mult(scale),
                pos = window.p5.Vector.add(this.origin, dist);

            this.p.push();
            this.p.translate(pos.x, pos.y);
            this.p.rotate(this.rotation);
            
            // draw the circles that represent the saturation dimension
            this.p.stroke(0);
            for(var i = 0; i < 3; i++){
                this.p.fill(0, 0, this.satCircles['brightness'][i], this.satCircles['alpha'][i]);
                this.p.ellipse(this.center, this.center, this.satCircles['size'][i]);
            }

            // draw the octagon/pentagon that represents the brightness dimension
            this.p.fill(this.hue, 100, 100, this.brightnessTrans);
            this[this.shapeType](this.center, this.center, this.width / 3);

            //draw the stars that represent the hue dimension
            this.p.noStroke();
            this.p.angleMode(this.p.DEGREES);
            this.p.translate(this.center, this.center);
            this.p.rotate(this.hueDegree);

            const hsba = Array(this.hue, 100, 100, this.hueTrans);
            this.star(hsba, this.positions, 3);
            this.p.rotate(-this.hueDegree);
            this.p.translate(-this.center, -this.center);
            this.star(Array(0, 0, 100, 0.8), this.positions);

            this.p.rotate(-this.rotation);
            this.p.translate(-pos.x, -pos.y);
            this.p.pop();
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

    /**
     * function to draw a pentagon shape
     * adapted from: https://p5js.org/examples/form-regular-polygon.html
     * @param {Number} x  - x-coordinate of the hexagon
     * @param {Number} y  - y-coordinate of the hexagon
     * @param {Number} radius - radius of the hexagon
     */
    pentagon(x, y, radius) {
        this.p.angleMode(this.p.RADIANS);
        const angle = this.p.TWO_PI / 5;
        this.p.beginShape();
        for (let a = this.p.TWO_PI/10; a < this.p.TWO_PI + this.p.TWO_PI/10; a += angle) {
            const sx = x + this.p.cos(a) * radius;
            const sy = y + this.p.sin(a) * radius;
            this.p.vertex(sx, sy);
        }
        this.p.endShape(this.p.CLOSE);
        this.p.angleMode(this.p.DEGREES);
    }

    /**
     * function to draw the 8 triangles that repressnt the hue dimension 
     * the colour and transparency level of the triangles is also affected by the brightness dimension
     * @param {Array}  hsba       		- Array of values used to set the values for the fill function
     * @param {Object} positions    	- Object containing all the x and y positions of the 8 triangles that make up the star
     * @param {Number} sizeReducer   	- Variable that allows the star to drawn at smaller size, should be greater than 1  
     */
    star(hsba, positions, sizeReducer = 1) {
        this.p.fill(hsba[0], hsba[1], hsba[2], hsba[3]);
        for(let i = 0; i < 8; i++){
            this.p.triangle(
                positions['x1'][i]/sizeReducer, 
                positions['y1'][i]/sizeReducer, 
                positions['x2'][i]/sizeReducer, 
                positions['y2'][i]/sizeReducer, 
                positions['x3'][i]/sizeReducer, 
                positions['y3'][i]/sizeReducer
            );
        }
    }
}