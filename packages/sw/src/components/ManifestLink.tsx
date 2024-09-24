import React from 'react';

export const ManifestLink = ({ manifestUrl = '/manifest.webmanifest' }: { manifestUrl?: string }) => {
  return <link rel="webmanifest" href={manifestUrl} />;
};
