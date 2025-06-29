import TakasagoDCPowerSupply from './TakasagoDCPowerSupply.mjs';

class Takasago_KX_Series extends TakasagoDCPowerSupply {
  constructor (address, serialManager) {
    super(address, serialManager);
  }
  // not override in this class
  // async off () {}
  // async on () {}
  // override in this class
  async getOutputCurrent () {
    return parseFloat((await this.#tk0()).outputCurrent);
  }
  async getOutputVoltage () {
    return parseFloat((await this.#tk0()).outputVoltage);
  }
  async getProtectionCurrent () {
    return parseFloat((await this.#tk0()).protectionCurrent);
  }
  async getProtectionVoltage () {
    return parseFloat((await this.#tk0()).protectionVoltage);
  }
  async reset () {
    super.reset();
    await this.sendCommand(`A${this.address},CL1`);
  }
  async setOutputCurrent (outputCurrent) {
    super.setOutputCurrent(outputCurrent);
    await this.sendCommand(`A${this.address},OC${outputCurrent}`);
  }
  async setOutputVoltage (outputVoltage) {
    super.setOutputVoltage(outputVoltage);
    await this.sendCommand(`A${this.address},OV${outputVoltage}`);
  }
  async setProtectionCurrent (protectionCurrent) {
    super.setProtectionCurrent(protectionCurrent);
    await this.sendCommand(`A${this.address},LC${protectionCurrent}`);
  }
  async setProtectionVoltage (protectionVoltage) {
    super.setProtectionVoltage(protectionVoltage);
    await this.sendCommand(`A${this.address},LV${protectionVoltage}`);
  }
  async #tk0 () {
    const response = await this.queryCommand(`A${this.address},TK0`);
    const [outputVoltage, outputCurrent, protectionVoltage, protectionCurrent, outputState, sinkState] = response.split(',');
    return {outputVoltage, outputCurrent, protectionVoltage, protectionCurrent, outputState, sinkState};
  }
}

class Takasago_KX_100H extends Takasago_KX_Series {
  constructor (address, serialManager) {
    super(address, serialManager);
    this.setOutputLimit({outputCurrentLimit: 2.5, outputPowerLimit: 100, outputVoltageLimit: 160});
    this.setProtectionLimit({protectionCurrentLimit: [0.2, 2.75], protectionVoltageLimit: [2, 176]});
    this.setOutputVoltage(40);
    this.setOutputCurrent(0.625);
  }
  // not override in this class
  // async getOutputCurrent () {}
  // async getOutputVoltage () {}
  // async getProtectionCurrent () {}
  // async getProtectionVoltage () {}
  // async off () {}
  // async on () {}
  // async reset () {}
  // async setOutputCurrent (outputCurrent) {}
  // async setOutputVoltage (outputVoltage) {}
  // async setProtectionCurrent (protectionCurrent) {}
  // async setProtectionVoltage (protectionVoltage) {}
  // async #tk0 () {}
}

class Takasago_KX_100L extends Takasago_KX_Series {
  constructor (address, serialManager) {
    super(address, serialManager);
    this.setOutputLimit({outputCurrentLimit: 10, outputPowerLimit: 100, outputVoltageLimit: 40});
    this.setProtectionLimit({protectionCurrentLimit: [1, 11], protectionVoltageLimit: [2, 44]});
    this.setOutputVoltage(10);
    this.setOutputCurrent(2.5);
  }
  // not override in this class
  // async getOutputCurrent () {}
  // async getOutputVoltage () {}
  // async getProtectionCurrent () {}
  // async getProtectionVoltage () {}
  // async off () {}
  // async on () {}
  // async reset () {}
  // async setOutputCurrent (outputCurrent) {}
  // async setOutputVoltage (outputVoltage) {}
  // async setProtectionCurrent (protectionCurrent) {}
  // async setProtectionVoltage (protectionVoltage) {}
  // async #tk0 () {}
}

export {Takasago_KX_100H, Takasago_KX_100L};
