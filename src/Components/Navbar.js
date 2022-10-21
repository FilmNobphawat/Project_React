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
            <div className='leftside'>
                <img src={logo} alt="logo" />
            </div>
            <div className='rightside'>
                {!user && <>
                    <div><Link to="signup" className='navlink'>SIGN UP</Link></div>
                    <div><Link to="login" className='navlink'>LOGIN</Link></div>
                    <div><Link to="/contact" className='navlink'>CONTACT</Link></div>
                </>}
                {user && <>
                <div><Link to="/" className='navlink'>{user}</Link></div>
                <div className="cart-menu-btn">
                    <Link to="/cart" className='navlink'>
                        <Icon icon={shoppingCart} size={20} />
                        </Link>
                        <span className="cart-indicator">{totalProducts}</span>
                </div>
                <div><Link to="/order" className='navlink'>ORDER</Link></div>
                <div><Link to="/contact" className='navlink'>CONTACT</Link></div>
                <div><Link to="/user" className='navlink'>USER</Link></div>
                <div><Link to="/about" className='navlink'>ABOUT</Link></div>
                <div><Link to="/promotion" className='navlink'>PROMOTION</Link></div>
                <div className="btn btn-danger btn-md"
                onClick = {handleLogout}>LOGOUT</div>
            </>}
            </div>
        </div>
    )
}