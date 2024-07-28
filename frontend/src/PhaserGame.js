// src/game/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import carImage from './assets/car1.png';
import trackImage from './assets/track.jpg'; // Ensure this path is correct

const PhaserGame = () => {
    const carRef = useRef(null); // Reference to store the car object
    const trackRef = useRef(null); // Reference to store the track object
    const speedRef = useRef(0); // Reference to store the car's speed
    const MAX_SPEED = 1600;
    const ACCELERATION = 400; // Speed increment per second (10% of 160)

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
            this.load.image('car', carImage);
            this.load.image('track', trackImage);
        }

        function create() {
            // Create the tileSprite for the track and set its display size
            const trackHeight = window.innerHeight - 100; // Adjust the height to reduce the track size
            const track = this.add.tileSprite(
                window.innerWidth / 2,
                window.innerHeight / 2, // Position the track correctly
                window.innerWidth,
                trackHeight,
                'track'
            );
            track.setDisplaySize(window.innerWidth, trackHeight); // Adjust the size of the track to fit the screen width and reduced height
            trackRef.current = track;

            const car = this.physics.add.sprite(100, window.innerHeight / 2 + 200, 'car').setScale(0.25); // Adjust the car's position accordingly
            car.setCollideWorldBounds(true); // Prevent the car from moving out of the canvas bounds
            car.setAngle(-90); // Ensure the car faces the x-axis
            carRef.current = car;

            this.cursors = this.input.keyboard.createCursorKeys();
        }

        function update(time, delta) {
            const car = carRef.current;
            const track = trackRef.current;
            let speed = speedRef.current;

            if (!car || !track) return;

            // Update the speed based on cursor keys
            if (this.cursors.right.isDown) {
                speed = Math.min(speed + ACCELERATION * (delta / 1000), MAX_SPEED); // Increase speed
            } else if (this.cursors.left.isDown) {
                speed = Math.max(speed - ACCELERATION * (delta / 1000), 0); // Decrease speed
            }

            // Apply speed to the track only, keep the car stationary
            car.setVelocityX(0);
            track.tilePositionX += speed * (delta / 1000); // Move the track in the opposite direction

            // Move car up and down
            if (this.cursors.up.isDown) {
                car.setVelocityY(-160); // Move car up
            } else if (this.cursors.down.isDown) {
                car.setVelocityY(160); // Move car down
            } else {
                car.setVelocityY(0); // Stop vertical movement
            }

            // Store the current speed
            speedRef.current = speed;
        }

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="phaser-game" />;
};

export default PhaserGame;
