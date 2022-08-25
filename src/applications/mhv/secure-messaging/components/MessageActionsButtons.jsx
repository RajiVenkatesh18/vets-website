import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MessageActionButtons = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moveToFolder, setMoveToFolder] = useState('');

  const folderList = [
    {
      name: 'Deleted Messages',
    },
    {
      name: 'Folder 1',
    },
    {
      name: 'Folder 2',
    },
    {
      name: 'Folder 3',
    },
  ];

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
    // console.log('will be moving message to: ', moveToFolder);
    setIsModalVisible(false);
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
        {isModalVisible ? (
          <>
            <VaModal
              large
              // clickToClose --closes modal if user clicks outside of modal
              initialFocusSelector="Move to"
              modalTitle="Move to:"
              onCloseEvent={closeMoveModal}
              onPrimaryButtonClick={handleConfirmMoveFolderTo}
              onSecondaryButtonClick={closeMoveModal}
              primaryButtonText="Confirm"
              secondaryButtonText="Cancel"
              visible={isModalVisible}
            >
              <p>
                This conversation will be moved. Any replies to this message
                will appear in your inbox
              </p>
              {folderList.map(folder => (
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
              <p>Moving Message to: {moveToFolder}</p>
            </VaModal>
          </>
        ) : null}

        <i className="fas fa-folder" />
        <span className="message-action-button-text">Move</span>
      </button>

      <button type="button" className="message-action-button">
        <i className="fas fa-reply" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

export default MessageActionButtons;
