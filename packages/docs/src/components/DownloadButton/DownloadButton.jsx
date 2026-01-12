import React from 'react';
import { Button } from '../Button/Button';

export function DownloadButton({
  variant = 'primary',
  size = '',
  children = 'Download PDF',
  href = '/webtools/downloads/strapi-webtools-brochure-clean.pdf',
  ...rest
}) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      decorative="↓"
      {...rest}
    >
      {children}
    </Button>
  );
}

export function ViewHtmlButton({
  variant = 'secondary',
  size = '',
  children = 'View as HTML',
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
