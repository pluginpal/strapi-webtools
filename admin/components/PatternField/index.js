import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { TextInput } from '@strapi/design-system/TextInput';
import { Popover } from '@strapi/design-system/Popover';
import { request } from '@strapi/helper-plugin';
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';

import useActiveElement from '../../helpers/useActiveElement';

const PatternField = ({ uid, values, error, setFieldValue, hint }) => {
  const activeElement = useActiveElement();
  const patternRef = useRef();
  const [allowedFields, setAllowedFields] = useState(null);
  const { formatMessage } = useIntl();

  const HoverBox = styled(Box)`
    cursor: pointer;
    &:hover:not([aria-disabled='true']) {
      background: ${({ theme }) => theme.colors.primary100};
    }
  `;

  const patternHint = () => {
    const base = formatMessage({ id: 'settings.form.pattern.description_1', defaultMessage: 'Create a URL alias pattern' });
    let suffix = '';
    if (allowedFields[uid]) {
      suffix = ` ${formatMessage({ id: 'settings.form.pattern.description_2', defaultMessage: 'using' })} `;
      allowedFields[uid].map((fieldName, i) => {
        if (i === 0) {
          suffix = `${suffix}[${fieldName}]`;
        } else if (allowedFields[uid].length !== i + 1) {
          suffix = `${suffix}, [${fieldName}]`;
        } else {
          suffix = `${suffix} ${formatMessage({ id: 'settings.form.pattern.description_3', defaultMessage: 'or' })} [${fieldName}]`;
        }
      });
    }

    return base + suffix;
  };

  useEffect(() => {
    request(`/url-alias/pattern/allowed-fields`, { method: 'GET' })
      .then((res) => {
        setAllowedFields(res);
      })
      .catch(() => {
      });
  }, []);

  if (!allowedFields) return null;

  return (
    <div>
      <div ref={patternRef}>
        <TextInput
          label={formatMessage({ id: 'settings.form.pattern.label', defaultMessage: 'Pattern' })}
          name="pattern"
          value={values.pattern}
          placeholder="/en/pages/[id]"
          error={error}
          onChange={async (e) => {
            if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
              setFieldValue('pattern', e.target.value);
            }
          }}
        />
      </div>
      {hint(patternHint())}
      {values.pattern.endsWith('[') && activeElement.name === 'pattern' && (
        <Popover
          source={patternRef}
          fullWidth
        >
          <Stack size={1}>
            {allowedFields[uid].map((fieldName) => (
              <HoverBox
                key={fieldName}
                padding={2}
                onClick={() => {
                  const newPattern = `${values.pattern}${fieldName}]`;
                  setFieldValue('pattern', newPattern);
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
