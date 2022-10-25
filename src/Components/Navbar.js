import React from "react";
import { Link } from "react-router-dom";
import logo from '../image/logo.png'
import {Icon} from 'react-icons-kit'
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import {auth} from '../config/config';
import {useNavigate} from 'react-router-dom'

export const Navbar = ({user,totalProducts}) => {

    const navigate = useNavigate();

    const handleLogout = () =>{
        auth.signOut().then(() => {
            navigate('/')
        })
    }

    return(
        <div className='navbox'>
            <div className='banner'>
                <img src={logo} alt="logo" />
            </div>
            <div className=''>
                {!user && <>
                    <div className="topnav">
                        <Link to="signup" className='navlink'>สมัครสมาชิก</Link>
                        <Link to="login" className='navlink'>เข้าสู่ระบบ</Link>
                        <Link to="/contact" className='navlink'>ติดต่อ</Link>
                    </div>
                </>}
                {user && <>
                    <div className='topnav'>
                        <a className="textwhite navinfo">ยินดีต้อนรับ คุณ{user}</a>
                        <Link to="/" className='navlink'>สินค้าทั้งหมด</Link>   
                        <Link to="/cart" className='navcart'>ดูตะกร้าสินค้า ({totalProducts})</Link>             
                        <Link to="/promotion" className='navlink'>โปรโมชั่น</Link>
                        <Link to="/order" className='navlink'>ประวัติการสั่งซื้อ</Link>
                        <Link to="/contact" className='navlink'>ติดต่อ</Link>
                        <Link to="/about" className='navlink'>เกี่ยวกับ</Link>
                    
                        <div className="btn-danger btn-md" onClick = {handleLogout}>ออกจากระบบ</div>
                    </div>

                    <div className='topbar padmar15px'>
                    </div>
                </>}
            </div>
        </div>
    )
}