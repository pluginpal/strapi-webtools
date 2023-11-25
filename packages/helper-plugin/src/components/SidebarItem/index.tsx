import React, { useState } from 'react';

import {
  Box,
  Divider,
  Typography,
  Stack,
  Icon,
  Flex,
} from '@strapi/design-system';
import { Play } from '@strapi/icons';

const EditView = ({
  label,
  children,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <Box
      as="aside"
      aria-labelledby="webtools-sidebar-title"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      padding={4}
      shadow="tableShadow"
      onClick={() => !opened && setOpened(true)}
    >
      <Flex onClick={() => opened && setOpened(false)}>
        <Typography
          textColor="neutral600"
          variant="sigma"
          id="webtools-sidebar-title"
        >
          {label}
        </Typography>
        <Icon
          width="0.5rem"
          height="0.5rem"
          as={Play}
          transform={!opened ? 'rotate(90deg)' : 'rotate(-90deg)'}
          marginLeft="auto"
        />
      </Flex>
      {opened && (
      <>
        <Box paddingTop={2} paddingBottom={6}>
          <Divider />
        </Box>
        <Stack size={2}>
          {children}
        </Stack>
      </>
      )}
    </Box>
  );
};

export default EditView;
