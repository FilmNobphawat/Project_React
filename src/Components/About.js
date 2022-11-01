import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import { Navbar } from "./Navbar";
import {auth, fs} from '../config/config';
import PLASOD from '../image/PLASOD.jpg'

export const About = () => {

    function GetUserUid(){
        const [uid, setUid] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if(user){
                    setUid(user.uid);
                }
            })
        },[])
        return uid;
    }

    const uid = GetUserUid();

    function GetCurrentUser(){
        const [user,setUser] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user =>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(snapshot =>{
                        setUser(snapshot.data().Fullname);
                    })
                }
                else{
                    setUser(null);
                }
            })
        },[])
        return user;
    }

    const [totalProducts,setTotalProduct] = useState(0);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user){
                firebase.firestore().collection('users').doc(user.uid).collection('Cart').onSnapshot(snapshot => {
                    const qty = snapshot.docs.length;
                    setTotalProduct(qty);
                })
            }
        })
    },[])

    const user = GetCurrentUser();
    return(
        <>
        <Navbar user = {user} totalProducts = {totalProducts}/>
        {/* <h1 className="text-center">เกี่ยวกับเรา</h1> */}
        <img className="center-img" src={PLASOD} alt="About us" width='1000px' height='100%'/>
        </>
    )
}