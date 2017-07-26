// tslint:disable:no-unused-variable
import {StateWithHistory} from 'redux-undo';
import {BoxPlotDef} from 'vega-lite/build/src/compositemark/boxplot';
import {EncodingWithFacet} from 'vega-lite/build/src/encoding';
import {MarkDef} from 'vega-lite/build/src/mark';
import {FacetedCompositeUnitSpec, GenericUnitSpec, isUnitSpec} from 'vega-lite/build/src/spec';
import {State, StateBase} from '../models/index';
// tslint:enable:no-unused-variable

import {getTopSpecQueryItem} from 'compassql/build/src/model';
import {createSelector} from 'reselect';
import {Data} from 'vega-lite/build/src/data';
import {OneOfFilter, RangeFilter} from 'vega-lite/build/src/filter';
import {extractPlotObjects, PlotObject} from '../models/plot';
import {Result} from '../models/result';
import {getTransforms} from '../models/shelf/spec';
import {selectData} from './dataset';
import {selectFilters, selectIsQuerySpecific} from './shelf';

const selectMainResult = (state: State) => state.present.result.main;

export const selectMainSpec = createSelector(
  selectIsQuerySpecific,
  selectData,
  selectFilters,
  selectMainResult,
  (
    isQuerySpecific: boolean,
    data: Data,
    filters: Array<RangeFilter|OneOfFilter>,
    mainResult: Result
  ): FacetedCompositeUnitSpec => {
    if (!isQuerySpecific || !mainResult.modelGroup) {
      return undefined;
    }
    return {
      data: data,
      transform: getTransforms(filters),
      ...getTopSpecQueryItem(mainResult.modelGroup).spec
    };
  }
);

export const selectPlotList: {
  [k in ResultType]?: Selector<StateWithHistory<StateBase>, PlotObject[]>
} = RESULT_TYPES.reduce((selectors, resultType) => {
  selectors[resultType] = createSelector(
    selectIsQuerySpecific,
    selectData,
    selectFilters,
    selectResult[resultType],
    (
      isQuerySpecific: boolean,
      data: Data,
      filters: Array<RangeFilter|OneOfFilter>,
      result: Result,
    ) => {
      if (
          // For main, do not return list if specific.  For others, do not return list if not specific.
          ((resultType === 'main') === isQuerySpecific) ||
          !result.modelGroup
        ) {
        return undefined;
      }
      // FIXME(https://github.com/vega/voyager/issues/448): use data and filter
      return extractPlotObjects(result.modelGroup);
    }
  );
  return selectors;
}, {});
