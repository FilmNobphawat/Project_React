import React from "react";
import { Link } from "react-router-dom";
import logo from '../image/logo.png'
//import {Icon} from 'react-icons-kit'
//import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import {useNavigate} from 'react-router-dom'

export const NavbarAdmin = () => {

    const navigate = useNavigate();

    const handleLogout = () =>{   
        navigate('/login')
    }

    return(
        <div className='navbox'>
            <div className='leftside'>
                <img src={logo} alt="logo" />
            </div>
            <div className='rightside'>
                <div><Link to="/admin" className='navlink'>HOME</Link></div>
                <div><Link to="/addproduct" className='navlink'>ADD PRODUCT</Link></div>
                <div><Link to="/discount" className='navlink'>DISCOUNT</Link></div>
                <div><Link to="/adminorder" className='navlink'>ORDER LIST</Link></div>
                <div><Link to="/revenue" className='navlink'>รายรับ</Link></div>
                <div className="btn btn-danger btn-md"
                onClick = {handleLogout}>LOGOUT</div>
            </div>
        </div>
    )
}