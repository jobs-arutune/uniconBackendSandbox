// данные приходят из Postgres
import {
  RuleModelNotation,
  RuleNotation,
} from '../../src/entities/engine/rule';
import { OperatorValues } from '../../src/entities/engine/operator';

export async function saveRule(notation: RuleNotation): Promise<number> {
  return new Promise((resolve) => {
    // find(where attributeId == [attributeId] && sessionId == [sessionId]
    setTimeout(
      () =>
        resolve(1), 100);
  });
}

export async function getRuleById(ruleId: number): Promise<RuleModelNotation> {
  return new Promise((resolve) => {
    // find(where attributeId == [attributeId] && sessionId == [sessionId]
    setTimeout(
      () =>
        resolve({
          ruleId,
          notation: {
            firstAttribute: 3,
            operator: OperatorValues.lessThan,
            secondAttribute: {
              firstAttribute: 4,
              operator: OperatorValues.percent,
              secondAttribute: 5,
            },
          },
        }),
      100,
    );
  });
}
