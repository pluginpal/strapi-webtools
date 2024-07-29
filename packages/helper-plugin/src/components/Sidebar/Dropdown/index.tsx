import React from 'react';

import {
  Box,
  Divider,
} from '@strapi/design-system';

const Dropdown = ({
  children,
}) => {
  return (
    <>
      <Box paddingTop={2} paddingBottom={2}>
        <Divider />
      </Box>
      <Box padding={4}>
        {children}
      </Box>
    </>
  );
};

export default Dropdown;
