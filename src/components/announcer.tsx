// import { FunctionComponent } from "preact"
// import { useEffect, useState } from "preact/hooks"
// import { getCurrentUrl } from 'preact-router'

// const Announcer: FunctionComponent = () => {
//   const [current, setCurrent] = useState<string>("");

//   // This mimics the Svelte `$:` reactive behavior
//   useEffect(() => {
//     const updateCurrent = () => {
//       const path = getCurrentUrl()
//       setCurrent(path)
//     };

//     // Set the initial path
//     updateCurrent();

//     // // Listen for URL changes in Preact Router
//     // const handleRouteChange = (e: { url: string }) => {
//     //   const path = e.url;
//     //   setCurrent(path === "/" ? "Home" : path.slice(1));
//     // };
//     // // Add a listener for route changes
//     // window.addEventListener('preact-router', handleRouteChange);

//     // // Cleanup subscription when component unmounts
//     // return () => {
//     //   window.removeEventListener('preact-router', handleRouteChange);
//     // };
//   }, [getCurrentUrl()]);
//   return (
//       <div aria-live="assertive" aria-atomic="true" style={hidden}>
//           Navigated to {current}
//       </div>
//   )
// }

// const hidden = {
//   position: 'absolute' as const,
//   left: 0,
//   top: 0,
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   overflow: 'hidden',
//   whiteSpace: 'nowrap' as const,
//   width: '1px',
//   height: '1px',
// };