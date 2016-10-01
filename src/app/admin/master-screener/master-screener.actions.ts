import { Action } from '@ngrx/store';
import { MasterScreener } from '../models/master-screener';

export const MasterScreenerActionsTypes = {
  CHANGE_MASTER_SCREENER_VERSION: '[MASTER_SCREENER] CHANGE_MASTER_SCREENER_VERSION',
  LOAD_MASTER_SCREENER_VERSION: '[MASTER_SCREENER] LOAD_MASTER_SCREENER_VERSION',
  LOAD_VERSIONS_INFO: '[MASTER_SCREENER] LOAD_VERSIONS_INFO',
  CHANGE_VERSIONS_INFO: '[MASTER_SCREENER] CHANGE_VERSIONS_INFO'
};

/* CHANGE SCREENER VERSION ACTIONS -- USED TO CHANGE WHICH VERSION SELECTED IN UI */
export class ChangeScreenerVersion implements Action {
  type = MasterScreenerActionsTypes.CHANGE_MASTER_SCREENER_VERSION;

  constructor(public payload: MasterScreener | boolean) { }
}
/***********************************************************************************/



/* LOAD VERSIONS MAY RESULT IN NETWORK CALL IF NOT FOUND IN CACHE */
export class LoadScreenerVersion implements Action {
  type = MasterScreenerActionsTypes.LOAD_MASTER_SCREENER_VERSION;

  constructor(public payload: number) { }
}

export class LoadScreenerVersionsInfo implements Action {
  type = MasterScreenerActionsTypes.LOAD_VERSIONS_INFO;

  constructor(public payload: any) {}
}

export class ChangeScreenerVersionInfo implements Action {
  type = MasterScreenerActionsTypes.CHANGE_VERSIONS_INFO;

  constructor(public payload: number[] | boolean) {}
}

export type MasterScreenerActions =
    ChangeScreenerVersion
  | LoadScreenerVersion
  | LoadScreenerVersionsInfo
  | ChangeScreenerVersionInfo
