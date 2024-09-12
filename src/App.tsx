import { Route, Router } from 'preact-router';
import Match from 'preact-router/match'
import HomePage from './pages/home'
import ShowPage from './pages/show'
import Editor from './pages/form'
import RelatedPage from './pages/related'
import LearnPage from './pages/learn'

const App = () => {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Match path="/view/:tx">
        {({ matches, url }) => {
          if (matches) {
            const tx = url.match(/\/view\/([a-zA-Z0-9_-]+)/)[1] as string
            return <ShowPage tx={tx} />
          }
          return <div className="text-4xl">Not Found</div>
        }}
      </Match>
      <Match path="/related/:tx">
        {({ matches, url }) => {
          if (matches) {
            const tx = url.match(/\/related\/([a-zA-Z0-9_-]+)/)[1] as string
            return <RelatedPage tx={tx} />
          }
          return <div className="text-4xl">Not Found</div>
        }}
      </Match>
      <Route path="/learn" component={LearnPage} />
      <Route path='/create' component={Editor} />
      <Route path='/remix/:tx' component={Editor} />
    </Router> 
  )
}

export default App;
