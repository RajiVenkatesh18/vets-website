import {
  MESSAGES_RETRIEVE_STARTED,
  MESSAGES_RETRIEVE_SUCCEEDED,
  MESSAGES_RETRIEVE_FAILED,
  FETCH_ALL_FOLDERS_STARTED,
  FETCH_ALL_FOLDERS_FAILED,
  FETCH_ALL_FOLDERS_SUCCEEDED,
} from '../actions';

const initialState = {
  isLoading: true,
  messages: null,
  folders: null,
  error: null,
};

const allMessages = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_RETRIEVE_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case MESSAGES_RETRIEVE_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        messages: action.response,
      };
    case MESSAGES_RETRIEVE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
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
        folders: '',
        error: action.response,
      };
    default:
      return state;
  }
};
export default { allMessages };
