import React from 'react';
import logo from './logo.svg';
import './App.css';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import Routers from './components/Routers';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
          <a
              href="./components/page2.html"
              target="_blank"
          >
              page2 test
          </a>
      </header>
      <div>
      <Routers/>
      </div>
    </div>
  );
}

export default App;
