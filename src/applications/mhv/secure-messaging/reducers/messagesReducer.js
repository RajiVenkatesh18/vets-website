import {
  MESSAGES_RETRIEVE_STARTED,
  MESSAGES_RETRIEVE_SUCCEEDED,
  MESSAGES_RETRIEVE_FAILED,
} from '../actions';

const initialState = {
  isLoading: true,
  messages: null,
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
    default:
      return state;
  }
};
export default { allMessages };
