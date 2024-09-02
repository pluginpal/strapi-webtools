import * as React from 'react';
import { useIntl } from 'react-intl';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

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
  const { modifiedData, onChange } = useCMEditViewDataManager();
  const modifiedDataUrlAliases = modifiedData.url_alias as UrlAliasEntity[];
  const { formatMessage } = useIntl();

  const updateValue = (index: number, name: string, value: string | number) => {
    const updatedUrlAliases = [...modifiedDataUrlAliases];

    if (!updatedUrlAliases[index].id) {
      console.error('Error: id is undefined', updatedUrlAliases[index]);
      return;
    }

    updatedUrlAliases[index] = {
      ...updatedUrlAliases[index],
      [name]: value,
    };
    console.log(updatedUrlAliases, 'updatedUrlAliases');
    onChange({ target: { name: `url_alias`, value: updatedUrlAliases, type: 'array' } });
  };

  const [expanded, setExpanded] = React.useState<number>(0);
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
            description={alias.url_path ? alias.url_path : 'URL alias not found'}
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
