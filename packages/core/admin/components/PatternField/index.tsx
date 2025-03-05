import React, {
  FC,
  useRef,
} from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { FormikErrors } from 'formik';
import { useQuery } from 'react-query';

import {
  TextInput, Popover, Box, Loader, Typography,
  Field,
} from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';
import { PatternFormValues } from '../../types/url-patterns';
import { Theme } from '../../types/theme';
import useActiveElement from '../../helpers/useActiveElement';

type Props = {
  uid: string;
  error?: string;
  values: PatternFormValues;
  setFieldValue: (field: string, value: any) => Promise<void | FormikErrors<PatternFormValues>>;
};

const PatternField: FC<Props> = ({
  uid,
  values,
  error = null,
  setFieldValue,
}) => {
  const { get } = getFetchClient();
  const fields = useQuery('fields', async () => get<Record<string, string[]>>('/webtools/url-pattern/allowed-fields'));
  const { formatMessage } = useIntl();
  const inputRef = useRef<HTMLInputElement>();
  const popoverRef = useRef();

  const HoverBox = styled(Box)`
    cursor: pointer;
    font-size: 16px;
    &:hover:not([aria-disabled="true"]) {
      background: ${({ theme }: { theme: Theme }) => theme.colors.primary100};
    }
  `;

  const patternHint = () => {
    const base = formatMessage({
      id: 'webtools.settings.form.pattern.description_1',
      defaultMessage: 'Create a URL alias pattern',
    });
    let suffix = '';
    if (fields.data.data?.[uid]) {
      suffix = ` ${formatMessage({
        id: 'webtools.settings.form.pattern.description_2',
        defaultMessage: 'using',
      })} `;
      fields.data.data[uid].forEach((fieldName, i) => {
        if (i === 0) {
          suffix = `${suffix}[${fieldName}]`;
        } else if (fields.data.data[uid].length !== i + 1) {
          suffix = `${suffix}, [${fieldName}]`;
        } else {
          suffix = `${suffix} ${formatMessage({
            id: 'webtools.settings.form.pattern.description_3',
            defaultMessage: 'or',
          })} [${fieldName}]`;
        }
      });
    }

    return base + suffix;
  };


  if (fields.isLoading) {
    return <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>;
  }

  if (fields.isError || !fields.data) {
    return <div>{formatMessage({ id: 'webtools.pattern.allowedFields.fetchError', defaultMessage: 'An error occurred while fetching allowed fields' })}</div>;
  }

  return (
    <div>
      <Popover.Root open={values.pattern.endsWith('[')}>
        <Popover.Trigger>
          <Field.Root error={error} hint={patternHint()}>
            <Field.Label>
              {formatMessage({
                id: 'webtools.settings.form.pattern.label',
                defaultMessage: 'Pattern',
              })}
            </Field.Label>
            <TextInput
              ref={inputRef}
              name="pattern"
              value={values.pattern}
              placeholder="/en/pages/[id]"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                  return setFieldValue('pattern', e.target.value);
                }

                return null;
              }}
            />
            <Field.Hint />
            <Field.Error />
          </Field.Root>
        </Popover.Trigger>
        <Popover.Content ref={popoverRef}>
          {fields.data.data[uid].map((fieldName) => (
            <HoverBox
              key={fieldName}
              padding={2}
              onClick={() => {
                const newPattern = `${values.pattern}${fieldName}]`;
                return setFieldValue('pattern', newPattern);
              }}
            >
              {fieldName}
            </HoverBox>
          ))}
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export default PatternField;
