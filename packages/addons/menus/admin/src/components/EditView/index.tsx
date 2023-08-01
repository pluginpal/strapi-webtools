import React from "react";
import { useIntl } from "react-intl";
import { SidebarItem } from "@strapi-webtools/helper-plugin";

import getTrad from "../../helpers/getTrad";

const EditView = () => {
  const { formatMessage } = useIntl();

  return (
    <SidebarItem
      label={formatMessage({
        id: getTrad("plugin.name"),
        defaultMessage: "Menu link",
      })}
    >
      Some menu link info
    </SidebarItem>
  );
};

export default EditView;
