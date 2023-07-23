import React, { FC, useState } from "react";

import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
} from "@strapi/design-system";
import { ExclamationMarkCircle } from "@strapi/icons";
import { useIntl } from "react-intl";
import styled from "styled-components";
import getTrad from "../../../helpers/getTrad";

const TextAlignTypography = styled(Typography)`
  text-align: center;
`;

type Props = {
  description: {
    id: string;
    defaultMessage: string;
    values: object;
  },
  intlLabel: {
    id: string;
    defaultMessage: string;
    values: {
      [key: string]: any;
    };
  },
  isCreating: boolean,
  name: string,
  onChange: (value: any) => void,
  value: boolean,
};

const CheckboxConfirmation: FC<Props> = ({
  description,
  isCreating,
  intlLabel,
  name,
  onChange,
  value,
}) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (newValue: boolean) => {
    if (isCreating || newValue) {
      return onChange({ target: { name, value: newValue, type: "checkbox" } });
    }

    if (!newValue) {
      return setIsOpen(true);
    }

    return null;
  };

  const handleConfirm = () => {
    onChange({ target: { name, value: false, type: "checkbox" } });
    setIsOpen(false);
  };

  const handleToggle = () => setIsOpen((prev) => !prev);

  const label = intlLabel.id
    ? formatMessage(
      { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
      { ...intlLabel.values },
    )
    : name;

  const hint = description
    ? formatMessage(
      { id: description.id, defaultMessage: description.defaultMessage },
      { ...description.values },
    )
    : "";

  return (
    <>
      <Checkbox
        hint={hint}
        id={name}
        name={name}
        onValueChange={handleChange}
        value={value}
        type="checkbox"
      >
        {label}
      </Checkbox>
      {isOpen && (
        <Dialog onClose={handleToggle} title="Confirmation" isOpen={isOpen}>
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Flex direction="column" alignItems="stretch" gap={2}>
              <Flex justifyContent="center">
                <TextAlignTypography id="confirm-description">
                  {formatMessage({
                    id: getTrad("url-alias.CheckboxConfirmation.Modal.content"),
                    defaultMessage:
                      "Disabling url alias will engender the deletion of all your paths for this content type",
                  })}
                </TextAlignTypography>
              </Flex>
              <Flex justifyContent="center">
                <Typography fontWeight="semiBold" id="confirm-description">
                  {formatMessage({
                    id: getTrad("CheckboxConfirmation.Modal.body"),
                    defaultMessage: "Do you want to disable it?",
                  })}
                </Typography>
              </Flex>
            </Flex>
          </DialogBody>
          <DialogFooter
            startAction={
              (
                <Button onClick={handleToggle} variant="tertiary">
                  {formatMessage({
                    id: "components.popUpWarning.button.cancel",
                    defaultMessage: "No, cancel",
                  })}
                </Button>
              )
            }
            endAction={
              (
                <Button variant="danger-light" onClick={handleConfirm}>
                  {formatMessage({
                    id: getTrad("CheckboxConfirmation.Modal.button-confirm"),
                    defaultMessage: "Yes, disable",
                  })}
                </Button>
              )
            }
          />
        </Dialog>
      )}
    </>
  );
};

export default CheckboxConfirmation;
