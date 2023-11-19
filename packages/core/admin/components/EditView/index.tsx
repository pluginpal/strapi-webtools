import React from "react";
import { useIntl } from "react-intl";
import { SidebarModal } from "@strapi-webtools/helper-plugin";

import { useCMEditViewDataManager } from "@strapi/helper-plugin";

import getTrad from "../../helpers/getTrad";
import EditForm from "../EditForm";
import Permalink from "./Permalink";
import { create, update } from "../../api/url-alias";

const EditView = () => {
  const { formatMessage } = useIntl();
  const { allLayoutData, modifiedData, initialData, onChange, slug } = useCMEditViewDataManager();

  // @ts-ignore
  if (!allLayoutData.contentType.pluginOptions?.webtools?.enabled) return null;

  const onSubmit = async () => {
    if (!initialData.url_alias) {
      const url_alias = await create(modifiedData.url_alias, slug);
      onChange({ target: { name: `url_alias`, value: url_alias } });
    } else {
      update(modifiedData.url_alias, slug);
    }
  };

  return (
    <>
      <SidebarModal
        label={formatMessage({
          id: getTrad("plugin.name"),
          defaultMessage: `URL alias`,
        })}
        onSubmit={onSubmit}
        onCancel={() => onChange({ target: { name: `url_alias`, value: initialData.url_alias } })}
      >
        <EditForm />
      </SidebarModal>
      <Permalink
        // @ts-ignore
        path={modifiedData.url_alias?.url_path}
      />
    </>
  );
};

export default EditView;
