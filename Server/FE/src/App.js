import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import styled from 'styled-components';

function App() {
  return (
    <Router>
      <WholePage>
        {/* <div> Authentication</div> */}
          <Switch>
            <Route exact path="/" component={Home} />

            <Route exact path="/login" component={Login} />

            <Route exact path="/:username" component={Account} />

          </Switch>

          <DonateWrapper>
            <span><a href={{}} />Home</span>
            <span style={{ pointerEvents: 'none', cursor: 'none' }}>&#8196;&#x2223;&#8196;</span>
            <span><a href={{}} />Github</span>
            <span style={{ pointerEvents: 'none', cursor: 'none' }}>&#8196;&#x2223;&#8196;</span>
            <span><a href={{}} />Donation</span>
          </DonateWrapper>
      </WholePage>
    </Router>
  );
}

export default App;

const WholePage = styled.div`
  display: flex;

  height: "calc(100% - 20px)";
  width: "calc(100% - 20px)";

  margin: 10;
  border-radius: 5;
  background-color: "whiteSmoke";

`;

const DonateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 5px;
  font-size: 48px;
  font-weight: bold;
  color: #34ACE0;

  span:hover {
    color: white;
    cursor: pointer;
  }
`;