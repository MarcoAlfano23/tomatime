  // src/App.jsx
  import React from "react";
  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import AppContainer from "./containers/AppContainer.jsx";
  import LoginContainer from "./containers/LoginContainer.jsx";


  function App() {
    return (
      <Router>
        <Routes>
        {/* <Route path="/" element={<LoginContainer/>} />  */}
          <Route path="/" element={<AppContainer />} /> 
          
        </Routes>
      </Router>
    );
  }

  export default App;
