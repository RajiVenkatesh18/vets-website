import { combineReducers } from 'redux';

import allMessages from './messagesReducer';
import allFolders from './foldersReducer';

export default {
  secureMessaging: combineReducers({ allMessages, allFolders }),
};
