import { Action } from '@ngrx/store';
import { MasterScreener, MasterScreenerMetaData } from '../models/master-screener';

export const MasterScreenerActionsTypes = {
  CHANGE_VERSION: '[MASTER_SCREENER] CHANGE_VERSION',
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

  constructor(public payload: MasterScreener | boolean) { }
}
/***********************************************************************************/



/* LOAD VERSIONS MAY RESULT IN NETWORK CALL IF NOT FOUND IN CACHE */
export class LoadScreenerVersion implements Action {
  type = MasterScreenerActionsTypes.LOAD_VERSION;

  constructor(public payload: number) { }
}

export type MasterScreenerActions =
    ChangeScreenerVersion
  | LoadScreenerVersion
