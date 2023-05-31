import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Consent from "./Consent";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/consent" element={<Consent />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
