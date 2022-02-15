import { Injectable } from '@nestjs/common';
import { Entity } from './entities/engine/entity';
import { Feature } from './entities/engine/feature';
import { Attribute } from './entities/engine/attribute';
import {
  CompareOperator,
  OperatorAbstract,
  OperatorValues,
} from './entities/engine/operator';
import { Amount } from './entities/engine/amount';
import { Measurement } from './entities/engine/measurement';
import { Property } from './entities/engine/property';

@Injectable()
export class AppService {
  async fillData(): Promise<boolean> {
    debugger;
    return false;
  }

  getHello(): string/*Promise<string>*/ {
    return ''
    // const feature = this.getFeatures()[0];
    // await feature.test();
    // return feature.toString();
  }

  /*getFeatures(): Feature[] {
    return this.features;
  }*/
  async addEntities() {
    /*const feature1 = new Feature(
      { inn: 7703270067 },
      [
        new Attribute(
          new Property('сумма'),
          new Entity('арбитражных дел в качестве ответчика'),
          's2001',
        ),
        new CompareOperator(OperatorValues.noMoreThan),
        [
          new PercentOperator(20),
          new Attribute(new Property('сумма'), new Entity('выручка'), 's6004'),
        ]
    ]);
    await feature1.init();
    this.features.push(feature1);*/
  }

  features: Feature[] = [];
}
