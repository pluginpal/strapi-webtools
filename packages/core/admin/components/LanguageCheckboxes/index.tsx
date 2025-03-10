import * as React from 'react';

import {
  Flex,
  Checkbox,
  Field,
} from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';
import { useQuery } from 'react-query';

import { EnabledContentTypes } from '../../types/enabled-contenttypes';

type Props = {
  selectedLanguages: string[];
  onChange: (selectedLanguages: string[]) => any;
  error?: any;
};

const LanguageCheckboxes = ({
  selectedLanguages,
  onChange,
  error,
}: Props) => {
  const { get } = getFetchClient();
  const languages = useQuery('languages', async () => get<EnabledContentTypes>('/webtools/info/getLanguages'));

  if (languages.isLoading) {
    return null;
  }

  return (
    <Field.Root name="password" error={error as string}>
      <Field.Label>Select the language</Field.Label>
      <Flex direction="column" alignItems="start" gap="1" marginTop="2">
        {languages.data.data.map((contentType) => (
          <Checkbox
            aria-label={`Select ${contentType.name}`}
            checked={selectedLanguages.includes(contentType.uid)}
            onCheckedChange={() => {
              if (selectedLanguages.includes(contentType.uid)) {
                const newContentTypes = selectedLanguages
                  .filter((uid) => uid !== contentType.uid);

                onChange(newContentTypes);

                return;
              }
              onChange([...selectedLanguages, contentType.uid]);
            }}
          >
            {contentType.name}
          </Checkbox>
        ))}
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default LanguageCheckboxes;
