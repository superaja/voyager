
import {FieldQuery} from 'compassql/build/src/query/encoding';
import {Query} from 'compassql/build/src/query/query';
import {SHORT_WILDCARD} from 'compassql/build/src/wildcard';
import {ResultIndex} from '../models/result';
import {QueryCreator} from './base';

function makeFieldSuggestionQueryCreator(params: {
  type: keyof ResultIndex,
  title: string,
  additionalFieldQuery: FieldQuery
}): QueryCreator {
  const {type, title, additionalFieldQuery} = params;
  return {
    type,
    title,
    filterGroupBy: undefined,
    createQuery(query: Query): Query {
      return {
        spec: {
          ...query.spec,
          encodings: [
            ...query.spec.encodings,
            additionalFieldQuery
          ]
        },
        groupBy: 'fieldTransform',
        // FieldOrder should dominates everything else
        orderBy: ['fieldOrder', 'aggregationQuality', 'effectiveness'],
        // aggregationQuality should be the same
        chooseBy: ['aggregationQuality', 'effectiveness'],
        config: { autoAddCount: false }
      };
    }
  };
}

export const addCategoricalField = makeFieldSuggestionQueryCreator({
  type: 'addCategoricalField',
  title: 'Add Categorical Field',
  additionalFieldQuery: {
    channel: SHORT_WILDCARD,
    field: SHORT_WILDCARD,
    type: 'nominal'
  }
});

export const addQuantitativeField = makeFieldSuggestionQueryCreator({
  type: 'addQuantitativeField',
  title: 'Add Quantitative Field',
  additionalFieldQuery: {
    channel: SHORT_WILDCARD,
    bin: SHORT_WILDCARD,
    aggregate: SHORT_WILDCARD,
    field: SHORT_WILDCARD,
    type: 'quantitative'
  }
});

export const addTemporalField = makeFieldSuggestionQueryCreator({
  type: 'addTemporalField',
  title: 'Add Temporal Field',
  additionalFieldQuery: {
    channel: SHORT_WILDCARD,
    hasFn: true, // Do not show raw time in the summary
    timeUnit: SHORT_WILDCARD,
    field: SHORT_WILDCARD,
    type: 'temporal'
  }
});
