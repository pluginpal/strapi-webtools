import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';

import {
  discardModifiedContentTypes,
  onChangeCustomEntry,
  submitModal,
  deleteCustomEntry,
} from '../../state/actions/Sitemap';
import List from '../../components/List/Custom';
import ModalForm from '../../components/ModalForm';

const CustomURLs = ({ id }) => {
  const state = useSelector((store) => store.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState(null);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModal(id));
    setModalOpen(false);
    setUid(null);
  };

  const handleModalOpen = (editId) => {
    if (editId) setUid(editId);
    setModalOpen(true);
  };

  const handleModalClose = (closeModal = true) => {
    if (closeModal) setModalOpen(false);
    dispatch(discardModifiedContentTypes(id));
    setUid(null);
  };

  // Loading state
  if (!state.getIn(['settings', 'sitemaps', id, 'customEntries'])) {
    return null;
  }

  return (
    <div>
      <List
        items={state.getIn(['settings', 'sitemaps', id, 'customEntries'])}
        openModal={(editId) => handleModalOpen(editId)}
        onDelete={(key) => dispatch(deleteCustomEntry(id, key))}
        prependSlash
      />
      <ModalForm
        modifiedState={state.get('modifiedCustomEntries')}
        isOpen={modalOpen}
        id={uid}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={(closeModal) => handleModalClose(closeModal)}
        onChange={(url, key, value) => dispatch(onChangeCustomEntry(url, key, value))}
        type="custom"
      />
    </div>
  );
};

export default CustomURLs;
