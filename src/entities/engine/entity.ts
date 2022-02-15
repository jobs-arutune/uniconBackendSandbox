export class Entity {
  constructor(public name) {
  }
  get value() {
    return this.name
  }
  toString() {
    return this.name;
  }
}


export class EntityValue {
  type: EntityValueType;
}

export enum EntityValueType {
  string = 'string',
  number = 'number',
}