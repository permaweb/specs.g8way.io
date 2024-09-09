import { h } from 'preact';
import { Route, Router } from 'preact-router';


// Code-splitting is automated for `routes` directory

const App = () => {
  const tx = new URLSearchParams(location.search).get("tx");

  return (
    <Router>
      {/* <Route path="/" component={<></>} /> */}
      <Route path="/" component={() => <div className='text-4xl'>Hello</div>} />
    </Router>
  )
}

export default App;


