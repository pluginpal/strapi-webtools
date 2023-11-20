import React from "react";

import {
  Box,
  Divider,
  Stack,
} from "@strapi/design-system";

const Dropdown = ({
  children
}) => {
  return (
    <>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>
      <Stack size={2}>
        {children}
      </Stack>
    </>
  );
};

export default Dropdown;
