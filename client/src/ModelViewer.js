import React, { useEffect } from 'react';

const ModelViewer = ({ ...props }) => {
  useEffect(() => {
    // eslint-disable-next-line global-require
    require('@google/model-viewer');
  }, [window]);

  return (
    <model-viewer {...props}></model-viewer>
  );
};

export default ModelViewer;
