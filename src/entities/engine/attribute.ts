import { Property } from './property';
import { Entity, EntityValue } from "./entity";
import AnalyticsJson from '../../../data/contur/analytics';
import { OperatorAbstract, OperatorValues } from './operator';

export class Attribute {
  name: string;
  property: Property;
  entity: Entity;

  constructor(property: Property, entity: Entity, public code: string) {
    this.property = property;
    this.entity = entity;
  }
  async getValue(): Promise<AttributeValue> {
    // атрибут "знает" как достать из бД свое значение:
    // @ts-ignore
    return AnalyticsJson[0].analytics[this.code];
  }
  isOperatorCompatible(operator: OperatorAbstract) {
    // some business logic here (request to db etc). Only attribute knows if operator is valid!
    return (
      operator.value === OperatorValues.lessThan.value ||
      operator.value === OperatorValues.noMoreThan.value
    );
    // return operator.value === OperatorValues.lessThan
  }
  toString() {
    return `${this.property} ${this.entity}`;
  }
}

export class AttributeValue extends EntityValue {}
