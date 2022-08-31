import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchAllFolders } from '../actions/index';

const MessageActionButtons = () => {
  const dispatch = useDispatch();
  const { isLoading, folders, error } = useSelector(
    state => state?.allMessages,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moveToFolder, setMoveToFolder] = useState('');

  useEffect(
    () => {
      dispatch(fetchAllFolders());
    },
    [dispatch],
  );

  const openMoveModal = () => {
    setIsModalVisible(true);
  };

  const closeMoveModal = () => {
    setIsModalVisible(false);
  };

  const handleOnChangeFolder = e => {
    setMoveToFolder(e.target.value);
  };

  const handleConfirmMoveFolderTo = () => {
    // dispatch(moveMessageToFolder());
    setIsModalVisible(false);
  };

  const moveVaModal = () => {
    return isModalVisible ? (
      <div className="message-actions-buttons-modal">
        <VaModal
          id="move-to-modal"
          large
          modalTitle="Move to:"
          onCloseEvent={closeMoveModal}
          onPrimaryButtonClick={handleConfirmMoveFolderTo}
          onSecondaryButtonClick={closeMoveModal}
          primaryButtonText="Confirm"
          secondaryButtonText="Cancel"
          visible={isModalVisible}
        >
          <div className="modal-body">
            <p>
              This conversation will be moved. Any replies to this message will
              appear in your inbox
            </p>
            {folders.folder.map(folder => (
              <div key={folder.name} className="form-radio-buttons">
                <div className="radio-button">
                  <input
                    type="radio"
                    autoComplete="false"
                    id="defaultId-0"
                    name="defaultName"
                    value={folder.name}
                    onChange={handleOnChangeFolder}
                  />
                  <label name="defaultName-0-label" htmlFor="defaultId-0">
                    {folder.name}
                  </label>
                </div>
              </div>
            ))}
            {isLoading ? <p>Moving Message to: {moveToFolder}</p> : null}
            {error ? <p>{error}</p> : null}
          </div>
        </VaModal>
      </div>
    ) : null;
  };

  return (
    <div className="message-action-buttons vads-l-row vads-u-justify-content--space-around">
      <button type="button" className="message-action-button">
        <i className="fas fa-print" />
        <span className="message-action-button-text">Print</span>
      </button>

      <button type="button" className="message-action-button">
        <i className="fas fa-trash-alt" />
        <span className="message-action-button-text">Delete</span>
      </button>

      <button
        type="button"
        className="message-action-button"
        onClick={openMoveModal}
      >
        <i className="fas fa-folder" />
        <span className="message-action-button-text">Move</span>
      </button>
      {moveVaModal()}
      <button type="button" className="message-action-button">
        <i className="fas fa-reply" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

export default MessageActionButtons;
