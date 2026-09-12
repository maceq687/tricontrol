import { TrikiController } from "triki-controller";
import OSC from "osc-js";
import { WebMidi } from "webmidi";

if (!TrikiController.isSupported()) {
  throw new Error("This browser has no Web Bluetooth.");
}

const triki = new TrikiController({ fusion: true, rateHz: 26 });
const osc = new OSC();

var connectionState = null;
var output = "";
var midiOutputDeviceName = null;
var midiOutputChannel = 1;
var rollControllerNumber = 4;
var pitchControllerNumber = 5;
var yawControllerNumber = 6;

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
});

triki.on("orientation", (o) => {
  // o.quaternion = [w, x, y, z] (right-handed), o.euler = { roll, pitch, yaw } in degrees
  // console.log("orientation", o.euler);
  output = "roll: " + round(o.euler.roll) + ", pitch: " + round(o.euler.pitch) + ", yaw: " + round(o.euler.yaw);
  document.getElementById("output").innerHTML = output;

  if (osc.status() === 1) {
    var message = new OSC.Message('/orientation', o.euler.roll, o.euler.pitch, o.euler.yaw);
    osc.send(message);
  }

  if (midiOutputDeviceName) {
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(rollControllerNumber, convertToCC(o.euler.roll));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(pitchControllerNumber, convertToCC(o.euler.pitch * 2));
    WebMidi.getOutputByName(midiOutputDeviceName).channels[midiOutputChannel].sendControlChange(yawControllerNumber, convertToCC(o.euler.yaw));
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

function convertToCC(value) {
    return Math.round((value + 180)/360*127)
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
