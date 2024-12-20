import React from "react";
import { ResizableBox as ReactResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";

export default function ResizableBox({
  children,
  width = 600,
  height = 300,
  style = {},
  className = "",
}) {
  return (
    <div>
      <ReactResizableBox width={width} height={height}>
        <div
          style={{
            ...style,
            width: "100%",
            height: "100%",
          }}
          className={className}
        >
          {children}
        </div>
      </ReactResizableBox>
    </div>
  );
}
