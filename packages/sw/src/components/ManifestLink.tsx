import type { LinkHTMLAttributes } from 'react';
import React from 'react';

export const ManifestLink = ({
  crossOrigin,
  manifestUrl = '/manifest.webmanifest',
}: {
  manifestUrl?: string;
  crossOrigin?: LinkHTMLAttributes<HTMLLinkElement>['crossOrigin'];
}) => {
  return <link rel="manifest" href={manifestUrl} crossOrigin={crossOrigin} />;
};
