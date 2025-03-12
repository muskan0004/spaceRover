/* /// Initialize joystick
var joystick = nipplejs.create({
    zone: document.getElementById('joystick'),
    mode: 'static',
    position: { left: '75px', top: '75px' }, // Center position within the div
    color: 'blue'
});

// // Listen for movement events
// joystick.on('move', function (evt, data) {
//     if (data) {
//         console.log('Direction:', data.direction ? data.direction.angle : 'None');
//         console.log('Distance:', data.distance);
//     }
// });

// joystick.on('end', function () {
//     console.log('Joystick released');
// });  
let sliderValues = [90, 90, 90, 90,90,90];  
// Handle the release event
joystick.on('end', function () {
    console.log('Joystick released');
    // Optional: Send a stop command or reset command to ESP32 here if required
});

      
// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.89.76:81');  // Change to your ESP32's IP



// Update slider value and send real-time data to ESP32
function updateAndSend(sliderIndex) {
const value = document.getElementById(slider${sliderIndex}).value;
document.getElementById(value${sliderIndex}).textContent = value;

if(sliderIndex >2) sliderValues[sliderIndex - 1] = value;
//for 1 &2 servo sending opposite
//1. grapler and 2. last motor 
if (sliderIndex ==1) sliderValues[sliderIndex - 1] = 60 - value; 
else sliderValues[sliderIndex - 1] = 180 - value;
// Send the updated slider values to ESP32 in real-time
const data = {
  slider1: sliderValues[0],
  slider2: sliderValues[1],
  slider3: sliderValues[2],
  slider4: sliderValues[3],
  slider5: sliderValues[4],
  slider6: sliderValues[5]
};

if (socket.readyState === WebSocket.OPEN) {
  socket.send(JSON.stringify(data));
  console.log('Sent slider values to ESP32:', data);
} else {
  console.log('WebSocket not connected yet');
}

    // const value = document.getElementById(slider${sliderIndex}).value;
    // document.getElementById(value${sliderIndex}).textContent = value;

    // // Assign values for the correct slider array index
    // if (sliderIndex >= 1 && sliderIndex <= 6) {
    //     sliderValues[sliderIndex - 1] = parseInt(value);
    // }

    // const data = {
    //     type: 'sliders',
    //     sliders: sliderValues
    // };

    // if (socket.readyState === WebSocket.OPEN) {
    //     socket.send(JSON.stringify(data));
    //     console.log('Sent slider values to ESP32:', data);
    // } else {
    //     console.log('WebSocket not connected yet');
    // }


}
// Listen for joystick movement events
joystick.on('move', function (evt, data) {
    if (data) {
        const direction = data.direction ? data.direction.angle : 'None';
        const distance = data.distance;

        console.log('Joystick Direction:', direction);
        console.log('Joystick Distance:', distance);

        // Send joystick data to ESP32
        if (socket.readyState === WebSocket.OPEN) {
            const joystickData = {
                type: 'joystick',
                direction: direction,
                distance: distance
            };
            socket.send(JSON.stringify(joystickData));
            console.log('Sent joystick data to ESP32:', joystickData);
        }
    }
});

// Handle the release event for joystick
joystick.on('end', function () {
    console.log('Joystick released');
    if (socket.readyState === WebSocket.OPEN) {
        const joystickData = {
            type: 'joystick',
            direction: 'center', // Reset to center
            distance: 0
        };
        socket.send(JSON.stringify(joystickData));
        console.log('Sent joystick release data to ESP32:', joystickData);
    }
});

// WebSocket event listeners
socket.addEventListener('open', function (event) {
    console.log('WebSocket connected');
});

socket.addEventListener('message', function (event) {
    console.log('Received from ESP32:', event.data);
    // Parse the received data
    const data = JSON.parse(event.data);
    document.getElementById('temperature').textContent = data.temperature;
    document.getElementById('humidity').textContent = data.humidity;
});

socket.addEventListener('close', function (event) {
    console.log('WebSocket closed');
});

// Function to send command to ESP32
function sendCommand() {
    const command = document.getElementById('commandInput').value;
    if (command) {
        socket.send(command);
        console.log('Sent to ESP32:', command);
    }
} 
function retractArm() {
    const retractCommand = JSON.stringify({ command: "retract" });
    webSocket.send(retractCommand);
} */



