/*
Redux action that handles API calls. Currently mocked, but the imports needed are 
below whenever sandbox environments for local dev are set up. 

This is also where GA events may be fired for successful / unsuccessful api calls
*/

// import recordEvent from 'platform/monitoring/record-event';
// import { apiRequest } from 'platform/utilities/api';
// import { getAPI } from '../../../facility-locator/config';
import React from 'react';
import mockData from '../tests/fixtures/messages-response.json';

export const MESSAGES_RETREIVE_STARTED = 'MESSAGES_RETREIVE_STARTED';
export const MESSAGES_RETREIVE_SUCCEEDED = 'MESSAGES_RETREIVE_SUCCEEDED';
export const MESSAGES_RETREIVE_FAILED = 'MESSAGES_RETREIVE_FAILED';
export const MESSAGE_DELETE = 'MESSAGE_DELETE';
export const SHOW_ATTACHMENT = 'SHOW_ATTACHMENT';

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
  dispatch({ type: MESSAGES_RETREIVE_STARTED });

  const response = await retrieveMessages();
  if (response.errors) {
    // handles errors and dispatch error action
    // fire GA event for error
    const error = response.errors[0];
    dispatch({
      type: MESSAGES_RETREIVE_FAILED,
      response: error,
    });
  } else {
    // dispatch success action and GA event
    dispatch({
      type: MESSAGES_RETREIVE_SUCCEEDED,
      response,
    });
  }
};

// eslint-disable-next-line spaced-comment
export const deleteMessage = (/*id*/) => async dispatch => {
  // eslint-disable-next-line no-console
  console.log('delete message');
  dispatch({ type: MESSAGE_DELETE });

  /*
  const api = getAPI();
  const url = `${api.baseUrl}/messages/${id}`;
  */

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });

  /*
  API CALL FOR WHEN WE CAN HIT BACKEND
  return new Promise((resolve, reject) => {
    fetch(url, api.settings)
      .then(res => res.json())
      .then(error => reject(error));
  });
  */
};

export const viewAttachment = (/* msgId , attId */) => async dispatch => {
  // eslint-disable-next-line no-console
  console.log('view attachment');
  dispatch({ type: SHOW_ATTACHMENT });

  /*
  const api = getAPI();
  const url = `${api.baseUrl}/messages/${msgId}/attachment/${attId}`;
  */

  return <i className="fa fa-paperclip attachment-icon" />;

  /*
  API CALL FOR WHEN WE CAN HIT BACKEND
  return new Promise((resolve, reject) => {
    fetch(url, api.settings)
      .then(res => res.json())
      .then(error => reject(error));
  });
  */
};
