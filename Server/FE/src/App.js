import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import styled from 'styled-components';
import { useEffect } from 'react';

function App() {
  const expiration = localStorage.getItem('token_expiration');
  useEffect(() => {

    if (expiration) {
      if (Date.now >= parseInt(expiration) * 1000)
      localStorage.removeItem('token_expiration');
      localStorage.removeItem('access_token');
    }
  })


  return (
    <WholePage>
      <Router>

        {/* <div> Authentication</div> */}
        <Switch>
          <Route exact path="/" component={Home} />

          <Route exact path="/login" component={Login} />

          <Route exact path="/:username" component={Account} />

        </Switch>

        <DonateWrapper>
          <span onClick={() => window.location.href = '/'}>Home</span>
          <span style={{ pointerEvents: 'none', cursor: 'none' }}>&#8196;&#x2223;&#8196;</span>

          <span onClick={() => window.location.href = 'https://github.com/thafnhlong/TOOL-Authentication'}>Github</span>
          <span style={{ pointerEvents: 'none', cursor: 'none' }}>&#8196;&#x2223;&#8196;</span>

          <span onClick={() => window.location.href = '/'}>Donation</span>
        </DonateWrapper>
      </Router>
    </WholePage>
  );
}

export default App;

const WholePage = styled.body`
  display: flex;
  flex-direction: column;

  justify-content: space-between;

  height: calc(100vh - 20px);
  width: calc(100vw - 20px);

  margin: 10px 10px;

  border-radius: 15px;

  background-color: whiteSmoke;

  overflow: hidden;
`;

const DonateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 67px;

  justify-content: center;
  align-items: center;


  font-size: 48px;
  font-weight: bold;
  color: #34ACE0;

  span:hover {
    color: white;
    cursor: pointer;
  }
`;