import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'
import GithubStars from "./GithubStars";

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<GithubStars repo="https://api.github.com/repos/lucasmafra/type-dynamo"/>, document.getElementById('github-stars'));
registerServiceWorker();
