import React from "react";
import Mug from "./assets/model1.glb";
import MugWithBin from "./assets/model1.gltf";
import ModelViewer from "./ModelViewer";

export default function ModelViewerExample() {
  return (
    <div>
      <ModelViewer
        src={Mug}
        auto-rotate
        camera-controls
        data-js-focus-visible
      />
      <ModelViewer
        src={MugWithBin}
        auto-rotate
        camera-controls
        data-js-focus-visible
      />
    </div>
  );
}
