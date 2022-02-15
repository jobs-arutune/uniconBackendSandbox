/**
 * feature - Признак, "Сумма арбитражных дел в качестве ответчика не более 20% от выручки"
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

import { Attribute } from './attribute';
import { OperatorAbstract, OperatorResult } from './operator';
import { Measurement } from './measurement';
import { Amount } from './amount';

export class Feature {
  featureResult?: OperatorResult;
  expression: Expression;

  constructor(
    public data: { inn: number },
    expressionDeclaration: ExpressionType,
    /* public firstAttribute: Attribute,
    public operator: OperatorAbstract,
    public amount: Amount,
    public secondAttribute: Attribute, */
  ) {
    this.expression = new Expression(expressionDeclaration);
    console.log(this.toString());
  }

  async init() {
    // if (!this.isValid()) throw new Error('Not valid feature');
  }
  async test() {
    this.expression.calculate();
    // const attrValue1 = await this.firstAttribute.getValue();
    // const attrValue2 = await this.secondAttribute.getValue();
    // this.featureResult = this.operator.apply(attrValue1, attrValue2);
    return this.featureResult;
  }

  toString() {
    // return `${this.firstAttribute} ${this.operator} ${this.amount} ${this.secondAttribute}`;
  }
}

class Expression {
  private firstAttribute: Attribute;
  private secondAttribute?: Attribute;
  private operator: OperatorAbstract;
  constructor(private definitionArr: ExpressionType) {
    if (this.definitionArr.length === 2) {
      const [operator, expression] = this.definitionArr;
      // this.firstAttribute =
    } else if (this.definitionArr.length === 3) {
      const [expression1, operator, expression2] = this.definitionArr;
    } else {
      throw new Error('incorrect expression');
    }
  }
  calculate():void /*OperatorResult*/ {
    debugger;
    let ret;

  }
  isValid() {
    return (
      this.firstAttribute.isOperatorCompatible(this.operator) &&
      this.secondAttribute.isOperatorCompatible(this.operator)
    );
  }
}

type ExpressionType = [ExpressionType, OperatorAbstract, ExpressionType] | [OperatorAbstract, ExpressionType]