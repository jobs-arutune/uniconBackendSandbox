import { Entity } from '../engine/entity';

abstract class RuleAbstract {
  constructor() {}
}

export class CompareRule extends RuleAbstract {
  constructor(private firstEntity: Entity, private secondEntity: Entity) {
    super();
  }
}
