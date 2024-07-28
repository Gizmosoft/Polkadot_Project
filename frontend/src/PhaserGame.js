// src/game/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import carImage from './assets/car1.png';
import trackImage from './assets/track.jpg'; // Ensure this path is correct

const PhaserGame = () => {
    const carRef = useRef(null); // Reference to store the car object
    const trackRef = useRef(null); // Reference to store the track object
    const speedRef = useRef(0); // Reference to store the car's speed
    const speedTextRef = useRef(null); // Reference to store the speed text object
    const timerTextRef = useRef(null); // Reference to store the timer text object
    const distanceTextRef = useRef(null); // Reference to store the distance text object
    const startTimeRef = useRef(null); // Reference to store the start time of the timer
    const timerStartedRef = useRef(false); // Reference to store if the timer has started
    const distanceRef = useRef(0); // Reference to store the distance traveled
    const MAX_SPEED = 20000;
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

            // Create a text object to display the speed
            const speedText = this.add.text(10, 10, 'Speed: 0', {
                fontSize: '32px',
                fill: '#fff'
            });
            speedTextRef.current = speedText;

            // Create a text object to display the timer
            const timerText = this.add.text(500, 10, 'Time: 0.00 s', {
                fontSize: '32px',
                fill: '#fff'
            });
            timerTextRef.current = timerText;

            // Create a text object to display the distance
            const distanceText = this.add.text(1000, 10, 'Distance: 0', {
                fontSize: '32px',
                fill: '#fff'
            });
            distanceTextRef.current = distanceText;

            this.cursors = this.input.keyboard.createCursorKeys();
        }

        function update(time, delta) {
            const car = carRef.current;
            const track = trackRef.current;
            const speedText = speedTextRef.current;
            const timerText = timerTextRef.current;
            const distanceText = distanceTextRef.current;
            let speed = speedRef.current;
            let distance = distanceRef.current;

            if (!car || !track) return;

            // Update the speed based on cursor keys
            if (this.cursors.right.isDown) {
                speed = Math.min(speed + ACCELERATION * (delta / 1000), MAX_SPEED); // Increase speed
                if (!timerStartedRef.current) {
                    // Start the timer when the car accelerates for the first time
                    startTimeRef.current = time;
                    timerStartedRef.current = true;
                }
            } else if (this.cursors.left.isDown) {
                speed = Math.max(speed - ACCELERATION * (delta / 1000), 0); // Decrease speed
            } else {
                speed = Math.max(speed - ACCELERATION * (delta / 1000), 0); // Decrease speed if no key is pressed. This will make the car stop naturally without any external force  
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

            // Update the speed display text
            speedText.setText(`Speed: ${Math.round(speed)}`);

            // Update the timer and distance display text
            if (timerStartedRef.current) {
                const elapsed = (time - startTimeRef.current) / 1000;
                timerText.setText(`Time: ${elapsed.toFixed(2)} s`);
                // Update the distance traveled
                distance += speed * (delta / 1000); // speed in pixels/second * time in seconds = distance in pixels
                distanceText.setText(`Distance: ${distance.toFixed(2)}`);
                distanceRef.current = distance;
            } else {
                timerText.setText('Time: 0.00 s');
                distanceText.setText('Distance: 0.00');
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