/// Initialize joystick
var joystick = nipplejs.create({
    zone: document.getElementById('joystick'),
    mode: 'static',
    position: { left: '75px', top: '75px' }, // Center position within the div
    color: 'blue'
});

let sliderValues = [90, 90, 90, 90, 90, 90]; // Initialize all slider values to 90

// Create WebSocket connection
const socket = new WebSocket('ws://192.168.123.76:81');  // Change to your ESP32's IP //192.168.123.76 narzo //192.168.89.76:81

// Function to update slider value and send real-time data to ESP32
function updateAndSend(sliderIndex) {
    const value = document.getElementById(slider${sliderIndex}).value;
    document.getElementById(value${sliderIndex}).textContent = value;

    if (sliderIndex == 1) sliderValues[sliderIndex - 1] = 60 - value; // Custom behavior for slider 1
    else if (sliderIndex == 2) sliderValues[sliderIndex - 1] = 180 - value; // Custom behavior for slider 2

    else sliderValues[sliderIndex - 1] = parseInt(value); // Standard assignment for other sliders

    // Construct data object to send
    const data = {
        slider1: sliderValues[0],
        slider2: sliderValues[1],
        slider3: sliderValues[2],
        slider4: sliderValues[3],
        slider5: sliderValues[4],
        slider6: sliderValues[5]
    };

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
        console.log('Sent slider values to ESP32:', data);
    } else {
        console.log('WebSocket not connected yet');
    }
}

// Listen for joystick movement events
joystick.on('move', function (evt, data) {
    if (data) {
        const direction = data.direction ? data.direction.angle : 'None';
        const distance = data.distance;
        
        console.log('Joystick Direction:', direction);
        console.log('Joystick Distance:', distance);

        // Send joystick data to ESP32
        if (socket.readyState === WebSocket.OPEN) {
            const joystickData = {
                type: 'joystick',
                direction: direction,
                distance: distance
            };
            socket.send(JSON.stringify(joystickData));
            console.log('Sent joystick data to ESP32:', joystickData);
        }
    }
});

// Handle joystick release event
joystick.on('end', function () {
    console.log('Joystick released');
    if (socket.readyState === WebSocket.OPEN) {
        const joystickData = {
            type: 'joystick',
            direction: 'center', // Reset to center
            distance: 0
        };
        socket.send(JSON.stringify(joystickData));
        console.log('Sent joystick release data to ESP32:', joystickData);
    }
});

// WebSocket event listeners
socket.addEventListener('open', function (event) {
    console.log('WebSocket connected');
});

socket.addEventListener('message', function (event) {
    console.log('Received from ESP32:', event.data);
    // Parse and display the received data
    const data = JSON.parse(event.data);
    if (data.temperature && data.humidity) {
        document.getElementById('temperature').textContent = data.temperature;
        document.getElementById('humidity').textContent = data.humidity;
        document.getElementById('obs').textContent = data.obs;
        document.getElementById('pos').textContent = data.obstacle_position;
    }
});

socket.addEventListener('close', function (event) {
    console.log('WebSocket closed');
});

// Function to send general commands to ESP32
function sendCommand() {
    const command = document.getElementById('commandInput').value;
    if (command) {
        socket.send(command);
        console.log('Sent to ESP32:', command);
    }
}

// Function to retract arm with slow-motion effect (one by one from slider 6 to slider 1)
function retractArm() {
    const retractValues = [0, 0, 0, 83, 0, 0];
    let index = 5;  // Start from the last slider

    const interval = setInterval(() => {
        sliderValues[index] = retractValues[index];
        const data = {
            slider1: sliderValues[0],
            slider2: sliderValues[1],
            slider3: sliderValues[2],
            slider4: sliderValues[3],
            slider5: sliderValues[4],
            slider6: sliderValues[5]
        };

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
            console.log('Sent retract command to ESP32:', data);
        }

        if (index === 0) {
            clearInterval(interval); // Stop once all sliders are retracted
        } else {
            index--;
        }
    }, 500); // Adjust delay (500ms) as desired for slower or faster motion
}


////Radar code here

