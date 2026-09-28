// element as input taken from Html
const messageInput = document.getElementById("message");
const encodeButton = document.getElementById("encodeButton");
const binaryOutput = document.getElementById("binaryOutput");
const encodingSelect = document.getElementById("encoding");
const encodingTitle = document.getElementById("encodingTitle");



//binary to text 
function textToBinary(text) {
    let binary = "";

    for (let i = 0; i < text.length; i++) {
        let ascii = text.charCodeAt(i);
        let binaryCharacter = ascii.toString(2).padStart(8, "0");

        binary += binaryCharacter + " ";
    }

    return binary.trim();
}
// polar NRZL
function polarNRZL(binary) {

    let signal = [];

    for (let bit of binary) {

        if (bit === "1") {
            signal.push(1);
        } else if (bit === "0") {
            signal.push(-1);
        }
    }

    return signal;
}
// polarNRZI
function polarNRZI(binary) {

    let signal = [];

    let currentLevel = -1;

    for (let bit of binary) {

        if (bit === "1") {
            currentLevel = -currentLevel;
        }

        signal.push(currentLevel);
    }

    return signal;
}

//polarRZ
function polarRZ(binary) {

    let signal = [];

    for (let bit of binary) {

        if (bit === "1") {
            signal.push(1);
            signal.push(0);
        } else {
            signal.push(-1);
            signal.push(0);
        }
    }

    return signal;
}

//manchester encoder
function manchester(binary) {

    let signal = [];

    for (let bit of binary) {

        if (bit === "1") {
            signal.push(-1);
            signal.push(1);
        } else {
            signal.push(1);
            signal.push(-1);
        }
    }

    return signal;
}

//AMI encoder
function bipolarAMI(binary) {

    let signal = [];

    let lastPolarity = -1;

    for (let bit of binary) {

        if (bit === "0") {

            signal.push(0);

        } else {

            lastPolarity = -lastPolarity;

            signal.push(lastPolarity);
        }
    }

    return signal;
}

//pseudoternary 
function pseudoternary(binary) {

    let signal = [];

    let lastPolarity = -1;

    for (let bit of binary) {

        if (bit === "1") {

            signal.push(0);

        } else {

            lastPolarity = -lastPolarity;

            signal.push(lastPolarity);
        }
    }

    return signal;
}

// draw wave form 
function drawWaveform(signal, binary, samplesPerBit) {

    const canvas = document.getElementById("waveform");
    const ctx = canvas.getContext("2d");

    const bitWidth = 80;
    const sampleWidth = bitWidth/samplesPerBit;

    // Make canvas wide enough for all bits
    const totalBits = binary.length;
    canvas.width = Math.max(800, signal.length * bitWidth);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Voltage positions on the screen
    const highY = 70;
    const zeroY = 150;
    const lowY = 230;

    // Convert signal level to canvas Y position
    function getY(level) {

        if (level === 1) {
            return highY;
        }

        if (level === 0) {
            return zeroY;
        }

        return lowY;
    }

    // Draw reference voltage lines
    ctx.strokeStyle="#d0d0d0";//pen color
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, highY);
    ctx.lineTo(canvas.width, highY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(canvas.width, zeroY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, lowY);
    ctx.lineTo(canvas.width, lowY);
    ctx.stroke();
    

    // Voltage labels

    ctx.fillText("+V (HIGH)", 10, highY - 10);
    ctx.fillText("0V (ZERO)", 10, zeroY - 10);
    ctx.fillText("-V (LOW)", 10, lowY + 20);

    let previousY = null;

    for (let i = 0; i < signal.length; i++) {

        const currentY = getY(signal[i]);

        const x = i * sampleWidth;

        // Draw bit boundary
        ctx.strokeStyle = '#e5e5e5';//pen color change
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 250);
        ctx.stroke();

        // Draw vertical transition

        ctx.strokeStyle = '#000000';//pen color change
        if (previousY !== null && previousY !== currentY) {

            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, previousY);
            ctx.lineTo(x, currentY);
            ctx.stroke();
        }

        // Draw horizontal signal level

        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, currentY);
        ctx.lineTo(x + sampleWidth, currentY);
        ctx.stroke();

        // Draw bit value
        if (i % samplesPerBit === 0){
            const bitIndex = Math.floor(i/samplesPerBit);
            const bitCenterX = bitIndex*bitWidth+bitWidth/2
            ctx.fillText(binary[bitIndex], bitCenterX, 275);
        }
        //Draw time label

        for (let i = 0; i <= totalBits; i++) {

            const timeX = i * bitWidth;

            ctx.fillText("t" + i, timeX, 315);
        }

        previousY = currentY;

        
    }

    // Final boundary

    const finalX = signal.length * bitWidth;
    ctx.strokeStyle = '#e5e5e5';//pen color change
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(finalX, 40);
    ctx.lineTo(finalX, 250);
    ctx.stroke();
    ctx.fillText("t" + signal.length, finalX , 315);

}

// Encode button
encodeButton.addEventListener("click", function () {

    let message = messageInput.value;

    let binary = textToBinary(message);

    let selectedEncoding = encodingSelect.value;
    let samplesPerBit = 1;

    binaryOutput.textContent = binary;

    let encodedSignal;
    if (selectedEncoding === "nrz-l"){
        encodedSignal = polarNRZL(binary.replaceAll(" ", ""));//nrzl encoding    
    }
     else if (selectedEncoding === "nrz-i"){
        encodedSignal = polarNRZI(binary.replaceAll(" ",""));//nrzi ecoding
    }
     else if (selectedEncoding === "rz"){
        encodedSignal = polarRZ(binary.replaceAll(" ",""));//rz ecoding
        samplesPerBit = 2;
    }
    else if (selectedEncoding === "manchester"){
        encodedSignal = manchester(binary.replaceAll(" ",""));//manchester ecoding
        samplesPerBit = 2;
    }
    else if (selectedEncoding === "ami"){
        encodedSignal = bipolarAMI(binary.replaceAll(" ",""));//ami encoding
    }
    else if (selectedEncoding === "pseudoternary"){
        encodedSignal = pseudoternary(binary.replaceAll(" ",""));//pseudoternary encoding
    }

    //econding title change based on selected encoding
    if (selectedEncoding === "nrz-l") {
        encodingTitle.textContent = "Encoded Signal -- Polar NRZ-L";
    }
    else if (selectedEncoding === "nrz-i") {
        encodingTitle.textContent = "Encoded Signal -- Polar NRZ-I";
    } 
    else if (selectedEncoding === "rz") {
        encodingTitle.textContent = "Encoded Signal -- Polar RZ";
    }
    else if (selectedEncoding === "manchester") {
        encodingTitle.textContent = "Encoded Signal -- Manchester";
    }  
    else if (selectedEncoding === "ami") {
        encodingTitle.textContent = "Encoded Signal -- Bipolar AMI";
    }
    else if(selectedEncoding === "pseudoternary"){
        encodingTitle.textContent = "Encoded Signal -- Pseudoternary";
    }

    drawWaveform(encodedSignal,binary.replaceAll(" ",""),samplesPerBit);//waveform

    console.log("Binary:", binary);
    console.log("Polar NRZ-L:", encodedSignal);
    console.log("Encoded Signal:",encodedSignal);
    console.log("Selected Encoding:",selectedEncoding);
});
