import './App.css';


function App() {
  return (
      <div className="App">
          <iframe
              title="GCal"
              id='GCal'
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&showTitle=0&showPrint=0&mode=WEEK&src=dG9ueXpob3V6eGpAZ21haWwuY29t&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=MG9mcW0xMTZuYTc0djBuNWJicDNqMmpla2tAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZmFtaWx5MTEwNDg4NzIzMzIxMTgxMDQ2ODhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4uY2hpbmEjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=aHQzamxmYWFjNWxmZDYyNjN1bGZoNHRxbDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%234285F4&color=%2333B679&color=%230083c6&color=%2333ae06&color=%23a2845e&color=%23B39DDB"
              width="800" height="800" frameBorder="0" scrolling="no" align='left'>
          </iframe>
          <table align='right'>
              <tbody>
                  <tr>
                      <td>
                          <iframe title='Todoist' src="https://todoist.com/app" loading='eager' width='400px' height='500px'
                                  frameBorder='0'>
                          </iframe>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          {/*<OPENAI/>*/}
                      </td>
                  </tr>
              </tbody>
          </table>


      </div>


  );
}

export default App;
