import { h } from 'preact';
import { Route, Router } from 'preact-router';
import Match from 'preact-router/match'
import HomePage from './pages/home'
import ShowPage from './pages/show'
import Editor from './pages/form';

// Code-splitting is automated for `routes` directory

const App = () => {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Match path="/view/:tx">{({ matches, path, url }) => {
        console.log({matches, path, url}) // TODO: make better
        if (matches) {
          const tx = url.match(/\/view\/([a-zA-Z0-9_-]+)/)[1] as string
          return <ShowPage tx={tx} />
        }
        return <div className="text-4xl">Not Found</div>
      }}</Match>
      <Route path='/create' component={Editor}/>
    </Router> 
  )
}

export default App;
