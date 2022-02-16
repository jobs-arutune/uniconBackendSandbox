import { CURRENT_SESSION_ID, OLD_SESSION } from '../../src/app.service';

export async function getVersionForSession(
  sessionId: number,
  attributeId: number,
): Promise<number> {
  return new Promise((resolve) => {
    // sessionAttributeVersion.find(where attributeId, sessionId)
    setTimeout(() => {
      let ret = 0;
      if (sessionId === CURRENT_SESSION_ID) {
        ret = 1;
      }
      if (sessionId === OLD_SESSION) {
        ret = 2;
      }
      resolve(ret);
    }, 100);
  });
}
