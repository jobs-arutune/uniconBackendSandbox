// https://towardsdatascience.com/dmot-a-design-pattern-for-etl-data-model-orchestrator-transformer-c0d7baacb8c7
import { Entity } from '../engine/entity';

export class DataModel {
  getData() {
    return new Entity('asdf');
  }
  saveRefined(entity: Entity) {
    console.log('saving entity to db...', entity);
  }
}