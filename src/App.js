import './App.css';
import React from "react";


function App() {
  return (
      <div className="App" style={{width:'100%', height:'100vh'}}>
          <iframe
              width="65%" height="100%"
              title="GCal"
              id='GCal'
              style={{border:'none'}}
              src="https://calendar.google.com/calendar/embed?wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&showTitle=0&showPrint=0&mode=WEEK&src=dG9ueXpob3V6eGpAZ21haWwuY29t&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=MG9mcW0xMTZuYTc0djBuNWJicDNqMmpla2tAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZmFtaWx5MTEwNDg4NzIzMzIxMTgxMDQ2ODhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4uY2hpbmEjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=aHQzamxmYWFjNWxmZDYyNjN1bGZoNHRxbDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%234285F4&color=%2333B679&color=%230083c6&color=%2333ae06&color=%23a2845e&color=%23B39DDB"
              scrolling="no" align='left' loading='eager'>
          </iframe>

          <table align='right' style={{width:'35%', height:'100vh'}}>
              <tbody>
                  <tr>
                      <td>
                          <iframe title='Todoist' src="https://todoist.com/app"
                                  loading='eager' height='100%' width='100%' frameBorder='0'>
                          </iframe>
                      </td>
                  </tr>
                  <tr>
                      <td height='30%' bgcolor='#add8e6'>

                      </td>
                  </tr>
              </tbody>
          </table>

      </div>


  );
}

export default App;
