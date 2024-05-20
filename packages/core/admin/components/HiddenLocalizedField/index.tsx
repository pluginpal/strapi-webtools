import * as React from 'react';

import { FormikErrors } from 'formik';

type Props = {
  localized: boolean;
  setFieldValue:
  (field: string, value: any, shouldValidate?: boolean) =>
  Promise<void | FormikErrors<any>>
};

const HiddenLocalizedField = (props: Props) => {
  const { localized, setFieldValue } = props;

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setFieldValue('localized', localized);
  }, [localized, setFieldValue]);

  return null;
};

export default HiddenLocalizedField;
