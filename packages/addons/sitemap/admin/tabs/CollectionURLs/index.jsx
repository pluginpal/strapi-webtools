import React, { useState } from 'react';
import { Button, EmptyStateLayout } from '@strapi/design-system';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ExternalLink } from '@strapi/icons';

import {
  deleteContentType,
  discardModifiedContentTypes,
  onChangeContentTypes,
  submitModal,
} from '../../state/actions/Sitemap';
import List from '../../components/List/Collection';
import ModalForm from '../../components/ModalForm';

const CollectionURLs = () => {
  const state = useSelector((store) => store.get('sitemap', Map()));
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const { formatMessage } = useIntl();
  const [langcode, setLangcode] = useState('und');

  const handleModalSubmit = (e) => {
    e.preventDefault();
    dispatch(submitModal());
    setModalOpen(false);
    setUid(null);
  };

  const handleModalOpen = (editId, lang) => {
    if (editId) setUid(editId);
    if (lang) setLangcode(lang);
    setModalOpen(true);
  };

  const handleModalClose = (closeModal = true) => {
    if (closeModal) {
      setModalOpen(false);
      setUid(null);
    }
    dispatch(discardModifiedContentTypes());
  };

  // Loading state
  if (!state.getIn(['settings', 'contentTypes'])) {
    return null;
  }

  if (state.get('contentTypes').size === 0) {
    return (
      <EmptyStateLayout
        content={formatMessage({
          id: 'webtools.collection-urls.contenttypes.table.empty',
          defaultMessage: 'Before you can add collections to the sitemap, you need to enable Webtools for at least one content type.',
        })}
        action={(
          <Button
            variant="secondary"
            tag={Link}
            to="https://docs.pluginpal.io/webtools/usage"
            startIcon={<ExternalLink />}
            target="_blank"
          >
            {formatMessage({
              id: 'webtools.settings.button.read_docs',
              defaultMessage: 'Learn how to enable Webtools',
            })}
          </Button>
        )}
        shadow="tableShadow"
        hasRadius
      />
    );
  }

  return (
    <div>
      <List
        items={state.getIn(['settings', 'contentTypes'])}
        openModal={(editId, lang) => handleModalOpen(editId, lang)}
        onDelete={(key, lang) => dispatch(deleteContentType(key, lang))}
      />
      <ModalForm
        contentTypes={state.get('contentTypes')}
        allowedFields={state.get('allowedFields')}
        modifiedState={state.get('modifiedContentTypes')}
        onSubmit={(e) => handleModalSubmit(e)}
        onCancel={(closeModal) => handleModalClose(closeModal)}
        onChange={
          (
            contentType,
            lang,
            key,
            value,
          ) => dispatch(onChangeContentTypes(contentType, lang, key, value))
        }
        isOpen={modalOpen}
        id={uid}
        lang={langcode}
        type="collection"
      />
    </div>
  );
};

export default CollectionURLs;
