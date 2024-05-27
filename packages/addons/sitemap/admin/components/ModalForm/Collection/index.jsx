import React from 'react';

import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash/fp';

import {
  Grid,
  GridItem,
  Select,
  Option,
  Checkbox,
} from '@strapi/design-system';

import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';
import getSelectedContentType from '../../../helpers/getSelectedContentType';

const CollectionForm = (props) => {
  const { formatMessage } = useIntl();

  const {
    contentTypes,
    onChange,
    onCancel,
    id,
    modifiedState,
    uid,
    setUid,
    langcode,
    setLangcode,
  } = props;

  const handleSelectChange = (contentType, lang = 'und') => {
    setLangcode(lang);
    setUid(contentType);
    onCancel(false);
    onChange(contentType, lang, 'priority', modifiedState.getIn([contentType, 'languages', lang, 'priority'], form.priority.value));
  };

  return (
    <form>
      <Grid gap={6}>
        <GridItem col={6} s={12}>
          <Grid gap={4}>
            <GridItem col={12}>
              <SelectContentTypes
                contentTypes={contentTypes}
                onChange={(value) => handleSelectChange(value)}
                value={uid}
                disabled={!isEmpty(id)}
                modifiedContentTypes={modifiedState}
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem col={6} s={12}>
          <Grid gap={4}>
            {Object.keys(form).map((input) => (
              <GridItem col={12} key={input}>
                <Select
                  name={input}
                  label={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Label`, defaultMessage: input.replace(/^\w/, (c) => c.toUpperCase()) })}
                  hint={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Description`, defaultMessage: '' })}
                  disabled={!uid || (getSelectedContentType(contentTypes, uid).locales && !langcode)}
                  onChange={(value) => onChange(uid, langcode, input, value)}
                  value={modifiedState.getIn([uid, 'languages', langcode, input], form[input].value)}
                >
                  {form[input].options.map((option) => (
                    <Option value={option} key={option}>{option}</Option>
                  ))}
                </Select>
              </GridItem>
            ))}
            <GridItem col={12}>
              <Checkbox
                onValueChange={(cbValue) => {
                  onChange(uid, langcode, 'includeLastmod', cbValue);
                }}
                value={modifiedState.getIn([uid, 'languages', langcode, 'includeLastmod'], true)}
                disabled={!uid || (getSelectedContentType(contentTypes, uid).locales && !langcode)}
                hint={formatMessage({ id: 'sitemap.Settings.Field.IncludeLastmod.Description', defaultMessage: 'Adds a <lastmod> tag to all the URLs of this type.' })}
              >
                {formatMessage({ id: 'sitemap.Settings.Field.IncludeLastmod.Label', defaultMessage: 'Lastmod' })}
              </Checkbox>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </form>
  );
};

export default CollectionForm;
