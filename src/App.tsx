import { h } from 'preact';
import { Route, Router } from 'preact-router';
import HomePage from './pages/home'


// Code-splitting is automated for `routes` directory

const App = () => {
  const tx = new URLSearchParams(location.search).get("tx");

  return (
    <Router>
      <Route path="/" component={() => <HomePage />} />
    </Router> 
  )
}

export default App;
