import { TrikiController } from "triki-controller";
import OSC from "osc-js";
import { WebMidi } from "webmidi";

if (!TrikiController.isSupported()) {
  throw new Error("This browser has no Web Bluetooth.");
}

const triki = new TrikiController({ fusion: true, rateHz: 26 });
const osc = new OSC();

var connectionState = null;
var orientationOutput = "";
var gyroOutput = "";
var accelOutput = "";
var midiOutputDeviceName = null;
var midiOutputChannel = 1;
var sendOrientation = true;
var rollControllerNumber = 4;
var pitchControllerNumber = 5;
var yawControllerNumber = 6;
var sendGyro = false;
var gyroXControllerNumber = 7;
var gyroYControllerNumber = 8;
var gyroZControllerNumber = 9;
var sendAccel = false;
var accelXControllerNumber = 10;
var accelYControllerNumber = 11;
var accelZControllerNumber = 12;


osc.open(); // connect by default to ws://localhost:8080

triki.on("connectionchange", (state) => {
  console.log("state:", state); // "disconnected" | "pairing" | "streaming"
  if(connectionState != state) {
    connectionState = state;
    document.getElementById("status").innerText = "status: " + connectionState;
  }
});

triki.on("frame", (f) => {
  // f.gyro = { x, y, z } in deg/s, f.accel = { x, y, z } in g, f.t = ms
  // console.log("frame", f.gyro)
  gyroOutput = "gyro x: " + round(f.gyro.x) + ", y: " + round(f.gyro.y) + ", z: " + round(f.gyro.z);
  document.getElementById("gyroOutput").innerHTML = gyroOutput;

  accelOutput = "accel x: " + round(f.accel.x) + ", y: " + round(f.accel.y) + ", z: " + round(f.accel.z);
  document.getElementById("accelOutput").innerHTML = accelOutput;

  if (osc.status() === 1 && sendGyro) {
    var message = new OSC.Message('/gyro', f.gyro.x, f.gyro.y, f.gyro.z);
    osc.send(message);
  }

  if (osc.status() === 1 && sendAccel) {
    var message = new OSC.Message('/accel', f.accel.x, f.accel.y, f.accel.z);
    osc.send(message);
  }

  if (midiOutputDeviceName && sendGyro) {
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(gyroXControllerNumber, gyroToCC(f.gyro.x));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(gyroYControllerNumber, gyroToCC(f.gyro.y));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(gyroZControllerNumber, gyroToCC(f.gyro.z));
  }

  if (midiOutputDeviceName && sendAccel) {
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(accelXControllerNumber, accelToCC(f.accel.x));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(accelYControllerNumber, accelToCC(f.accel.y));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(accelZControllerNumber, accelToCC(f.accel.z));
  }
});

triki.on("orientation", (o) => {
  // o.quaternion = [w, x, y, z] (right-handed), o.euler = { roll, pitch, yaw } in degrees
  // console.log("orientation", o.euler);
  orientationOutput = "roll: " + round(o.euler.roll) + ", pitch: " + round(o.euler.pitch) + ", yaw: " + round(o.euler.yaw);
  document.getElementById("orientationOutput").innerHTML = orientationOutput;

  if (osc.status() === 1 && sendOrientation) {
    var message = new OSC.Message('/orientation', o.euler.roll, o.euler.pitch, o.euler.yaw);
    osc.send(message);
  }

  if (midiOutputDeviceName && sendOrientation) {
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(rollControllerNumber, degreesToCC(o.euler.roll));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(pitchControllerNumber, degreesToCC(o.euler.pitch * 2));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(yawControllerNumber, degreesToCC(o.euler.yaw));
  }
});

// Must be inside a click/tap handler:
document.querySelector("#connect").addEventListener("click", async () => {
  await triki.connect();
  triki.resetHeading();
});

document.querySelector("#reset").addEventListener("click", () => {
  triki.resetHeading();         // re-zero yaw whenever you like
});

document.querySelector("#disconnect").addEventListener("click", () => {
  triki.disconnect();
});

function round(value) {
    return Math.round(value * 10)/10
}

function clamp(value) {
    return value > 127 ? 127 : value < 0 ? 0 : value;
}

function degreesToCC(value) {
    return Math.round((value + 180)/360*127)
}

function gyroToCC(value) {
    return Math.round(clamp((value + 500)/1000*127))
}

function accelToCC(value) {
    return Math.round(clamp((value + 2)/4*127))
}

WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));

function onEnabled() {
  const outportMenu = document.getElementById("midiOut-select");
  const outportError = document.getElementById("midiOut-error");

  // Display available MIDI output devices
  if (WebMidi.outputs.length < 1) {
    outportError.innerHTML+= "No device detected.";
  } else {
    WebMidi.outputs.forEach((mdevice, index) => {
      const option = document.createElement("option");
      option.text = mdevice.name;
      outportMenu.add(option);
    });
  }
}

document.getElementById("midiOut-select").addEventListener("change", () => {
  const outportMenu = document.getElementById("midiOut-select");
  midiOutputDeviceName = outportMenu.options[outportMenu.selectedIndex].value;
});

document.getElementById("midiOutChannel-select").addEventListener("change", () => {
  const outChannelMenu = document.getElementById("midiOutChannel-select");
  midiOutputChannel = Number(outChannelMenu.options[outChannelMenu.selectedIndex].value);
});

document.getElementById("orientationToggle").addEventListener("change", () => {
  const checkbox = document.getElementById("orientationToggle");
  sendOrientation = checkbox.checked;
});

document.getElementById("rollControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("rollControllerNumber-select");
  rollControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("pitchControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("pitchControllerNumber-select");
  pitchControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("yawControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("yawControllerNumber-select");
  yawControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("gyroToggle").addEventListener("change", () => {
  const checkbox = document.getElementById("gyroToggle");
  sendGyro = checkbox.checked;
});

document.getElementById("gyroXControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("gyroXControllerNumber-select");
  gyroXControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("gyroYControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("gyroYControllerNumber-select");
  gyroYControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("gyroZControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("gyroZControllerNumber-select");
  gyroZControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("accelToggle").addEventListener("change", () => {
  const checkbox = document.getElementById("accelToggle");
  sendAccel = checkbox.checked;
});

document.getElementById("accelXControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("accelXControllerNumber-select");
  accelXControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("accelYControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("accelYControllerNumber-select");
  accelYControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});

document.getElementById("accelZControllerNumber-select").addEventListener("change", () => {
  const controllerNumberMenu = document.getElementById("accelZControllerNumber-select");
  accelZControllerNumber = Number(controllerNumberMenu.options[controllerNumberMenu.selectedIndex].value);
});
