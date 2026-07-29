import { TrikiController } from "triki-controller";
import OSC from "osc-js";

if (!TrikiController.isSupported()) {
  throw new Error("This browser has no Web Bluetooth.");
}

const triki = new TrikiController({ fusion: true, rateHz: 26 });
const osc = new OSC();

var connectionState = null;
var output = "";

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
  var message = new OSC.Message('/orientation', o.euler.roll, o.euler.pitch, o.euler.yaw);
  osc.send(message);
});

// Must be inside a click/tap handler:
document.querySelector("#connect").addEventListener("click", async () => {
  await triki.connect();
  triki.resetHeading();
});

document.querySelector("#reset").addEventListener("click", async () => {
  triki.resetHeading();         // re-zero yaw whenever you like
});

document.querySelector("#disconnect").addEventListener("click", async () => {
  triki.disconnect();
});

function round(value) {
    return Math.round(value * 10)/10
}
