// src/game/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import carImage from './assets/car1.png';

const PhaserGame = () => {
    const carRef = useRef(null); // Reference to store the car object
    const lastDirection = useRef({ velocityX: 0, velocityY: 0, angle: 0 }); // Reference to store the last direction

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false // Disable debug mode
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        function preload() {
            // this.load.image('track', trackImage);
            this.load.image('car', carImage);
        }

        function create() {
            this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'track');
            const car = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'car').setScale(0.25);
            car.setCollideWorldBounds(true); // Prevent the car from moving out of the canvas bounds
            carRef.current = car;

            this.cursors = this.input.keyboard.createCursorKeys();
        }

        function update() {
            const car = carRef.current;

            if (!car) return;

            // Stop the car's movement initially
            car.setVelocity(0);

            // Set the car's velocity and angle based on the cursor keys' state
            if (this.cursors.left.isDown) {
                car.setVelocityX(-160);
                car.setAngle(-90);
                lastDirection.current = { velocityX: -160, velocityY: 0, angle: -90 };
            } else if (this.cursors.right.isDown) {
                car.setVelocityX(160);
                car.setAngle(90);
                lastDirection.current = { velocityX: 160, velocityY: 0, angle: 90 };
            } else if (this.cursors.up.isDown) {
                car.setVelocityY(-160);
                car.setAngle(0);
                lastDirection.current = { velocityX: 0, velocityY: -160, angle: 0 };
            } else if (this.cursors.down.isDown) {
                car.setVelocityY(160);
                car.setAngle(180);
                lastDirection.current = { velocityX: 0, velocityY: 160, angle: 180 };
            } else {
                // Retain the last direction
                car.setVelocity(lastDirection.current.velocityX, lastDirection.current.velocityY);
                car.setAngle(lastDirection.current.angle);
            }
        }

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-game" />;
};

export default PhaserGame;
