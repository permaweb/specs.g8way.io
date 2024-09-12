import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getCurrentUrl } from 'preact-router'

const Announcer: FunctionalComponent = () => {
  const [current, setCurrent] = useState<string>("Home");
  const curRoute = getCurrentUrl()

  useEffect(() => {
    setCurrent(curRoute === "/" ? "Home" : curRoute.slice(1));
  }, []);

  return (
    <div 
      aria-live="assertive" 
      aria-atomic="true"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "1px",
        height: "1px"
      }}
    >
      Navigated to {current}
    </div>
  );
};

export default Announcer;
