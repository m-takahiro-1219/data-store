import DCPowerSupply from './DCPowerSupply.mjs';

export default class TakasagoDCPowerSupply extends DCPowerSupply {
  constructor (address, serialManager) {
    super(address, serialManager);
  }
  // not override in this class
  // async getOutputCurrent () {}
  // async getOutputVoltage () {}
  // async getProtectionCurrent () {}
  // async getProtectionVoltage () {}
  // async reset () {}
  // async setOutputCurrent (outputCurrent) {}
  // async setOutputVoltage (outputVoltage) {}
  // async setProtectionCurrent (protectionCurrent) {}
  // async setProtectionVoltage (protectionVoltage) {}
  // override in this class
  async off () {
    super.off();
    await this.sendCommand(`A${this.address},OT0`);
  }
  async on () {
    super.on();
    await this.sendCommand(`A${this.address},OT1`);
  }
  // add in this class
  async #tk0 () {}
}
