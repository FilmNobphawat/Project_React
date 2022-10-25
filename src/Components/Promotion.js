import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import { Navbar } from "./Navbar";
import {auth, fs} from '../config/config';
import pro10 from '../image/pro10.png';
import pro20 from '../image/pro20.png';
import pro30 from '../image/pro30.png';
import pro40 from '../image/pro40.png';
import pro50 from '../image/pro50.png';
import nopro from '../image/nopro.png';

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

    const [discountcount,setDiscountCount] = useState(0)

    const getDiscount = async () => {
        const discount = await fs.collection('Discount').get();
        const discountArray = [];
        for (var snap of discount.docs){
            var data = snap.data();
            data.ID = snap.id;
            discountArray.push({
                ...data
            })
            console.log(discountcount)
            if(discountArray.length === discount.docs.length){
                const count = (discountArray[0].discount)
                setDiscountCount(count)
                console.log(discountcount)
                return (count)
            }
        }
    }
    getDiscount();

    const user = GetCurrentUser();
    return(
        <>
            <Navbar user = {user} totalProducts = {totalProducts}/>
            {/* <h1 className="text-center stepmargin">โปรโมชั่น</h1> */}
            {discountcount === 10 && (
                <img className="center-img" src={pro10} width='800px' height='100%'/>
            )}
            {discountcount === 20 && (
                <img className="center-img" src={pro20} width='800px' height='100%'/>
            )}
            {discountcount === 30 && (
                <img className="center-img" src={pro30} width='800px' height='100%'/>
            )}
            {discountcount === 40 && (
                <img className="center-img" src={pro40} width='800px' height='100%'/>
            )}
            {discountcount === 50 && (
                <img className="center-img" src={pro50} width='800px' height='100%'/>
            )}
            {discountcount === 0 && (
                <img className="center-img" src={nopro} width='800px' height='100%'/>
            )}
        </>
    )
}