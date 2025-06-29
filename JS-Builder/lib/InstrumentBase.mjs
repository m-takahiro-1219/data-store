export default class InstrumentBase {
  /** @type {string} */
  #address;

  /** @type {import('./SerialManager.mjs').SerialManager} */
  #serialManager;
  
  constructor (address, serialManager) {
    this.#address = address;
    this.#serialManager = serialManager;
  }
  get address () {
    return this.#address;
  }
  get serialManager () {
    return this.#serialManager;
  }
  async queryCommand (command, timeout = 1000) {
    return await this.#serialManager.queryCommand(command, timeout);
  }
  async sendCommand (command) {
    await this.#serialManager.sendCommand(command);
  }
}
