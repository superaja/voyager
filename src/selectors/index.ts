// Imports to satisfy --declarations build requirements
// https://github.com/Microsoft/TypeScript/issues/9944

// tslint:disable-next-line:no-unused-variable
import {StateWithHistory} from 'redux-undo';
import {State} from '../models';
import {Bookmark} from '../models/bookmark';
import {VoyagerConfig} from '../models/config';
// import {PlotObject} from '../models/plot';
// tslint:disable-next-line:no-unused-variable
import {StateBase} from '../models/index';

export * from './dataset';
export * from './result';
export * from './shelf';

export const selectBookmark = (state: State): Bookmark => state.present.bookmark;
export const selectConfig = (state: State): VoyagerConfig => state.present.config;
