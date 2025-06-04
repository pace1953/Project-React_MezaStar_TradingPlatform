import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home";
import MyOrders from "./MyOrders";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;