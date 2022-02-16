export class Property {
  value: PropertyValueClass;
  constructor(public name) {}

  toString() {
    return this.name;
  }
}

export class PropertyValueClass {
  type: PropertyValueTypes;
}

export enum PropertyValueTypes {
  amount = 'amount',
  existence = 'existence',
}