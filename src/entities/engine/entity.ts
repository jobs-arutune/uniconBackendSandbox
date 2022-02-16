export class Entity {
  constructor(public name) {}
  get value() {
    return this.name;
  }
  toString() {
    return this.name;
  }
}
