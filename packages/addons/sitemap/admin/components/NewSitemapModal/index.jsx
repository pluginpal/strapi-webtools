import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Modal,
  Typography,
  Button,
  Field,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { useNavigate } from 'react-router-dom';

const NewSitemapModal = (props) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const navigate = useNavigate();
  const { post } = useFetchClient();
  const [name, setName] = useState(null);
  const {
    children,
  } = props;

  const onCreate = () => {
    post('/webtools-addon-sitemap/create-new-sitemap', { name })
      .then(() => {
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: 'sitemap.NewSitemapModal.Success',
            defaultMessage: 'Sitemap created successfully',
          }),
        });
        navigate(`/plugins/webtools/sitemap/${name}`);
      })
      .catch((err) => {
        toggleNotification({
          type: 'danger',
          message: err.message,
        });
      });
  };

  return (
    <Modal.Root>
      <Modal.Trigger>
        {children}
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Typography textColor="neutral800" variant="omega" fontWeight="bold">
            {formatMessage({ id: 'sitemap.NewSitemapModal.Label', defaultMessage: 'New sitemap' })}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Field.Root>
            <Field.Label>
              {formatMessage({ id: 'sitemap.NewSitemapModal.Name.Label', defaultMessage: 'Name' })}
            </Field.Label>
            <Field.Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">
              {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
            </Button>
          </Modal.Close>
          <Button
            onClick={() => onCreate()}
            disabled={!name}
          >
            {formatMessage({ id: 'sitemap.Button.Create', defaultMessage: 'Create' })}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default NewSitemapModal;
