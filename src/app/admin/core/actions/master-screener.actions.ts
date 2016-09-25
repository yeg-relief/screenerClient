import { Action } from '@ngrx/store';
import { MasterScreener, MasterScreenerMetaData } from '../models';

export const MasterScreenerActionsTypes = {
  CHANGE_VERSION: '[MASTER_SCREENER] CHANGE_VERSION',
  CHANGE_VERSION_SUCCESS: '[MASTER_SCREENER] CHANGE_VERSION_SUCCESS',
  CHANGE_VERSION_FAILURE: '[MASTER_SCREENER] CHANGE_VERSION_FAILURE',
  LOAD_VERSION: '[MASTER_SCREENER] LOAD_VERSION',
  LOAD_VERSION_SUCCESS: '[MASTER_SCREENER] LOAD_VERSION_SUCCESS',
  LOAD_VERSION_FAILURE: '[MASTER_SCREENER] LOAD_VERSION_FAILURE',
  LOAD_META_DATA: '[MASTER_SCREENER] META_DATA',
  LOAD_META_DATA_SUCCESS: '[MASTER_SCREENER] LOAD_META_DATA_SUCCESS',
  LOAD_META_DATA_FAILURE: '[MASTER_SCREENER] LOAD_META_DATA_FAILURE',
};

/* CHANGE SCREENER VERSION ACTIONS -- USED TO CHANGE WHICH VERSION SELECTED IN UI */
export class ChangeScreenerVersion implements Action {
  type = MasterScreenerActionsTypes.CHANGE_VERSION;

  constructor(public payload: number) { }
}

export class ChangeScreenerVersionSuccess implements Action {
  type = MasterScreenerActionsTypes.CHANGE_VERSION_SUCCESS;

  constructor(public payload: number) {}
}

export class ChangeScreenerVersionFailure implements Action {
  type = MasterScreenerActionsTypes.CHANGE_VERSION_FAILURE;

  constructor(public payload: number) {}
}
/***********************************************************************************/



/* LOAD VERSIONS MAY RESULT IN NETWORK CALL IF NOT FOUND IN CACHE */
export class LoadScreenerVersion implements Action {
  type = MasterScreenerActionsTypes.LOAD_VERSION;

  constructor(public payload: number) { }
}

export class LoadScreenerVersionSuccess implements Action {
  type = MasterScreenerActionsTypes.LOAD_VERSION_SUCCESS;

  constructor(public payload: MasterScreener) { }
}

export class LoadScreenerVersionFailure implements Action {
  type = MasterScreenerActionsTypes.LOAD_VERSION_FAILURE;

  constructor(public payload: number) { }
}
/******************************************************************* */

/* LOAD META DATA ABOUT VERSIONS ON SERVER... VERSION NUMBERS ETC. */
export class LoadMetaData implements Action {
  type = MasterScreenerActionsTypes.LOAD_META_DATA;

  constructor(public payload: any) {}
}

export class LoadMetaDataSuccess implements Action {
  type = MasterScreenerActionsTypes.LOAD_META_DATA_SUCCESS;

  constructor(public payload: MasterScreenerMetaData) {}
}

export class LoadMetaDataFailure implements Action {
  type = MasterScreenerActionsTypes.LOAD_META_DATA_FAILURE;

  constructor(public payload: boolean) {}
}

/******************************************************************* */

export type MasterScreenerActions =
    ChangeScreenerVersion
  | ChangeScreenerVersionSuccess
  | ChangeScreenerVersionFailure
  | LoadScreenerVersion
  | LoadScreenerVersionSuccess
  | LoadScreenerVersionFailure
  | LoadMetaData
  | LoadMetaDataSuccess
  | LoadMetaDataFailure
