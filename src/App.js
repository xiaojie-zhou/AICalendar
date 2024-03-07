import './App.css';
import React from "react";
import ChatGPT from "./ChatGPT";

function App() {
    return (
      <div className="App" style={{width: '100%', height: '100vh'}}>
          <iframe
              width="65%" height="100%"
              title="GCal"
              id='GCal'
              style={{border: 'none'}}
              src={process.env.REACT_APP_GCAL}
              scrolling="no" align='left' loading='eager'>
          </iframe>

          <table align='right' style={{width: '35%', height: '100vh'}}>
              <tbody>
              <tr>
                  <td>
                      <iframe title='Todoist' src="https://todoist.com/app"
                              loading='eager' height='100%' width='100%' frameBorder='0'>
                      </iframe>
                  </td>
              </tr>
              <tr>
                  <td height='30%' bgcolor='#add8e6' style={{verticalAlign:'bottom'}}>
                      <ChatGPT/>
                  </td>
              </tr>
              </tbody>
          </table>

      </div>


  );
}

export default App;
