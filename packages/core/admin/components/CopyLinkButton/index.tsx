import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNotification } from '@strapi/helper-plugin';
import { LinkButton } from '@strapi/design-system';
import { Link } from '@strapi/icons';
import getTrad from '../../helpers/getTrad';

const CopyLinkButton = ( { url } ) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();

  return (
    <CopyToClipboard
      text={ url }
      onCopy={ () => {
        toggleNotification( {
          type: 'success',
          message: {
            id: getTrad( 'notification.success.permalink-copied' ),
            defaultMessage: 'Permalink copied to the clipboard',
          },
        } );
      } }
    >
      <LinkButton
        size="S"
        startIcon={ <Link /> }
        variant="secondary"
        style={ { width: '100%' } }
        to={null}
      >
        { formatMessage( {
          id: getTrad( 'form.button.copy-permalink' ),
          defaultMessage: 'Copy permalink',
        } ) }
      </LinkButton>
    </CopyToClipboard>
  );
};

CopyLinkButton.propTypes = {
  url: PropTypes.string.isRequired,
};

export default memo( CopyLinkButton );
