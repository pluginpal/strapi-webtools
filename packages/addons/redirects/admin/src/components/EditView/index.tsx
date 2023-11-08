import React from "react";
import { useIntl } from "react-intl";
import { SidebarDropdown } from "@strapi-webtools/helper-plugin";

import getTrad from "../../helpers/getTrad";

const EditView = () => {
  const { formatMessage } = useIntl();

  return (
    <SidebarDropdown
      label={formatMessage({
        id: getTrad("plugin.name"),
        defaultMessage: "Redirects",
      })}
    >
      Some redirects info
    </SidebarDropdown>
  );
};

export default EditView;
