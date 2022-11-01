import React,{useState} from "react";
import {auth} from '../config/config';
import {useNavigate} from 'react-router-dom'
import { Link } from "react-router-dom";

export const Login = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [errorMsg,setErrorMsg] = useState('');
    const [successMsg,setSuccessMsg] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        //console.log(email,password);
        auth.signInWithEmailAndPassword(email,password).then(() => {
            setSuccessMsg('Login Successfull. You will now automatically get redirected to Home page');
            if (email === ('fox.28863@gmail.com') && password === ('0610894798')){
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/admin');
                },3000)
            }else{
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/');
                },3000)
            }
        }).catch((error) => {
            setErrorMsg(error.message);
        })
    }

    return(
        <div className="container">
            <br></br>
            <br></br>
            <h1 className="textcentre">เข้าสู่ระบบ</h1>
            <hr></hr>
            {successMsg&&<>
                <div className="success-msg">{successMsg}</div>
                <br></br>
            </>}
            <form id="login-form" className="form-group" autoComplete="off" onSubmit={handleLogin}>
                <label>อีเมล</label>
                <input id="email-field" type="email" className="form-control" required
                onChange={(e) => setEmail(e.target.value)} value = {email}></input>
                <br></br>
                <label>รหัสผ่าน</label>
                <input id="password-field" type="password" className="form-control" required
                onChange={(e) => setPassword(e.target.value)} value = {password}></input>
                <br></br>
                <div className="btn-box">
                <button id="login-submit" type="submit" className="btn btn-md">เข้าสู่ระบบ</button>
                    <span className="register-left">ยังไม่มีบัญชี?&nbsp;
                    
                        <Link to="/signup" className="link"> สมัครที่นี่</Link></span>
                    
                </div>
            </form>
            {errorMsg&&<>
                <br></br>
                <div className="error-msg">{errorMsg}</div>
            </>}
        </div>
    )
}