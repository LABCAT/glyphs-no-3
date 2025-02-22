import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';

import CircleGlyph from './classes/CircleGlyph.js';
import LABCATGlyph from './classes/LABCATGlyph.js';
import HexagonGlyph from './classes/HexagonGlyph.js';
import TriangleGlyph from './classes/TriangleGlyph.js';

import audio from "../audio/glyphs-no-3.ogg";
import midi from "../audio/glyphs-no-3.mid";

/**
 * Glyphs No. 3
 */
const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.bpm = 112.444;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[8].notes; // Massive - 64ER LEAD
                    p.scheduleCueSet(noteSet1, 'executeCueSet1', true);
                    const noteSet2 = result.tracks[14].notes; // Combinator 1 - Touch Orchestra
                    p.scheduleCueSet(noteSet2, 'executeCueSet2'); 
                    const noteSet3 = result.tracks[21].notes; // Wave - Multichord
                    p.scheduleCueSet(noteSet3, 'executeCueSet3'); 
                    const noteSet4 = Object.assign({},result.tracks[23].controlChanges); // Wave - Multichord - Filter 6
                    p.scheduleCueSet(noteSet4[Object.keys(noteSet4)[0]], 'executeCueSet4'); 
                    const noteSet5 = result.tracks[10].notes; // Combinator 2 - Mysterious Glock
                    p.scheduleCueSet(noteSet5, 'executeCueSet5');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.background(0);
            p.colorMode(p.HSB);
            p.rectMode(p.CENTER);
            p.angleMode(p.DEGREES);
            p.bgHue = p.random(0, 360);
        }

        p.animatedGlyphs = [];

        p.animatedGlyphs2 = [];

        p.bgHue = 0;

        p.bgOpacity = 0.9;

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                p.background(p.bgHue, 100, 50, p.bgOpacity);
                for (let i = 0; i < p.animatedGlyphs.length; i++) {
                    const glyph = p.animatedGlyphs[i];
                    glyph.update();
                    glyph.draw();
                }

                for (let i = 0; i < p.animatedGlyphs2.length; i++) {
                    const glyph = p.animatedGlyphs2[i];
                    glyph.update();
                    glyph.draw();
                }
            }
        }

        p.circleGlyphScale = 0;

        p.circleGlyphDarkMode = 0; 

        p.executeCueSet1 = (note) => {
            const { currentCue, midi }  = note;
            const variation = p.random(-p.width / 24, p.width / 24);
            const x = p.width / 2 + variation;
            const y = p.height / 2  + variation;
            const size = p.random(p.width / 32, p.width / 64);
            const maxSize = p.width / 16;
            const intervalPerNote = 20;

            if(currentCue % 62 === 1) {
                p.circleGlyphScale++;
            }

            if(midi < 67) {
                for (let index = 0; index < 8; index++) {
                    setTimeout(() => {
                        p.animatedGlyphs.push(
                            new CircleGlyph(
                                p, 
                                x, 
                                y, 
                                maxSize / p.circleGlyphScale, 
                                size / p.circleGlyphScale, 
                                p.circleGlyphDarkMode
                            )
                        );
                    }, intervalPerNote * index);
                }
                p.circleGlyphDarkMode = !p.circleGlyphDarkMode;
            }            
        }

        p.executeCueSet2 = (note) => {
            const { currentCue } = note;
            const size = p.random(p.height / 4, p.width / 4);
            const x = p.width / 2;
            const y = p.height / 2;

            if(currentCue === 1){
                p.animatedGlyphs = [];
                p.bgHue = p.random(0, 360);
            }
            
            p.animatedGlyphs2.push(
                new TriangleGlyph(p, x, y, size)
            );            
        }

        p.executeCueSet3 = (note) => {
            const { currentCue, durationTicks } = note;
            const variation = p.random(-p.width / 64, p.width / 64);
            const x = p.width / 2 + variation;
            const y = p.height / 2  + variation;
            const maxSize = p.width / 32;
            const numberOfNotes = durationTicks > 10000 ? 56 : 8;
            // Calculate milliseconds per tick
            const millisecondsPerTick = 60000 / (p.bpm * p.PPQ);
            // Calculate total duration in milliseconds
            const totalDurationMs = millisecondsPerTick * durationTicks;
            // Calculate interval per note
            const intervalPerNote = totalDurationMs / numberOfNotes;

            if(currentCue >= 18) {
                for (let index = 0; index < numberOfNotes; index++) {
                    setTimeout(() => {
                        p.animatedGlyphs.push(
                            new HexagonGlyph(
                                p, 
                                x, 
                                y, 
                                maxSize,
                                maxSize / 4,
                                durationTicks > 10000
                            )
                        );
                    }, intervalPerNote * index);
                }
            }
        }

        p.starGlyphOpacity = 0;

        p.executeCueSet4 = (note) => {
            const { currentCue } = note;
            if(currentCue <= 2048) {
                p.starGlyphOpacity = note.value;
            }
        }

        p.executeCueSet5 = (note) => {
            const { currentCue } = note;

            const delay = (60000 / p.bpm) / 4 * 3;

            setTimeout(() => {
                const variation = p.random(-p.width / 24, p.width / 24);
                let size = p.width / 2;
                let shapeType = p.random(['octagon', 'pentagon']);
                let x = p.random(p.width / 3, p.width - (p.width / 3));
                let y = p.random(p.height / 3, p.height - (p.height / 3));

                if(currentCue % 6 === 1){
                    p.bgHue = p.random(0, 360);
                    if(currentCue < 18) {
                        p.animatedGlyphs = [];
                    }
                }

                p.animatedGlyphs2.push(
                    new LABCATGlyph(p, x, y, size, shapeType)
                );

                if(currentCue > 18) {
                    x = p.width / 2 + variation;
                    y = p.height / 2  + variation;
                    size = p.random(p.width / 8, p.width / 12);
                    const intervalPerNote = 50;
                    for (let index = 0; index < 8; index++) {
                        setTimeout(() => {
                            p.animatedGlyphs2.push(
                                new LABCATGlyph(p, x, y, size, shapeType)
                            );
                        }, intervalPerNote * index);
                    }
                }  
            }, delay);
        };

        p.hasStarted = false;

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                        if (typeof window.dataLayer !== typeof undefined){
                            window.dataLayer.push(
                                { 
                                    'event': 'play-animation',
                                    'animation': {
                                        'title': document.title,
                                        'location': window.location.href,
                                        'action': 'replaying'
                                    }
                                }
                            );
                        }
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                    if (typeof window.dataLayer !== typeof undefined && !p.hasStarted){
                        window.dataLayer.push(
                            { 
                                'event': 'play-animation',
                                'animation': {
                                    'title': document.title,
                                    'location': window.location.href,
                                    'action': 'start playing'
                                }
                            }
                        );
                        p.hasStarted = false
                    }
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
