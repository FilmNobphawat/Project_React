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
            <div className='banner'>
                <img src={logo} alt="logo" />
            </div>
            <div className=''>
                <div className='topnav'>
                    <Link to="/admin" className='navlink'>หน้าหลัก</Link>
                    <Link to="/addproduct" className='navlink'>เพิ่มสินค้า</Link>
                    <Link to="/discount" className='navlink'>จัดโปรโมชั่น</Link>
                    <Link to="/adminorder" className='navlink'>รายการสั่งซื้อ</Link>
                    <Link to="/revenue" className='navlink'>รายรับ</Link>
                    <div className="btn-danger btn-md a5 textcentre" onClick = {handleLogout}>ออกจากระบบ</div>
                </div>
            </div>
        </div>
    )
}