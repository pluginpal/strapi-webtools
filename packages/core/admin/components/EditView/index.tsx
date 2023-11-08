import React from "react";
import { useIntl } from "react-intl";
import { SidebarDropdown } from "@strapi-webtools/helper-plugin";

import { useCMEditViewDataManager } from "@strapi/helper-plugin";

import getTrad from "../../helpers/getTrad";
import EditForm from "../EditForm";
import Permalink from "./Permalink";

const EditView = () => {
  const { formatMessage } = useIntl();
  const { allLayoutData, modifiedData } = useCMEditViewDataManager();

  if (!allLayoutData.contentType.pluginOptions?.webtools?.enabled) return null;

  return (
    <>
      <SidebarDropdown
        label={formatMessage({
          id: getTrad("plugin.name"),
          defaultMessage: `Edit URL alias`,
        })}
      >
        <EditForm />
      </SidebarDropdown>
      <Permalink
        path={modifiedData.url_alias?.url_path}
      />
    </>
  );
};

export default EditView;
