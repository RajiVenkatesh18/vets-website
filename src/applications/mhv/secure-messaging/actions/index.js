/*
Redux action that handles API calls. Currently mocked, but the imports needed are 
below whenever sandbox environments for local dev are set up. 

This is also where GA events may be fired for successful / unsuccessful api calls
*/

// import recordEvent from 'platform/monitoring/record-event';
// import { apiRequest } from 'platform/utilities/api';

import mockData from '../tests/fixtures/messages-response.json';
import folderMockData from '../tests/fixtures/folder-response.json';

export const MESSAGES_RETRIEVE_STARTED = 'MESSAGES_RETRIEVE_STARTED';
export const MESSAGES_RETRIEVE_SUCCEEDED = 'MESSAGES_RETRIEVE_SUCCEEDED';
export const MESSAGES_RETRIEVE_FAILED = 'MESSAGES_RETRIEVE_FAILED';
export const MESSAGE_MOVE_STARTED = 'MESSAGE_MOVE_STARTED';
export const MESSAGE_MOVE_SUCCEEDED = 'MESSAGE_MOVE_SUCCEEDED';
export const MESSAGE_MOVE_FAILED = 'MESSAGE_MOVE_FAILED';
export const FETCH_ALL_FOLDERS_STARTED = 'FETCH_ALL_FOLDERS_STARTED';
export const FETCH_ALL_FOLDERS_FAILED = 'FETCH_ALL_FOLDERS_FAILED';
export const FETCH_ALL_FOLDERS_SUCCEEDED = 'FETCH_ALL_FOLDERS_SUCCEEDED';
// const SECURE_MESSAGES_URI = '/mhv/messages';

const mockMessages = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });
};

const retrieveMessages = async () => {
  try {
    // replace with apiRequest when endpoint is ready
    return await mockMessages();
  } catch (error) {
    return error;
  }
};

export const getAllMessages = () => async dispatch => {
  dispatch({ type: MESSAGES_RETRIEVE_STARTED });

  const response = await retrieveMessages();
  if (response.errors) {
    // handles errors and dispatch error action
    // fire GA event for error
    const error = response.errors[0];
    dispatch({
      type: MESSAGES_RETRIEVE_FAILED,
      response: error,
    });
  } else {
    // dispatch success action and GA event
    dispatch({
      type: MESSAGES_RETRIEVE_SUCCEEDED,
      response,
    });
  }
};

// Fetch all folders
const mockAllFolders = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(folderMockData);
    }, 1500);
  });
};

const fetchFolders = async () => {
  try {
    return await mockAllFolders();
  } catch (error) {
    return error;
  }
};

export const fetchAllFolders = () => async dispatch => {
  dispatch({ type: FETCH_ALL_FOLDERS_STARTED });

  const response = await fetchFolders();
  if (response.errors) {
    const error = response.errors[0];
    dispatch({
      type: FETCH_ALL_FOLDERS_FAILED,
      response: error,
    });
  } else {
    dispatch({
      type: FETCH_ALL_FOLDERS_SUCCEEDED,
      payload: response,
    });
  }
};
