import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home";
import MyOrders from "./MyOrders";
import Cart from "./Cart";
import Machine from "./Machine";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/machine-position" element={<Machine />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;