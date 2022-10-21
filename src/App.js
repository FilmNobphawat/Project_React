import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Home } from "./Components/Home";
import { Login } from "./Components/Login";
import { Signup } from "./Components/Signup";
import { AddProducts } from "./Components/AddProducts"
import {Cart} from "./Components/Cart"
import {Order} from "./Components/Order"
import {Admin} from "./Components/Admin"
import { Discount } from "./Components/Discount";
import { Contact } from "./Map/Contact";
import { Address } from "./Components/Address";
import { AdminOrder } from "./Components/AdminOrder";
import { Revenue } from "./Components/Revenue";
import { User } from "./Components/User";
import { About } from "./Components/About";
import { Promotion } from "./Components/Promotion";

export const App = () => {
  return(
    <div className="App">
      <Router>
        <Routes>
          <Route exact path={"/"} element={<Home/>}/>
          <Route exact path={"/signup"} element={<Signup/>}/>
          <Route exact path={"/login"} element={<Login/>}/>
          <Route exact path={"/addproduct"} element={<AddProducts/>}/>
          <Route exact path={"/cart"} element={<Cart/>}/>
          <Route exact path={"/order"} element={<Order/>}/>
          <Route exact path={"/admin"} element={<Admin/>}/>
          <Route exact path={"/discount"} element={<Discount/>}/>
          <Route exact path={"/contact"} element={<Contact/>}/>
          <Route exact path={"/address"} element={<Address/>}/>
          <Route exact path={"/adminorder"} element={<AdminOrder/>}/>
          <Route exact path={"/revenue"} element={<Revenue/>}/>
          <Route exact path={"/user"} element={<User/>}/>
          <Route exact path={"/about"} element={<About/>}/>
          <Route exact path={"/promotion"} element={<Promotion/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;