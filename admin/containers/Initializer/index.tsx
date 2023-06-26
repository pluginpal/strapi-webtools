/**
 *
 * Initializer
 *
 */

import { useEffect, useRef, FC } from 'react';
import PropTypes from 'prop-types';
import pluginId from '../../helpers/pluginId';

type Props = {
  updatePlugin: any;
};

const Initializer: FC<Props> = ({ updatePlugin }) => {
  const ref = useRef(updatePlugin);

  useEffect(() => {
    ref.current(pluginId, 'isReady', true);
  }, []);

  return null;
};

Initializer.propTypes = {
  updatePlugin: PropTypes.func.isRequired,
};

export default Initializer;
