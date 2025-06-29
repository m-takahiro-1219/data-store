import {SerialManager} from './lib/SerialManager.mjs';
import {Takasago_KX_100H} from './lib/Takasago_KX-Series.mjs';

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

/** @type {SerialManager | null} */
let sm = null;

/** @type {Takasago_KX_100H | null} */
let dcps = null;

let running = false;

const connectButton = document.querySelector('#connect_button');
const executeButton = document.querySelector('#execute_button');
const disconnectButton = document.querySelector('#disconnect_button');

connectButton.addEventListener('click', onClick, false);

async function onClick (event) {
  console.log('onClick');
  switch (this) {
    case connectButton:
      console.log('onClick > connectButton');
      if (sm) return;
      sm = new SerialManager();
      await sm.connect();
      dcps = new Takasago_KX_100H(1, sm);
      running = false;
      break;
    case executeButton:
      console.log('onClick > executeButton');
      if (!sm) return;
      if (running) return;
      running = true;
      await dcps.setOutputCurrent(1);
      await dcps.setOutputVoltage(0);
      await sleep(1000);
      await dcps.on();
      let ov = 0;
      while (ov < 132) {
        console.log('onClick > executeButton > ov=' + ov);
        await sleep(1000);
        await dcps.setOutputVoltage(ov);
        ov += 12;
      }
      while (ov > 0) {
        console.log('onClick > executeButton > ov=' + ov);
        await sleep(1000);
        await dcps.setOutputVoltage(ov);
        ov -= 12;
      }
      await sleep(1000);
      await dcps.off();
      running = false;
      break;
    case disconnectButton:
      console.log('onClick > disconnectButton');
      if (!sm) return;
      await sm.disconnect();
      sm = null;
      dcps = null;
      running = false;
      break;
    default:
      break;
  }
}
