import { AttributeValue } from './attribute';
import { EntityValueType } from './entity';

export abstract class OperatorAbstract {
  protected constructor(private operatorValue: OperatorValue) {}
  get value() {
    return this.operatorValue.value;
  }
  get text() {
    return this.operatorValue.text;
  }
  abstract apply(
    attributeValue1: AttributeValue,
    attributeValue2: AttributeValue,
  ): OperatorResult;
  toString() {
    return this.operatorValue.text;
  }
}

export class CompareOperator extends OperatorAbstract {
  constructor(value: OperatorValue) {
    super(value);
  }

  apply(
    attributeValue1: AttributeValue,
    attributeValue2: AttributeValue,
  ): OperatorResult {
    if (
      !CompareOperator.isValid(attributeValue1) ||
      !CompareOperator.isValid(attributeValue1)
    )
      return false;
    let res = false;
    if (this.value === OperatorValues.lessThan.value) {
      res = attributeValue1 < attributeValue2;
    } else if (this.value === OperatorValues.moreThan.value) {
      res = attributeValue1 > attributeValue2;
    } else if (this.value === OperatorValues.noMoreThan.value) {
      res = attributeValue1 <= attributeValue2;
    } else {
      throw new Error('operator is not supported!');
    }
    return res;
  }

  private static isValid = (attributeValue: AttributeValue) =>
    attributeValue.type === EntityValueType.number;

  toString() {
    return this.text;
  }
}
export interface OperatorValue {
  // name: string;
  value: string;
  text: string;
}

export const OperatorValues = {
  moreThan: { value: '>', text: 'более чем' },
  lessThan: { value: '<', text: 'менее чем' },
  noMoreThan: { value: '<=', text: 'не более чем' },
  noLessThan: { value: '>=', text: 'не менее чем' },
  equal: { value: '==', text: 'равно' },
  notEqual: { value: '!=', text: 'не равно' },
};

export type OperatorResult = boolean;
/*
export const OperatorValues: OperatorValue[] = [
  { name: 'moreThan', value: '>', text: 'более чем' },
  { name: 'lessThan', value: '<', text: 'менее чем' },
  { name: 'noMoreThan', value: '<=', text: 'не более чем' },
  { name: 'noLessThan', value: '>=', text: 'не менее чем' },
]; */
