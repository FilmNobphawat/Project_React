import React,{useState} from "react";
import {auth, fs} from '../config/config';
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom'

export const Signup = () => {

    const navigate = useNavigate();

    const [fullName,setFullName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const [errorconfirmPassword,setErrorconfirmPassword] = useState('');
    const [errorMsg,setErrorMsg] = useState('');
    const [successMsg,setSuccessMsg] = useState('');

    const handleSignup = (e) => {
        e.preventDefault(); 
        //console.log(fullName,email,password);
        if (password === confirmPassword){
            auth.createUserWithEmailAndPassword(email,password).then((credentials) =>{
                console.log(credentials);
                fs.collection('users').doc(credentials.user.uid).set({
                    Fullname: fullName,
                    Email: email,
                    Password: password
                }).then(() => {
                    setSuccessMsg('Signup Successfull. You will now automatically get redirected to Login');
                    setFullName('');
                    setEmail('');
                    setPassword('');
                    setErrorMsg('');
                    setTimeout(() => {
                        setSuccessMsg('');
                        navigate('/address');
                    },3000)
                }).catch(error => setErrorMsg(error.message)); 
            }).catch((error) => {
                setErrorMsg(error.message)
            })
        }else{
            setErrorconfirmPassword('passwords do not match')
        }
    }

    return(
        <div className="container">
            <br></br>
            <br></br>
            <h1>สมัครสมาชิก</h1>
            <hr></hr>
            {successMsg&&<>
                <div className="success-msg">{successMsg}</div>
                <br></br>
            </>}
            <form className="form-group" autoComplete="off" onSubmit={handleSignup}>
                <label>ชื่อ</label>
                <input type="text" className="form-control" required
                onChange={(e) => setFullName(e.target.value)} value = {fullName}></input>
                <br></br>
                <label>อีเมล</label>
                <input type="email" className="form-control" required
                onChange={(e) => setEmail(e.target.value)} value = {email}></input>
                <br></br>
                <label>รหัสผ่าน</label>
                <input type="password" className="form-control" required
                onChange={(e) => setPassword(e.target.value)} value = {password}></input>
                <br></br>
                {errorconfirmPassword&&<>
                <br></br>
                <div className="error-msg">{errorconfirmPassword}</div>
                </>}
                <label>ยืนยันรหัสผ่าน</label>
                <input type="password" className="form-control" required
                onChange={(e) => setConfirmPassword(e.target.value)} value = {confirmPassword}></input>
                <br></br>
                <div className="btn-box">
                    <span>มีบัญชีอยู่แล้ว ?
                        <Link to="/login" className="link">เข้าสู่ระบบที่นี่</Link></span>
                    <button type="submit" className="btn btn-succecc btn-md">ถัดไป</button>
                </div>
            </form>
            {errorMsg&&<>
                <br></br>
                <div className="error-msg">{errorMsg}</div>
            </>}
        </div>
    )
}