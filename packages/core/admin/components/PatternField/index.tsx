import React, {
  useState, useRef, FC,
  useEffect,
} from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { FormikErrors } from 'formik';

import {
  TextInput, Popover, Stack, Box, Loader, Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { PatternFormValues } from '../../types/url-patterns';
import { Theme } from '../../types/theme';

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
  const patternRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [allowedFields, setAllowedFields] = useState<Record<string, string[]>>(null);
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();

  const [popoverDismissed, setPopoverDismissed] = useState(false);

  useEffect(() => {
    const fetchAllowedFields = async () => {
      try {
        setLoading(true);
        const data = await get<Record<string, string[]>>('/webtools/url-pattern/allowed-fields', { method: 'GET' });
        setAllowedFields(data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setLoadingError(true);
      }
    };

    fetchAllowedFields().catch(() => {
      console.error('Failed to fetch allowed fields:', error);
      setLoadingError(true);
      setLoading(false);
    });
  }, [error, get]);

  const HoverBox = styled(Box)`
    cursor: pointer;
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
    if (allowedFields?.[uid]) {
      suffix = ` ${formatMessage({
        id: 'webtools.settings.form.pattern.description_2',
        defaultMessage: 'using',
      })} `;
      allowedFields[uid].forEach((fieldName, i) => {
        if (i === 0) {
          suffix = `${suffix}[${fieldName}]`;
        } else if (allowedFields[uid].length !== i + 1) {
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


  if (loading) {
    return <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>;
  }

  if (loadingError || !allowedFields) {
    return <div>{formatMessage({ id: 'webtools.pattern.allowedFields.fetchError', defaultMessage: 'An error occurred while fetching allowed fields' })}</div>;
  }

  return (
    <div>
      <div ref={patternRef}>
        <TextInput
          label={formatMessage({
            id: 'webtools.settings.form.pattern.label',
            defaultMessage: 'Pattern',
          })}
          name="pattern"
          value={values.pattern}
          placeholder="/en/pages/[id]"
          error={error}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPopoverDismissed(false);
            if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
              return setFieldValue('pattern', e.target.value);
            }

            return null;
          }}
        />
      </div>
      <Typography variant="pi">{patternHint()}</Typography>
      {values.pattern.endsWith('[') && !popoverDismissed && (
        <Popover source={patternRef} onDismiss={() => setPopoverDismissed(true)} fullWidth>
          <Stack size={1}>
            {allowedFields[uid].map((fieldName) => (
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
          </Stack>
        </Popover>
      )}
    </div>
  );
};

export default PatternField;
