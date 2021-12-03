import React from 'react';
import ReactDOM from 'react-dom';

// Gives access to redux store throughout application

import { Provider } from 'react-redux';

import { BrowserRouter as Router } from 'react-router-dom';
import { store, persistor } from './redux/store';

// Following component pairs with persisted reducer and 

// store in ./redux folder to cache the store in local storage.

import { PersistGate } from 'redux-persist/integration/react';

import './index.css';
import './dist/css/oauth-buttons.min.css';
import App from './App';

// Rendering our virtual DOM

ReactDOM.render(

  <Provider store={store}>

    <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" />

    <Router>

      <PersistGate persistor={persistor} >

        <App />

      </PersistGate>

    </Router>

  </Provider>
    
    ,
    
  document.getElementById('root')

);
