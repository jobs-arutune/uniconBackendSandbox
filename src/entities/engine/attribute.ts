// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('lodash.get');
import { Property } from './property';
import { Entity } from './entity';
import { OperatorAbstract, OperatorValues } from './operator';
import { DataNotation, ExpressionType, PrimitiveValueType } from './rule';
import { readFile } from 'fs';

export class AttributeClass {
  name: string;
  property: Property;
  entity: Entity;
  value: AttributeValueClass;

  constructor(
    private model: AttributeModelNotation,
    private data: DataNotation,
  ) {
    this.property = new Property(model.propertyText);
    this.entity = new Entity(model.entityText);
  }

  async fetch(): Promise<void> {
    console.log('fetching...', this.model, this.data);
    //
    if (this.model.type === AttributeTypes.external) {
      const data = await new Promise((resolve) => {
        readFile(
          `${process.cwd()}/data/api-mocks/contur/${this.model.apiId}.json`,
          'utf8',
          (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            resolve(JSON.parse(data));
          },
        );
      });
      const value = get(
        data,
        `[0].${this.model.apiId}.${this.model.providerCode}`,
      );
      this.value = new AttributeValueClass(value, this.model.valueType);
    } else if (this.model.type === AttributeTypes.static) {
      this.value = new AttributeValueClass(this.model.value, this.model.valueType);
    }
  }

  getValue = (): AttributeValueClass => this.value;

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
  isAttribute = () => true;

  static expressionIsAttribute = (type: ExpressionType) =>
    (type as AttributeClass).isAttribute &&
    (type as AttributeClass).isAttribute();
}

export class AttributeValueClass {
  getValue = () => this.value;

  constructor(private value: PrimitiveValueType, public type: AttributeValueTypes) {}
  toString = (): string => this.getValue()?.toString();
}

export enum AttributeValueTypes {
  amount = 'amount',
  truthiness = 'truthiness',
  existence = 'existence',
}

// data as it comes from our db (attributes table)
export interface AttributeModelNotation {
  attributeId: number;
  sessionId: number;
  type: AttributeTypes;
  value?: PrimitiveValueType;
  valueType: AttributeValueTypes;
  providerCode?: string;
  propertyText?: string;
  entityText?: string;
  apiId?: number | string; // ссылка на название метода API (buh, analytics etc.) todo: remove string!!
  providerId?: number;
  apiJsonPath?: string;
  providerVersion?: number;
}

export enum AttributeTypes {
  static,
  external,
}
