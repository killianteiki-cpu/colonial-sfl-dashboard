import { useState } from "react";

export default function Tooltip({ text, children, width = 220 }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setShow(true)} 
      onMouseLeave={() => setShow(false)}
    >
      <span className="tooltip-child">{children}</span>
      {show && (
        <div className="tooltip-box" style={{ width }}>
          <div className="tooltip-content" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      )}
    </div>
  );
}
