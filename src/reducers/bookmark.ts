import {Action, BOOKMARK_ADD_PLOT, BOOKMARK_CLEAR_ALL, BOOKMARK_MODIFY_NOTE, BOOKMARK_REMOVE_PLOT} from '../actions';
import {Bookmark, DEFAULT_BOOKMARK} from '../models';


export function bookmarkReducer(bookmark: Bookmark, action: Action): Bookmark {
  const {count, dict, list} = bookmark;


  switch (action.type) {
    case BOOKMARK_ADD_PLOT: {
      const {plotObject} = action.payload;
      const specKey = JSON.stringify(plotObject.spec);

      return {
        dict: {
          ...dict,
          [specKey]: {
            plotObject: plotObject,
            note: '',
          }
        },
        count: count + 1,
        list: list.concat([specKey])
      };
    }

    case BOOKMARK_MODIFY_NOTE: {
      const {note, spec} = action.payload;
      const specKey = JSON.stringify(spec);
      return {
        dict: {
          ...dict,
          [specKey]: {
            ...dict[specKey],
            note
          }
        },
        count,
        list
      };
    }

    case BOOKMARK_REMOVE_PLOT: {
      const {spec} = action.payload;

      const specKey = JSON.stringify(spec);
      const {[specKey]: _, ...newDict} = dict;
      return {
        dict: newDict,
        count: count - 1,
        list: list.filter(item => item !== specKey)
      };
    }

    case BOOKMARK_CLEAR_ALL: {
      return DEFAULT_BOOKMARK;
    }

    default: {
      return bookmark;
    }
  }
}
