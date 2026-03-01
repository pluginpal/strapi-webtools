import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  SubNavLink,
  Tooltip,
} from '@strapi/design-system';
import { Lock } from '@strapi/icons';
import { LockedAddonMenuItemProps } from '../../types/pro-addons';
import TrialModal from '../TrialModal';

const LockedAddonMenuItem: React.FC<LockedAddonMenuItemProps> = ({ addon }) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <Tooltip
        description={formatMessage({
          id: 'webtools.sidebar.locked_addon.tooltip',
          defaultMessage: 'Start free trial to unlock',
        })}
      >
        <SubNavLink
          onClick={handleClick}
          style={{
            cursor: 'pointer',
            opacity: 0.5,
            pointerEvents: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock width="12px" height="12px" />
            {addon.name}
          </span>
        </SubNavLink>
      </Tooltip>

      <TrialModal
        addon={addon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LockedAddonMenuItem;
