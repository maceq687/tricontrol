import "./style.css";

document.querySelector("#app").innerHTML = `
<section id="center">
  <div>
    <h1>tricontrol</h1>
  </div>
  <p id="status">status: unknown</p>
  <button id="connect">Connect</button>
  <button id="reset">Reset orientation</button>
  <button id="disconnect">Disconnect</button>
  <p id="output"p></p>
  <h2>MIDI out</h2>
  <span id="midiOut-error"></span>
  <form id="midiOut-form">
    <div>
      <label>
        MIDI out device
        <select id="midiOut-select">
           <option value="">Select device</option>
        </select>
      </label>
      <label>
        channel
        <select id="midiOutChannel-select">
          <option value="1" selected>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
      </label>
    </div>
    <div>
      <label>
        Roll CC nr:
        <select id="rollControllerNumber-select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4" selected>4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
      </label>
      <label>
        Pitch CC nr:
        <select id="pitchControllerNumber-select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5" selected>5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
      </label>
      <label>
        Yaw CC nr:
        <select id="yawControllerNumber-select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6" selected>6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
        </select>
      </label>
    </div>
  </form>
</section>
<section id="footer">
  <button onclick="window.location.href='https://github.com/maceq687/tricontrol';">See the source code</button>
</section>
`;
