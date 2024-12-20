import { Route, Router } from 'preact-router';
import { FunctionalComponent, h } from 'preact';
import HomePage from './pages/home';
import ShowPage from './pages/show';
import Editor from './pages/form';
import RelatedPage from './pages/related';
import LearnPage from './pages/learn';
import { useEffect, useState } from 'preact/hooks';
import Match from 'preact-router/match';

const FadeInComponent: FunctionalComponent = ({ children }) => {
  const [fadeClass, setFadeClass] = useState('fade-in');

  useEffect(() => {
    setFadeClass('fade-in');
    const timer = setTimeout(() => setFadeClass(''), 700);
    return () => clearTimeout(timer);
  }, [children]);

  return <div className={fadeClass}>{children}</div>;
};


const App = () => {
  const [path, setPath] = useState<string>('/');

  const handleRouteChange = (e: { url: string }) => {
    setPath(e.url);
  };

  return (
    <FadeInComponent key={path}>
      <Router onChange={handleRouteChange}>
        <Route path="/" component={HomePage} />
        <Match path="/view/:tx">
          {({ matches, url }) => {
            if (matches) {
              const tx: string = url.match(/\/view\/([a-zA-Z0-9_-]+)/)?.[1];
              return <ShowPage tx={tx} />;
            }
            return <div className="text-4xl">Not Found</div>;
          }}
        </Match>
        <Match path="/related/:tx">
          {({ matches, url }) => {
            if (matches) {
              const tx: string = url.match(/\/related\/([a-zA-Z0-9_-]+)/)?.[1];
              return <RelatedPage tx={tx} />;
            }
            return <div className="text-4xl">Not Found</div>;
          }}
        </Match>
        <Route path="/learn" component={LearnPage} />
        <Route path="/create" component={Editor} />
        <Route path="/remix/:tx" component={Editor} />
      </Router>
    </FadeInComponent>
  );
};

export default App;
