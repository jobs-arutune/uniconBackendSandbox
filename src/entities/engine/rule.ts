/**
 * rule - Правило(Признак?) "Сумма арбитражных дел в качестве ответчика не более 20% от выручки"
 *
 * attribute - аттрибут - "Сумма арбитражных дел в качестве ответчика", ссылка целиком на источник данных
 *  ("Арбитраж. Дела в качестве ответчика. Оценка исковой суммы за 12 последних месяцев (в рублях)" - s2001 ориг)
 * property - свойство- "сумма, количество" и тд
 * firstEntity - сущность - "арбитражные дела в качестве ответчика", "арбитражные дела в качестве исца"
 * operator - оператор- не более ("более, менее, не менее, не более, равно, не равно")
 * amount - количество - 20
 * measurement - средства изм-я - "%"
 * secondEntity - сущность - "выручка"
 */

import { AttributeClass, AttributeModelNotation, AttributeValueClass } from "./attribute";
import {
  OperatorAbstract,
  OperatorClassesMapper,
  OperatorValueTypesMapper,
  OperatorValue,
} from './operator';
import { getAttributeByIdAndSession } from '../../../data/db-mocks/attribute';
import { ProviderDataModel, ProviderDataTransformer } from './provider';

export class RuleClass {
  // ruleResult?: OperatorResult;

  firstAttribute: ExpressionType;
  secondAttribute?: ExpressionType;
  operator: OperatorAbstract;
  constructor(private definition: RuleExpressionType) {
    // runtime checks just in case:
    if (!definition.firstAttribute)
      throw new Error('firstAttribute not defined');
    if (!definition.operator) throw new Error('operator not defined');
    if (expressionIsPrimitiveType(definition)) {
      throw new Error('rule definition can not be primitive type!');
    } else if (AttributeClass.expressionIsAttribute(definition)) {
      throw new Error('rule definition can not be attribute!');
    } else {
      this.firstAttribute = definition.firstAttribute;
      this.operator = definition.operator;
      if (definition.secondAttribute) {
        this.secondAttribute = definition.secondAttribute;
      }
    }
    if (!this.isValid()) throw new Error('not valid rule');
  }
  calculate(): AttributeValueClass {
    const { firstAttribute, secondAttribute, operator } = this;
    let firstValue, secondValue;
    if (AttributeClass.expressionIsAttribute(firstAttribute)) {
      firstValue = (firstAttribute as AttributeClass).getValue();
    } else if (RuleClass.isRuleClass(firstAttribute as RuleClass)) {
      firstValue = (firstAttribute as RuleClass).calculate();
    } else if (expressionIsPrimitiveType(firstAttribute)) {
      firstValue = firstAttribute;
    }
    if (secondAttribute) {
      if (AttributeClass.expressionIsAttribute(secondAttribute)) {
        secondValue = (secondAttribute as AttributeClass).getValue();
      } else if (RuleClass.isRuleClass(secondAttribute as RuleClass)) {
        secondValue = (secondAttribute as RuleClass).calculate();
      } else if (expressionIsPrimitiveType(secondAttribute)) {
        firstValue = secondAttribute;
      }
    } else {
    }
    return operator.apply(firstValue, secondValue);
  }
  isValid() {
    return true;
    /*return (
      this.firstAttribute.isOperatorCompatible(this.operator) &&
      this.secondAttribute.isOperatorCompatible(this.operator)
    );*/
  }
  serialize() {
    return this.definition;
  }

  isRuleClassCheck = () => true;
  static isRuleClass = (ruleClass: RuleClass) => ruleClass.isRuleClassCheck && ruleClass.isRuleClassCheck();
}

// const a: ExpressionType = { a: 'at' };

