// данные приходят из Postgres
import { AttributeModelNotation, AttributeTypes, AttributeValueTypes } from "../../src/entities/engine/attribute";
import { CURRENT_SESSION_ID, OLD_SESSION } from "../../src/app.service";
import { getVersionForSession } from "./version";

export async function getAttributeByIdAndSession(
  attributeId: number, // внимание, это не индексный ИД в БД, а наш специальный attributeId, который с sessionId образует сложный уникальный ключ
  sessionId: number,
): Promise<AttributeModelNotation> {
  return new Promise((resolve) => {
    // find(where attributeId == [attributeId] && sessionId == [sessionId]
    setTimeout(async () => {
      const version = await getVersionForSession(sessionId, attributeId);
      if (version === 1) {// today's session
        if (attributeId === 3) {
          resolve({
            attributeId,
            sessionId,
            type: AttributeTypes.external,
            valueType: AttributeValueTypes.amount,
            propertyText: 'сумма',
            entityText: 'арбитражных дел в качестве ответчиКА',
            providerCode: 's2001',
            providerId: 1,
            apiId: 'analytics',
            apiJsonPath: '[0]/analytics',
            providerVersion: 1,
          });
        } else if (attributeId === 4) {
          resolve({
            attributeId,
            sessionId,
            type: AttributeTypes.external,
            valueType: AttributeValueTypes.amount,
            propertyText: 'сумма',
            entityText: 'Выручка на конец отчетного периода',
            providerCode: 's6004',
            providerId: 1,
            apiId: 'analytics',
            providerVersion: 1,
          });
        } else if (attributeId === 5) {
          resolve({
            attributeId,
            sessionId,
            type: AttributeTypes.static,
            valueType: AttributeValueTypes.amount,
            value: 20,
            // propertyText: 'сумма',
            // entityText: 'арбитражных дел в качестве ответчиКА',
            // providerCode: 's2001',
            // providerId: 1,
            // apiId: 2,
            // providerVersion: 1,
          });
        } else if (attributeId === 6) {
          resolve({
            attributeId,
            sessionId,
            type: AttributeTypes.external,
            valueType: AttributeValueTypes.amount,
            propertyText: 'количество',
            entityText: 'невыигранных дел в качестве истца (за 3 года)',
            providerCode: 'q2021',
            providerId: 1,
            apiId: 'analytics',
            apiJsonPath: '[0]/analytics',
            providerVersion: 1,
          });
        }
      } else if (version === 2) {
        if (attributeId === 3) {
          resolve({
            attributeId,
            sessionId,
            type: AttributeTypes.external,
            valueType: AttributeValueTypes.amount,
            propertyText: 'сумма',
            entityText: 'арбитражных дел в качестве ответчиЦЫ',
            providerCode: 's2001a',
            providerId: 1,
            apiId: 'analytics',
            providerVersion: 1,
          });
        } else if (attributeId === 4) {
          resolve({
            attributeId,
            sessionId,
            type: AttributeTypes.external,
            valueType: AttributeValueTypes.amount,
            propertyText: 'сумма',
            entityText: 'Выручка на конец отчетного периода',
            providerCode: 's6004',
            providerId: 1,
            apiId: 'analytics',
            providerVersion: 1,
          });
        }
      }
    }, 100);
  });
}
export function getAttributeRestrictions() {
  return [{ asdf: 1 }];
}
