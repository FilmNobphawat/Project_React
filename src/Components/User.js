import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import { Navbar } from "./Navbar";
import {auth, fs} from '../config/config';

export const User = () => {

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

    const user = GetCurrentUser();

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

    const [showuser,setShowUser] = useState(null);
    
    useEffect(() => {
        fs.collection('users').onSnapshot(snapshot => {
            const userArray = [];
            let i = 0;
            for (var snap of snapshot.docs){
                var data = snap.data();
                data.ID = snap.id;
                userArray.push({
                    ...data
                })
                if(uid === userArray[i].ID){
                    setShowUser(userArray[i])
                    console.log(showuser)   
                }
                i = i+1;
            }
        })
    },[])

    return (
        <>
            <Navbar user = {user} totalProducts = {totalProducts}/>
            <div>ชื่อ</div>
            <div>{user}</div>
        </>
    )
}