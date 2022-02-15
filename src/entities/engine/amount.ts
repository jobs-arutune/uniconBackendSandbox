import { Measurement } from './measurement';

export class Amount {
  constructor(public name, public measurement: Measurement) {}
  toString() {
    return `${this.name} ${this.measurement}`;
  }
}
