import React from 'react';

import {
  Typography,
  Icon,
  Flex,
} from '@strapi/design-system';
import { Play } from '@strapi/icons';

type Props = {
  label: string,
  onClick: Function,
  iconProps?: object
};

const ActionButton: React.FC<Props> = ({
  label,
  onClick,
  iconProps,
}) => {
  return (
    <Flex onClick={onClick}>
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
        marginLeft="auto"
        {...iconProps}
      />
    </Flex>
  );
};

export default ActionButton;
