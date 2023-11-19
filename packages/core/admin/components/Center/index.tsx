import React, { PropsWithChildren, FC } from 'react';

type Props = PropsWithChildren<{}>;

const Center: FC<Props> = ({ children }) => (
  <div style={{
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  >
    {children}
  </div>
);

export default Center;
