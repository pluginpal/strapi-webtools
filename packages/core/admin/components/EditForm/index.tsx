import * as React from 'react';
import { useIntl } from 'react-intl';

import { unstable_useContentManagerContext } from '@strapi/strapi/admin';

import {
  Box,
  Stack,
  TextInput,
  Checkbox,
  Link,
  Accordion,
  AccordionToggle,
  AccordionContent,
} from '@strapi/design-system';

import getTrad from '../../helpers/getTrad';
import { UrlAliasEntity } from '../../types/url-aliases';

const EditForm = () => {
  const { form } = unstable_useContentManagerContext();

  const { values, onChange } = form;

  const modifiedDataUrlAliases =
    (values.url_alias as UrlAliasEntity[])?.length
      ? values.url_alias as UrlAliasEntity[]
      : [{
        generated: true,
      }] as UrlAliasEntity[];
  const { formatMessage } = useIntl();

  const updateValue = (index: number, name: string, value: string | number) => {
    const updatedUrlAliases = [...modifiedDataUrlAliases];

    updatedUrlAliases[index] = {
      ...updatedUrlAliases[index],
      [name]: value,
    };
    onChange('url_alias', updatedUrlAliases);
  };

  const [expanded, setExpanded] = React.useState<number | null>(0);
  // eslint-disable-next-line max-len
  const toggle = (index: number) => setExpanded((prevExpanded) => (prevExpanded === index ? null : index));

  return (
    <Stack size={2}>
      {modifiedDataUrlAliases?.map((alias, index) => (
        <Accordion
          key={alias.id}
          value={`acc-${alias.id}`}
          expanded={expanded === index}
          onToggle={() => toggle(index)}
          variant="secondary"
          size="S"
        >
          <AccordionToggle
            description={alias.url_path ? alias.url_path : 'Initial URL alias'}
          >
            {`Alias #${index + 1}`}
          </AccordionToggle>
          <AccordionContent padding="12px">
            <Box>
              <Checkbox
                onValueChange={(value: string) => {
                  updateValue(index, 'generated', value);
                }}
                value={alias.generated !== undefined ? alias.generated : true}
                name={`generated-${index}`}
                hint="Uncheck this to create a custom alias below."
              >
                {formatMessage({
                  id: getTrad('EditView.ExcludeFromSitemap'),
                  defaultMessage: ' Generate automatic URL alias',
                })}
              </Checkbox>
              <Link to="/plugins/webtools/patterns">Configure URL alias patterns.</Link>
            </Box>
            <Box paddingTop={4}>
              <TextInput
                label="URL alias"
                name={`path-${index}`}
                hint='Specify a path by which this data can be accessed in the browser. For example, type "/about" when writing an about page.'
                disabled={alias.generated !== undefined ? alias.generated : true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                    updateValue(index, 'url_path', e.target.value);
                  }
                }}
                value={alias.url_path}
              />
            </Box>
          </AccordionContent>
        </Accordion>
      ))}
    </Stack>
  );
};

export default EditForm;
