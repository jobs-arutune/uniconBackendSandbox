import { Injectable } from '@nestjs/common';
import {
  DataNotation,
  RuleFactory,
  RuleNotation,
  RuleOrchestrator
} from './entities/engine/rule';
import { OperatorTypes, OperatorValues } from './entities/engine/operator';
import {
  ProviderDataModel,
  ProviderDataTransformer,
  ProviderNotation,
} from './entities/engine/provider';
import { getProviderByIdAndSession } from '../data/db-mocks/provider';
import { saveRule, getRuleById } from '../data/db-mocks/rule';

export const CURRENT_SESSION_ID = 341235234;
export const OLD_SESSION = 341231111;

@Injectable()
export class AppService {
  // private ruleOrchestratorCurrentSession: RuleOrchestrator;
  private ruleId: number;
  constructor() {}

  async init() {
    /*const providersCurrentSession = [
      await getProviderByIdAndSession(1, CURRENT_SESSION_ID),
      await getProviderByIdAndSession(2, CURRENT_SESSION_ID),
    ];
    // 1. Инициализация движка: создаем версии провайдеров для ETL и тд
    this.ruleOrchestratorCurrentSession = new RuleOrchestrator(
      CURRENT_SESSION_ID,
      providersCurrentSession.map(
        (providerNotation) => new ProviderDataModel(providerNotation),
      ),
      providersCurrentSession.map(
        (providerNotation) => new ProviderDataTransformer(),
      ),
    );*/
  }

  async ruleCreate() {
    // 2. Создаем правило:
    // this comes from UI,
    // ATTENTION: на данном этапе мы не зависим от сесси, провайдера и тд!

    // ниже я пробую разные правила

    // "Сумма арбитражных дел в качестве ответчика не более 20% от выручки и количество невыигранных дел в качестве истца не более 20"
    //
    const ruleNotation: RuleNotation = {
      firstAttribute: {
        firstAttribute: 3,
        operator: OperatorValues.lessThan,
        secondAttribute: {
          firstAttribute: 4,
          operator: OperatorValues.percent,
          secondAttribute: 5,
        },
      },
      operator: OperatorValues.and,
      secondAttribute: {
        firstAttribute: 6,
        operator: OperatorValues.lessThan,
        secondAttribute: 5,
      },
    };
    // "Сумма арбитражных дел в качестве ответчика не более 20% от выручки" - YES
    /* const ruleNotation: RuleNotation = {
      firstAttribute: 3,
      operator: OperatorValues.lessThan,
      secondAttribute: {
        firstAttribute: 4,
        operator: OperatorValues.percent,
        secondAttribute: 5,
      },
    }; */
    // making request to db here...data as it comes from our db (attributes table):
    this.ruleId = await saveRule(ruleNotation);
    return this.ruleId;
  }

  async ruleCheck(): Promise<string> {
    if (!this.ruleId) {
      this.ruleId = await this.ruleCreate();
    }
    // 3. проверка для конкретного ИНН в текущей сессии (т.е. провайдеров не меняем):
    const dataNotation: DataNotation = {
      inn: 7703270067,
      sessionId: CURRENT_SESSION_ID,
    };
    const ruleNotation = await getRuleById(this.ruleId);
    const ruleClass = await RuleFactory.create(ruleNotation, dataNotation);
    await RuleFactory.fetch(ruleClass);

    const res = ruleClass.calculate();
    return res.toString();
  }

  async ruleCheckHistorical(): Promise<string> {
    // 4. проверка исторического значения правила для заданной ИНН и сессии:
    // предполагаем, что поменялся АПИ
    if (!this.ruleId) {
      this.ruleId = await this.ruleCreate();
    }
    // 3. проверка для конкретного ИНН в текущей сессии (т.е. провайдеров не меняем):
    const dataNotation: DataNotation = {
      inn: 7703270067,
      sessionId: OLD_SESSION,
    };
    const ruleNotation = await getRuleById(this.ruleId);
    const ruleClass = await RuleFactory.create(ruleNotation, dataNotation);
    await RuleFactory.fetch(ruleClass);

    const res = ruleClass.calculate();
    return res.toString();
  }

  /* async ruleCheckHistorical(sessionId: number = OLD_SESSION) {
    // 4. проверка исторического значения правила для заданной ИНН и сессии:
    // предполагаем, что поменялся АПИ
    const dataNotation: DataNotation = {
      inn: 7703270067,
      sessionId,
    };
    const { notation: ruleNotation } = await getRuleById(this.ruleId);
    const ruleClass = await RuleFactory.create(ruleNotation, dataNotation);

    const providers: ProviderNotation[] = [
      await getProviderByIdAndSession(1, dataNotation.sessionId),
      await getProviderByIdAndSession(2, dataNotation.sessionId),
    ];
    const ruleOrchestratorOldSession = new RuleOrchestrator(
      dataNotation.sessionId,
      providers.map(
        (providerNotation) => new ProviderDataModel(providerNotation),
      ),
      providers.map((providerNotation) => new ProviderDataTransformer()),
    );

    const res = ruleOrchestratorOldSession.checkRule(ruleClass);
    return res;
  } */
}
