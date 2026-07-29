import './style.css';

document.querySelector('#app').innerHTML = `
<section id="center">
  <div>
    <h1>tricontrol</h1>
  </div>
  <p id="status">status: unknown</p>
  <button id="connect">Connect</button>
  <button id="reset">Reset orientation</button>
  <button id="disconnect">Disconnect</button>
  <p id="output"p></p>
</section>
`
