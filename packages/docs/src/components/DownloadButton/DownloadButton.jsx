import React from 'react';
import { Button } from '../Button/Button';

export function DownloadButton({
  variant = 'primary',
  size = '',
  children = 'Download Brochure',
  ...rest
}) {
  return (
    <Button
      href="/webtools/downloads/strapi-webtools-brochure.html"
      variant={variant}
      size={size}
      decorative="→"
      {...rest}
    >
      {children}
    </Button>
  );
}
