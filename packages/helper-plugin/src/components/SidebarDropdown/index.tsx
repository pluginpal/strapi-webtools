import React, { useState } from 'react';
import Sidebar from '../Sidebar';

const SidebarDropdown = ({
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
        <Sidebar.Dropdown>
          {children}
        </Sidebar.Dropdown>
      )}
    </Sidebar>
  );
}

export default SidebarDropdown;
