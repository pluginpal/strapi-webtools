/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from 'react';
import { useIntl } from 'react-intl';

import { unstable_useContentManagerContext, useFetchClient } from '@strapi/strapi/admin';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Box,
  TextInput,
  Checkbox,
  Field,
  Typography,
  Modal,
  Button,
} from '@strapi/design-system';
import { Form, Formik } from 'formik';

import getTrad from '../../helpers/getTrad';
import { UrlAliasEntity } from '../../types/url-aliases';

const EditForm = () => {
  const context = unstable_useContentManagerContext();
  const [open, setOpen] = React.useState(false);

  const { id, model } = context;
  const { get, put } = useFetchClient();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const locale = urlParams.get('plugins[i18n][locale]');
  const aliases = useQuery(`aliases-${model}-${id}-${locale}`, async () => get<UrlAliasEntity[]>(`/webtools/url-alias/findFrom?model=${model}&documentId=${id}&locale=${locale}`));
  const mutation = useMutation((updatedAlias: Partial<UrlAliasEntity>) => put(`/webtools/url-alias/update/${aliases.data.data[0].documentId}`, {
    data: updatedAlias,
  }));

  // Re-fetch the aliases when the modal is opened.
  React.useEffect(() => {
    if (open) queryClient.invalidateQueries(`aliases-${model}-${id}-${locale}`);
  }, [open, queryClient, model, id, locale]);

  const { formatMessage } = useIntl();

  return (
    <Formik
      initialValues={{
        generated: aliases.data?.data?.[0]?.generated,
        url_path: aliases.data?.data?.[0]?.url_path,
      }}
      onSubmit={async (values) => {
        await mutation.mutateAsync(values);
        setOpen(false);
      }}
      enableReinitialize
    >
      {({ setFieldValue, values, handleSubmit }) => (
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Trigger>
            <Button
              size="S"
              variant="secondary"
              style={{ width: '100%' }}
              disabled={aliases.data.data.length === 0}
            >
              Edit URL alias
            </Button>
          </Modal.Trigger>
          <Modal.Content>
            <Modal.Header>
              <Typography fontWeight="bold" textColor="neutral800" id="title">
                test
              </Typography>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Box>
                  <Field.Root hint="Uncheck this to create a custom alias below.">
                    <Checkbox
                      onCheckedChange={(value) => {
                        setFieldValue('generated', value);
                      }}
                      checked={values.generated !== undefined ? values.generated : true}
                      name="generated"
                    >
                      {formatMessage({
                        id: getTrad('EditView.ExcludeFromSitemap'),
                        defaultMessage: ' Generate automatic URL alias',
                      })}
                    </Checkbox>
                    <Field.Hint />
                  </Field.Root>
                </Box>
                <Box paddingTop={4}>
                  <Field.Root
                    hint='Specify a path by which this data can be accessed in the browser. For example, type "/about" when writing an about page.'
                  >
                    <Field.Label>
                      URL alias
                    </Field.Label>
                    <TextInput
                      name="path"
                      disabled={values.generated !== undefined ? values.generated : true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                          setFieldValue('url_path', e.target.value);
                        }
                      }}
                      value={values.url_path}
                    />
                    <Field.Hint />
                  </Field.Root>
                </Box>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button variant="tertiary">
                  Cancel
                </Button>
              </Modal.Close>
              <Button onClick={() => handleSubmit()}>Save</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      )}
    </Formik>
  );
};

export default EditForm;
