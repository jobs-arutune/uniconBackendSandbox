// данные приходят из Postgres
import { ProviderNotation } from "../../src/entities/engine/provider";
import { CURRENT_SESSION_ID, OLD_SESSION } from "../../src/app.service";

export async function getProviderByIdAndSession(
  providerId: number, // внимание, это не индексный ИД в БД, а наш специальный providerId, который с sessionId образует сложный уникальный ключ
  sessionId: number,
): Promise<ProviderNotation> {
  return new Promise((resolve) => {
    // find(where attributeId == [attributeId] && sessionId == [sessionId]
    setTimeout(() => {
      if (sessionId === CURRENT_SESSION_ID) {// todays session
        if (providerId === 1) {
          resolve({
            providerId, sessionId, name: 'Контрфокус', versionId: 1, providerVersion: 'api1',
          });
        } else if (providerId === 2) {
          resolve({
            providerId, sessionId, name: 'СПРАРК', versionId: 1, providerVersion: '1.0',
          });
        }
      } else if (sessionId === OLD_SESSION) {// historical session
        if (providerId === 1) {
          resolve({
            providerId, sessionId, name: 'Контрфокус', versionId: 2, providerVersion: 'api',
          });
        } else if (providerId === 2) {
          resolve({
            providerId, sessionId, name: 'СПРАРК', versionId: 2, providerVersion: '2.0',
          });
        }
      }
    }, 100);
  });
}
