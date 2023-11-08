import React, { useState } from 'react';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Typography,
  Button
} from '@strapi/design-system';

import Sidebar from '../Sidebar';

const SidebarModal = ({
  label,
  children
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <Sidebar onClick={() => !opened && setOpened(true)}>
      <Sidebar.ActionButton
        label={label}
        onClick={() => opened && setOpened(false)}
        iconProps={{
          transform: !opened ? "rotate(90deg)" : "rotate(-90deg)"
        }}
      />
      {opened && (
        <ModalLayout onClose={() => setOpened((prev) => !prev)} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              {label}
            </Typography>
          </ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter
            startActions={(
              <Button onClick={() => setOpened(prev => !prev)} variant="tertiary">
                Cancel
              </Button>
            )}
            endActions={(
              <Button onClick={() => setOpened(prev => !prev)}>Save</Button>
            )}
          />
        </ModalLayout>
      )}
    </Sidebar>
  );
}

export default SidebarModal;