export class RuleFactory {
  static async create(rule: RuleNotation, data: DataNotation): Promise<RuleClass> {
    return RuleFactory.parse(rule, data);
  }
  static async parse(rule: RuleNotation, data: DataNotation): Promise<RuleClass> {
    if (rule.firstAttribute === undefined)
      throw new Error('firstAttribute not defined!');
    if (rule.operator === undefined) throw new Error('operator not defined!');

    let firstAttributeObject, secondAttributeObject;
    async function parseAttribute(attribute: AttributeNotation) {
      let ret;
      if (typeof attribute === 'number') {
        const attributeModel1: AttributeModelNotation = await getAttributeByIdAndSession(attribute, data.sessionId);
        ret = new AttributeClass(attributeModel1, data);
      } else {
        ret = await RuleFactory.parse(attribute, data);
      }
      return ret;
    }

    firstAttributeObject = await parseAttribute(rule.firstAttribute);
    if (rule.secondAttribute) {
      secondAttributeObject = await parseAttribute(rule.secondAttribute);
    }
    const OperatorClass =
      OperatorClassesMapper[OperatorValueTypesMapper[rule.operator.name]];
    const ret: RuleClass = new RuleClass({
      firstAttribute: firstAttributeObject,
      operator: new OperatorClass(rule.operator),
      secondAttribute: secondAttributeObject,
    });
    return ret;
  }

  static async save(ruleClass: RuleClass) {
    // todo
    const ruleSerialized = ruleClass.serialize();
    console.log(
      'RuleFactory::save:serializing and saving to db mock...',
      ruleSerialized,
    );
  }

  static async fetch(rule: ExpressionType): Promise<void> {
    if (AttributeClass.expressionIsAttribute(rule)) {
      // if (AttributeClass.expressionIsAttribute(attribute)) {
      await (rule as AttributeClass).fetch();
      return;
    } else if (expressionIsPrimitiveType(rule)) {
      return;
    }
    // сделаем сразу общий запрос данных, чтобы не терять время
    // рекурсивно, по каждому встретившемуся атрибуту
    const { firstAttribute, secondAttribute } = rule as RuleExpressionType;
    if (AttributeClass.expressionIsAttribute(firstAttribute)) {
      // if (AttributeClass.expressionIsAttribute(attribute)) {
      await (firstAttribute as AttributeClass).fetch();
    } else if (expressionIsPrimitiveType(firstAttribute)) {
    } else {
      await RuleFactory.fetch(firstAttribute as RuleExpressionType);
    }
    if (secondAttribute) {
      if (AttributeClass.expressionIsAttribute(secondAttribute)) {
        await (secondAttribute as AttributeClass).fetch();
      } else if (expressionIsPrimitiveType(secondAttribute)) {
      } else {
        await RuleFactory.fetch(secondAttribute as RuleExpressionType);
      }
    }
  }
}

// not used!
export class RuleOrchestrator {
  constructor(
    private sessionId: number,
    private providerDataModels: ProviderDataModel[],
    private transformers: ProviderDataTransformer[],
  ) {}
  async checkRule(ruleClass: RuleClass) {
    return ruleClass.calculate();
    // const rawData = await this.providerDataModel.getData(inn, sessionId);
    // const refinedData = this.transformer.refine(rawData);
    // this.dataModel.saveRefined(refinedData);
  }
}

// внимание attributeId, это не индексный ИД в БД, а наш специальный attributeId,
// который с sessionId образует сложный уникальный ключ attributes table
export type RuleNotation = {
  firstAttribute: AttributeNotation; // sub-expression or attribute code in DB
  secondAttribute?: RuleNotation | number;
  operator: OperatorValue;
};

type AttributeNotation = RuleNotation | number;

export type DataNotation = {
  inn: number;
  sessionId: number;
};

export type RuleModelNotation = {
  ruleId: number;
  notation: RuleNotation;
};

export type PrimitiveValueType = boolean | string | number;

export type RuleExpressionType = {
  firstAttribute: ExpressionType;
  operator: OperatorAbstract;
  secondAttribute?: ExpressionType;
};

export type ExpressionType =
  | RuleExpressionType
  | AttributeClass
  | PrimitiveValueType;

export const expressionIsPrimitiveType = (type: ExpressionType) =>
  typeof type === 'boolean' ||
  typeof type === 'string' ||
  typeof type === 'number';
