import {
  FETCH_ALL_FOLDERS_STARTED,
  FETCH_ALL_FOLDERS_FAILED,
  FETCH_ALL_FOLDERS_SUCCEEDED,
} from '../actions';

const initialState = {
  isLoading: true,
  folders: null,
  error: null,
};

const allFolders = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_FOLDERS_STARTED:
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case FETCH_ALL_FOLDERS_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        folders: action.payload,
        error: '',
      };
    case FETCH_ALL_FOLDERS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    default:
      return state;
  }
};

export default { allFolders };