const radarCanvas = document.getElementById('radarCanvas');
radarCanvas.width = radarCanvas.offsetWidth;
radarCanvas.height = radarCanvas.offsetHeight;
const radarContext = radarCanvas.getContext('2d');
const radarRadius = Math.min(radarCanvas.width,radarCanvas.height) ; // Use half the height for radius (half circle)

// Radar sweep parameters
let sweepAngle = 0;
const sweepSpeed = 1; // Degrees per frame
const maxSweepAngle = 180; // Limit to 180 degrees for half-circle radar
let sweepDirection = 1; // 1 for sweeping forward (0 to 180), -1 for sweeping backward (180 to 0)

// Maximum distance (200 cm)
const maxDistance = 50; // in cm (maps to the full radar radius)

let obstaclePosition = null; // Store the angle of the obstacle
let obstacleDistance = null; // Store the distance of the obstacle (in cm)

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    obstaclePosition = data.obstacle_position; // Get position from received data
    obstacleDistance = data.obstacle_distance; // Get distance from received data (in cm)
    document.getElementById('temperature').textContent = `${data.temperature} `;  // Display total weight
    document.getElementById('humidity').textContent = `${data.humidity} `;  // Display total weight
};

function drawRadar() {
    radarContext.clearRect(0, 0, radarCanvas.width, radarCanvas.height);

    // Draw radar grid lines
    radarContext.strokeStyle = '#444';
    radarContext.lineWidth = 1;
    for (let i = 1; i <=4; i++) {
        radarContext.beginPath();
        radarContext.arc(radarCanvas.width / 2, radarCanvas.height, radarRadius * (i / 4), Math.PI, 2 * Math.PI);
        radarContext.stroke();
    }

    // Draw angle lines
    radarContext.strokeStyle = '#444';
    for (let angle = 0; angle <= maxSweepAngle; angle += 15) {
        const radian = (angle * Math.PI) / 180;
        const x = radarCanvas.width / 2 + radarRadius * Math.cos(radian);
        const y = radarCanvas.height - radarRadius * Math.sin(radian);

        radarContext.beginPath();
        radarContext.moveTo(radarCanvas.width / 2, radarCanvas.height);
        radarContext.lineTo(x, y);
        radarContext.stroke();
    }

    // Draw radar sweep (green lines)
    const sweepRadian = (sweepAngle * Math.PI) / 180;
    const sweepX = radarCanvas.width / 2 + radarRadius * Math.cos(sweepRadian);
    const sweepY = radarCanvas.height - radarRadius * Math.sin(sweepRadian);

    radarContext.strokeStyle = 'rgba(0, 255, 0, 0.7)';
    radarContext.lineWidth = 2;
    radarContext.beginPath();
    radarContext.moveTo(radarCanvas.width / 2, radarCanvas.height);
    radarContext.lineTo(sweepX, sweepY);
    radarContext.stroke();

    // If obstacle position and distance are available, draw the red dot
    if (obstaclePosition !== null && obstacleDistance !== null) {
        // Convert obstacle distance (cm) to the radar canvas' scale (pixels)
        const scaledDistance = Math.min(obstacleDistance, maxDistance); // Ensure the distance doesn't exceed maxDistance
        const obstacleRadius = (scaledDistance / maxDistance) * radarRadius; // Map distance to radar radius

        const obstacleRadian = (obstaclePosition * Math.PI) / 180; // Convert angle to radians
        const obstacleX = radarCanvas.width / 2 + obstacleRadius * Math.cos(obstacleRadian); // Calculate x based on scaled distance
        const obstacleY = radarCanvas.height - obstacleRadius * Math.sin(obstacleRadian); // Calculate y based on scaled distance

        radarContext.fillStyle = 'red'; // Red dot for obstacle
        radarContext.beginPath();
        radarContext.arc(obstacleX, obstacleY, 5, 0, 2 * Math.PI); // Draw the red dot at obstacle position
        radarContext.fill();
    }

    // Update sweep angle and direction
    sweepAngle += sweepSpeed * sweepDirection;

    // Reverse direction when hitting 0 or 180 degrees
    if (sweepAngle >= maxSweepAngle || sweepAngle <= 0) {
        sweepDirection *= -1; // Reverse direction
    }

    requestAnimationFrame(drawRadar);
}

// Start the radar animation
drawRadar();