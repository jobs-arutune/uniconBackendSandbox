import { DataModel } from './dataModel';
import { Transformer } from './transformer';

export class Orchestrator {
  constructor(private dataModel: DataModel, private transformer: Transformer) {}
  run() {
    const rawData = this.dataModel.getData();
    const refinedData = this.transformer.refine(rawData);
    this.dataModel.saveRefined(refinedData);
  }
}
