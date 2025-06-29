import InstrumentBase from './InstrumentBase.mjs';

export default class DCPowerSupply extends InstrumentBase {
  #outputCurrent = 0;
  #outputCurrentLimit = 0;
  #outputPowerLimit = 0;
  #outputVoltage = 0;
  #outputVoltageLimit = 0;
  #protectionCurrent = 0;
  #protectionCurrentLimit = [0, 0];
  #protectionVoltage = 0;
  #protectionVoltageLimit = [0, 0];
  constructor (address, serialManager) {
    super(address, serialManager);
  }
  setOutputLimit ({outputCurrentLimit, outputPowerLimit, outputVoltageLimit}) {
    this.#outputCurrentLimit = outputCurrentLimit;
    this.#outputPowerLimit = outputPowerLimit;
    this.#outputVoltageLimit = outputVoltageLimit;
  }
  setProtectionLimit ({protectionCurrentLimit, protectionVoltageLimit}) {
    this.#protectionCurrentLimit = protectionCurrentLimit;
    this.#protectionVoltageLimit = protectionVoltageLimit;
  }
  async getOutputCurrent () {}
  async getOutputVoltage () {}
  async getProtectionCurrent () {}
  async getProtectionVoltage () {}
  async off () {}
  async on () {}
  async reset () {}
  async setOutputCurrent (outputCurrent) {
    if (outputCurrent < 0) throw new RangeError('Output current must to be higher than 0');
    if (outputCurrent > this.#outputCurrentLimit) throw new RangeError(`Output current must to be lower than ${this.#outputCurrentLimit}`);
    if (outputCurrent * this.#outputVoltage > this.#outputPowerLimit) throw new RangeError(`Output power must to be lower than ${this.#outputPowerLimit}`);
    this.#outputCurrent = outputCurrent;
  }
  async setOutputVoltage (outputVoltage) {
    if (outputVoltage < 0) throw new RangeError('Output voltage must to be higher than 0');
    if (outputVoltage > this.#outputVoltageLimit) throw new RangeError(`Output voltage must to be lower than ${this.#outputVoltageLimit}`);
    if (this.#outputCurrent * outputVoltage > this.#outputPowerLimit) throw new RangeError(`Output power must to be lower than ${this.#outputPowerLimit}`);
    this.#outputVoltage = outputVoltage;
  }
  async setProtectionCurrent (protectionCurrent) {
    if (protectionCurrent < this.#protectionCurrentLimit[0]) throw new RangeError(`Protection current must to be higher than ${this.#protectionCurrentLimit[0]}`);
    if (protectionCurrent > this.#protectionCurrentLimit[1]) throw new RangeError(`Protection current must to be lower than ${this.#protectionCurrentLimit[1]}`);
    this.#protectionCurrent = protectionCurrent;
  }
  async setProtectionVoltage (protectionVoltage) {
    if (protectionVoltage < this.#protectionVoltageLimit[0]) throw new RangeError(`Protection voltage must to be higher than ${this.#protectionVoltageLimit[0]}`);
    if (protectionVoltage > this.#protectionVoltageLimit[1]) throw new RangeError(`Protection voltage must to be lower than ${this.#protectionVoltageLimit[1]}`);
    this.#protectionVoltage = protectionVoltage;
  }
}
