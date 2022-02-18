// данные приходят из Postgres
import {
  RuleModelNotation,
  RuleNotation,
} from '../../src/entities/engine/rule';
import { OperatorValues } from '../../src/entities/engine/operator';
const rulesHash = {};
export async function saveRule(notation: RuleNotation): Promise<number> {
  return new Promise((resolve) => {
    // find(where attributeId == [attributeId] && sessionId == [sessionId]
    setTimeout(
    () => {
      const ruleId = Object.keys(rulesHash).length;
      rulesHash[ruleId] = notation;
      resolve(ruleId);
    }, 100);
  });
}

export async function getRuleById(ruleId: number): Promise<RuleNotation> {
  return new Promise((resolve) => {
    // find(where attributeId == [attributeId] && sessionId == [sessionId]
    setTimeout(
      () =>
        resolve(rulesHash[ruleId]),
      100,
    );
  });
}
