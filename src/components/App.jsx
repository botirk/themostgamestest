import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/index.css';

import React from 'react';
import { Provider } from 'react-redux';
import store from '../slices/store.js';
import Input from './Input.jsx';
import Table from './Table.jsx';

export default () => (
  <Provider store={store()}>
    <div className="container">
      <div className="my-3">
        <Input />
      </div>
      <div className="my-3">
        <Table />
      </div>
    </div>
  </Provider>
);
