import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import { Navbar } from "./Navbar";
import {auth, fs} from '../config/config';

export const Promotion = () => {

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
            <h1>ส่วนหัวที่จะมีโปรโมชั่นอะ</h1>
        </>
    )
}