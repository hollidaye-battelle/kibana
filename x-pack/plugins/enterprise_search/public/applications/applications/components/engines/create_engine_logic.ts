/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { kea, MakeLogicType } from 'kea';

import { Status } from '../../../../../common/types/api';
import { KibanaLogic } from '../../../shared/kibana';

import {
  CreateEngineApiLogic,
  CreateEngineApiLogicActions,
} from '../../api/engines/create_engine_api_logic';
import { ENGINES_PATH } from '../../routes';

import { EnginesListLogic } from './engines_list_logic';

export interface CreateEngineLogicActions {
  createEngine: () => void;
  createEngineRequest: CreateEngineApiLogicActions['makeRequest'];
  engineCreateError: CreateEngineApiLogicActions['apiError'];
  engineCreated: CreateEngineApiLogicActions['apiSuccess'];
  fetchEngines: () => void;
  setEngineName: (engineName: string) => { engineName: string };
  setSelectedIndices: (indices: string[]) => {
    indices: string[];
  };
}

export interface CreateEngineLogicValues {
  createDisabled: boolean;
  createEngineError?: typeof CreateEngineApiLogic.values.error;
  createEngineStatus: typeof CreateEngineApiLogic.values.status;
  engineName: string;
  engineNameStatus: 'complete' | 'incomplete';
  formDisabled: boolean;
  indicesStatus: 'complete' | 'incomplete';
  selectedIndices: string[];
}

export const CreateEngineLogic = kea<
  MakeLogicType<CreateEngineLogicValues, CreateEngineLogicActions>
>({
  actions: {
    createEngine: true,
    setEngineName: (engineName: string) => ({ engineName }),
    setSelectedIndices: (indices: string[]) => ({ indices }),
  },
  connect: {
    actions: [
      EnginesListLogic,
      ['fetchEngines'],
      CreateEngineApiLogic,
      [
        'makeRequest as createEngineRequest',
        'apiSuccess as engineCreated',
        'apiError as engineCreateError',
      ],
    ],
    values: [CreateEngineApiLogic, ['status as createEngineStatus', 'error as createEngineError']],
  },
  listeners: ({ actions, values }) => ({
    createEngine: () => {
      actions.createEngineRequest({
        engineName: values.engineName,
        indices: values.selectedIndices,
      });
    },
    engineCreated: () => {
      actions.fetchEngines();
      KibanaLogic.values.navigateToUrl(ENGINES_PATH);
    },
  }),
  path: ['enterprise_search', 'content', 'create_engine_logic'],
  reducers: {
    engineName: [
      '',
      {
        setEngineName: (_, { engineName }) => engineName,
      },
    ],
    selectedIndices: [
      [],
      {
        setSelectedIndices: (_, { indices }) => indices,
      },
    ],
  },
  selectors: ({ selectors }) => ({
    createDisabled: [
      () => [selectors.indicesStatus, selectors.engineNameStatus],
      (
        indicesStatus: CreateEngineLogicValues['indicesStatus'],
        engineNameStatus: CreateEngineLogicValues['engineNameStatus']
      ) => indicesStatus !== 'complete' || engineNameStatus !== 'complete',
    ],
    engineNameStatus: [
      () => [selectors.engineName],
      (engineName: string) => {
        if (engineName.length === 0) return 'incomplete';
        return 'complete';
      },
    ],
    formDisabled: [
      () => [selectors.createEngineStatus],
      (createEngineStatus: CreateEngineLogicValues['createEngineStatus']) =>
        createEngineStatus === Status.LOADING,
    ],
    indicesStatus: [
      () => [selectors.selectedIndices],
      (selectedIndices: CreateEngineLogicValues['selectedIndices']) =>
        selectedIndices.length > 0 ? 'complete' : 'incomplete',
    ],
  }),
});
