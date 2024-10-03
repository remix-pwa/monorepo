import type { LinkHTMLAttributes } from 'react';
import React from 'react';

export const ManifestLink = ({
  crossOrigin,
  href,
}: {
  href: string;
  crossOrigin?: LinkHTMLAttributes<HTMLLinkElement>['crossOrigin'];
}) => {
  return <link rel="webmanifest" href={href} crossOrigin={crossOrigin} />;
};
