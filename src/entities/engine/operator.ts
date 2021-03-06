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

export class AndOperator extends OperatorAbstract {
  constructor(value: OperatorValue) {
    super(value);
  }

  apply(
    attributeValue1: AttributeValueClass,
    attributeValue2: AttributeValueClass,
  ): AttributeValueClass {
    this.applyBase(attributeValue1, attributeValue2);

    let res = (attributeValue1.getValue() as boolean) && (attributeValue2.getValue() as boolean);
    return new AttributeValueClass(res, AttributeValueTypes.truthiness);
  }
  isUnary = () => false;

  protected isValid = (attributeValue: AttributeValueClass): boolean =>
    attributeValue.type === AttributeValueTypes.truthiness;

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
  moreThan: { name: 'moreThan', value: '>', text: '?????????? ??????' },
  lessThan: { name: 'lessThan', value: '<', text: '?????????? ??????' },
  noMoreThan: { value: '<=', text: '???? ?????????? ??????' },
  noLessThan: { value: '>=', text: '???? ?????????? ??????' },
  // equal: { value: '==', text: '??????????' },
  // notEqual: { value: '!=', text: '???? ??????????' },

  percent: { name: 'percent', value: '%', text: '%' },
  // LOGICAL binary : AND/OR
  and: { name: 'and', value: '&&', text: '??' },
};

// export type OperatorResult = boolean | string | number;

export enum OperatorTypes {
  compare,
  percent,
  and,
}

export const OperatorClassesMapper = {
  [OperatorTypes.compare]: CompareOperator,
  [OperatorTypes.percent]: PercentOperator,
  [OperatorTypes.and]: AndOperator,
};

export const OperatorValueTypesMapper = {
  [OperatorValues.lessThan.name]: OperatorTypes.compare,
  [OperatorValues.percent.name]: OperatorTypes.percent,
  [OperatorValues.and.name]: OperatorTypes.and,
};
