import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
        {/*<script>*/}
        {/*    $(document).ready(function () {*/}
        {/*    setInterval(function refresh() {*/}
        {/*        document.getElementById('GCal').src = document.getElementById('GCal').src+''*/}
        {/*    }, 10000)}*/}
        {/*</script>*/}

    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
