import { AttributeValueClass, AttributeValueTypes } from "./attribute";

export abstract class OperatorAbstract {
  protected constructor(private operatorValue: OperatorValue) {}
  get value() {
    return this.operatorValue.value;
  }
  get text() {
    return this.operatorValue.text;
  }
  applyBase(
    attributeValue1: AttributeValueClass,
    attributeValue2: AttributeValueClass,
  ): void {
    if (
      !(this.isValid(attributeValue1) && this.isValid(attributeValue2)) ||
      attributeValue1 === undefined ||
      (!this.isUnary() && attributeValue2 === undefined)
    ) {
      throw new Error('incorrect parameters passed to operator');
    }
  }
  abstract apply(
    attributeValue1: AttributeValueClass,
    attributeValue2: AttributeValueClass,
  ): AttributeValueClass;
  abstract isUnary(): boolean;
  toString() {
    return this.operatorValue.text;
  }
  protected abstract isValid(attributeValue: AttributeValueClass): boolean;
}

export class CompareOperator extends OperatorAbstract {
  constructor(value: OperatorValue) {
    super(value);
  }

  apply(
    attributeValue1: AttributeValueClass,
    attributeValue2: AttributeValueClass,
  ): AttributeValueClass {
    this.applyBase(attributeValue1, attributeValue2);
    let res = false;
    const value1 = attributeValue1.getValue() as number,
      value2 = attributeValue2.getValue() as number;
    if (this.value === OperatorValues.lessThan.value) {
      res = value1 < value2;
    } else if (this.value === OperatorValues.moreThan.value) {
      res = value1 > value2;
    } else if (this.value === OperatorValues.noMoreThan.value) {
      res = value1 <= value2;
    } else {
      throw new Error('operator is not supported!');
    }
    return new AttributeValueClass(res, AttributeValueTypes.truthiness);
  }

  isUnary = () => false;

  protected isValid = (attributeValue: AttributeValueClass): boolean =>
    attributeValue.type === AttributeValueTypes.amount;

  toString() {
    return this.text;
  }
}

export class PercentOperator extends OperatorAbstract {
  constructor(value: OperatorValue) {
    super(value);
  }

  apply(
    attributeValue1: AttributeValueClass,
    attributeValue2: AttributeValueClass,
  ): AttributeValueClass {
    this.applyBase(attributeValue1, attributeValue2);

    let res = (attributeValue1.getValue() as number) * (attributeValue2.getValue() as number) / 100;
    return new AttributeValueClass(res, AttributeValueTypes.amount);
  }
  isUnary = () => false;

  protected isValid = (attributeValue: AttributeValueClass): boolean =>
    attributeValue.type === AttributeValueTypes.amount;

  toString() {
    return this.text;
  }
}

export interface OperatorValue {
  name: string;
  value: string;
  text: string;
}

export const OperatorValues = {
  moreThan: { name: 'moreThan', value: '>', text: 'более чем' },
  lessThan: { name: 'lessThan', value: '<', text: 'менее чем' },
  noMoreThan: { value: '<=', text: 'не более чем' },
  noLessThan: { value: '>=', text: 'не менее чем' },
  // equal: { value: '==', text: 'равно' },
  // notEqual: { value: '!=', text: 'не равно' },

  percent: { name: 'percent', value: '%', text: '%' },
};

// export type OperatorResult = boolean | string | number;

export enum OperatorTypes {
  compare,
  percent,
}

export const OperatorClassesMapper = {
  [OperatorTypes.compare]: CompareOperator,
  [OperatorTypes.percent]: PercentOperator,
};

export const OperatorValueTypesMapper = {
  [OperatorValues.lessThan.name]: OperatorTypes.compare,
  [OperatorValues.percent.name]: OperatorTypes.percent,
};
