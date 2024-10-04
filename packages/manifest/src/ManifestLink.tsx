import type { LinkHTMLAttributes } from 'react';
import React from 'react';

export const ManifestLink = ({
  crossOrigin,
  href,
}: {
  href: '/manifest.webmanifest' | (string & object);
  crossOrigin?: LinkHTMLAttributes<HTMLLinkElement>['crossOrigin'];
}) => {
  return <link rel="manifest" href={href} crossOrigin={crossOrigin} />;
};
