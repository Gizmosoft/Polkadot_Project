import React, { useEffect, useRef, useState } from 'react';
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
    const levelTextRef = useRef(null); // Reference to store the level text object
    const distanceRef = useRef(0); // Reference to store the distance traveled
    const timeLeftRef = useRef(null); // Reference to store the time left for the level
    const timerStartedRef = useRef(false); // Reference to store if the timer has started
    const currentLevelRef = useRef(0); // Reference to store the current level
    const startTimeRef = useRef(null); // Reference to store the start time of the timer
    const [showNextLevelButton, setShowNextLevelButton] = useState(false);
    const [gameInstance, setGameInstance] = useState(null);

    const MAX_SPEED = 2000;
    const ACCELERATION = 400; // Speed increment per second (10% of 160)
    // const BOUNDARY_LEFT = 50;
    // const BOUNDARY_RIGHT = window.innerWidth - 50;
    const BOUNDARY_TOP = 550;
    const BOUNDARY_BOTTOM = window.innerHeight - 250;

    const LEVELS = [
        { distance: 10000, time: 30 }, // Level 1: 1000 units in 30 seconds
        { distance: 20000, time: 60 }, // Level 2: 2000 units in 60 seconds
        { distance: 30000, time: 90 }  // Level 3: 3000 units in 90 seconds
    ];


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

            // Create text objects to display speed, timer, distance, and level
            const speedText = this.add.text(10, 10, 'Speed: 0', {
                fontSize: '32px',
                fill: '#fff'
            });
            speedTextRef.current = speedText;

            const timerText = this.add.text(500, 10, 'Time Left: 0.00', {
                fontSize: '32px',
                fill: '#fff'
            });
            timerTextRef.current = timerText;

            const distanceText = this.add.text(1000, 10, 'Distance: '+ LEVELS[currentLevelRef.current].distance, {
                fontSize: '32px',
                fill: '#fff'
            });
            distanceTextRef.current = distanceText;

            const levelText = this.add.text(1500, 10, 'Level: 1', {
                fontSize: '32px',
                fill: '#fff'
            });
            levelTextRef.current = levelText;

            this.cursors = this.input.keyboard.createCursorKeys();

            startNextLevel(this.scene.game);
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
                speed = Math.max(speed - ACCELERATION * (delta / 500), 0); // Decrease speed
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

            if (car.y < BOUNDARY_TOP) {
                car.y = BOUNDARY_TOP;
            } else if (car.y > BOUNDARY_BOTTOM) {
                car.y = BOUNDARY_BOTTOM;
            }

            // Update the speed display text
            speedText.setText(`Speed: ${Math.round(speed)}`);

            // Update the timer and distance display text
            if (timerStartedRef.current) {
                const elapsed = (time - startTimeRef.current) / 1000;
                timeLeftRef.current -= (delta / 1000);
                timerText.setText(`Time Left: ${timeLeftRef.current.toFixed(2)}`);
                // Update the distance traveled
                distance += speed * (delta / 1000); // speed in pixels/second * time in seconds = distance in pixels
                distanceText.setText(`Distance: ${LEVELS[currentLevelRef.current].distance.toFixed(2) - distance.toFixed(2)}`);
                distanceRef.current = distance;

                // Check if the level is completed
                if (distance >= LEVELS[currentLevelRef.current].distance) {
                    currentLevelRef.current++;
                    if (currentLevelRef.current < LEVELS.length) {
                        setShowNextLevelButton(true);
                        distanceText.setText(`Distance: 0`);
                        this.scene.pause();
                    } else {
                        // Game completed
                        distanceText.setText(`Distance: 0`);
                        timerText.setText('Game Completed!');
                        this.scene.pause();
                    }
                }

                // Check if time is up
                if (timeLeftRef.current <= 0) {
                    // Restart the level
                    startNextLevel(this);
                }
            } else {
                timerText.setText(`Time Left: ${LEVELS[currentLevelRef.current].time.toFixed(2)}`);
                distanceText.setText('Distance: 0');
            }

            // Store the current speed
            speedRef.current = speed;
        }

        const game = new Phaser.Game(config);
        setGameInstance(game);

       

        return () => {
            game.destroy(true);
        };
    }, []);

   
    const startNextLevel = (game) => {
        const currentLevel = LEVELS[currentLevelRef.current];
        distanceRef.current = 0;
        timeLeftRef.current = currentLevel.time;
        timerStartedRef.current = false;
    
        // Update level display
        if (levelTextRef.current) levelTextRef.current.setText(`Level: ${currentLevelRef.current + 1}`);
        if (timerTextRef.current) timerTextRef.current.setText(`Time Left: ${currentLevel.time.toFixed(2)}`);
        if (distanceTextRef.current) distanceTextRef.current.setText('Distance: 0');
        setShowNextLevelButton(false);
    
        if (game) {
            game.scene.scenes[0].scene.restart(); // Restart the scene to reset its state
        }
    };


    const handleNextLevelClick = () => {
        setShowNextLevelButton(false);
        startNextLevel(gameInstance);
    };

    return (
        <div id="phaser-game-container">
            {showNextLevelButton && (
                <button
                    onClick={handleNextLevelClick}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '10px 20px',
                        fontSize: '24px',
                        zIndex: 1
                    }}
                >
                    Next Level
                </button>
            )}
            <div id="phaser-game" />
        </div>
    );
};

export default PhaserGame;
