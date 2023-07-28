import React, { useState, useEffect, useRef, FC } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { TextInput, Popover, Stack, Box, Loader } from "@strapi/design-system";
import { request } from "@strapi/helper-plugin";
import { useQuery } from "react-query";

import useActiveElement from "../../helpers/useActiveElement";

type Props = {
  uid: string;
  values: any;
  error?: any;
  setFieldValue: (name: string, value: any) => void;
  hint: any;
};

const PatternField: FC<Props> = ({
  uid,
  values,
  error = null,
  setFieldValue,
  hint,
}) => {
  const activeElement = useActiveElement();
  const patternRef = useRef<HTMLDivElement>(null);
  const { formatMessage } = useIntl();

  const [popoverDismissed, setPopoverDismissed] = useState(false);
  const { data: allowedFields, isLoading: allowedFieldsLoading, isError } = useQuery<Record<string, string[]>>(

    ['webtools', 'pattern', 'allowed-fields'],
    () => request(`/webtools/pattern/allowed-fields`, { method: "GET" }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  );

  const HoverBox = styled(Box)`
    cursor: pointer;
    &:hover:not([aria-disabled="true"]) {
      background: ${({ theme }: any) => theme.colors.primary100};
    }
  `;

  const patternHint = () => {
    const base = formatMessage({
      id: 'settings.form.pattern.description_1',
      defaultMessage: 'Create a URL alias pattern',
    });
    let suffix = "";
    if (allowedFields?.[uid]) {
      suffix = ` ${formatMessage({
        id: 'settings.form.pattern.description_2',
        defaultMessage: 'using',
      })} `;
      allowedFields[uid].map((fieldName, i) => {
        if (i === 0) {
          suffix = `${suffix}[${fieldName}]`;
        } else if (allowedFields[uid].length !== i + 1) {
          suffix = `${suffix}, [${fieldName}]`;
        } else {
          suffix = `${suffix} ${formatMessage({
            id: 'settings.form.pattern.description_3',
            defaultMessage: 'or',
          })} [${fieldName}]`;
        }
      });
    }

    return base + suffix;
  };


  if (allowedFieldsLoading) {
    return <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: "Loading content..." })}</Loader>;
  }

  if (isError || !allowedFields) {
    return <div>{formatMessage({ id: 'webtools.pattern.allowedFields.fetchError', defaultMessage: "An error occurred while fetching allowed fields" })}</div>;
  }

  return (
    <div>
      <div ref={patternRef}>
        <TextInput
          label={formatMessage({
            id: 'settings.form.pattern.label',
            defaultMessage: 'Pattern',
          })}
          name="pattern"
          value={values.pattern}
          placeholder="/en/pages/[id]"
          error={error}
          onChange={(e: any) => {
            setPopoverDismissed(false);
            if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
              setFieldValue('pattern', e.target.value);
            }
          }}
        />
      </div>
      {hint(patternHint())}
      {values.pattern.endsWith('[') && !popoverDismissed && (
        <Popover source={patternRef} onDismiss={() => setPopoverDismissed(true)} fullWidth>
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
