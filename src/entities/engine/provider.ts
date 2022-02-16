// DMOT Design Pattern (ETL), Data Model part
// https://towardsdatascience.com/dmot-a-design-pattern-for-etl-data-model-orchestrator-transformer-c0d7baacb8c7
import { Entity } from '../engine/entity';
import { RawDataType } from './data';

export class ProviderDataModel {
  constructor(props: any) {
    // пока заглушка
  }

  getData(inn: number, sessionId: number): RawDataType {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (inn === 7703270067 && sessionId === 341235234) {
          resolve({});
        }
      }, 100);
    });
  }
  saveRefined(entity: Entity) {
    throw new Error('Not used by our design!');
  }
}

export class ProviderDataTransformer {
  refine(rawData: RawDataType): Entity {
    return rawData as Entity;
  }
}

export type ProviderNotation = {
  providerId: number;
  sessionId: number;
  name: string;
  versionId: number;
  providerVersion: string;
}