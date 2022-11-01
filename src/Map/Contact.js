import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import {auth, fs} from '../config/config';
import { Navbar } from "../Components/Navbar";

export const Contact = () => {

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

    //บอกตำแหน่งปัจจุบัน
    /*function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCoordinates);
        }else{
            alert("Geolocation is not supporter by this browser.");
        }
    }

    function getCoordinates(position) {
        console.log(position)
    }*/

    return(
        <div className="">
            <Navbar user = {user} totalProducts = {totalProducts}/>
            <div className="a3 a1S a5 padmar50px">
                <div class="mapouter">
                    <div class="gmap_canvas">
                        <iframe className="a1J aj" style={{width: "700px",height: "400px"}} src="https://maps.google.com/maps?width=700&amp;height=400&amp;hl=en&amp;q=ตลาดยิ่งเจริญ&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                    </div>
                </div>
                <div className="marleft50">
                    <h1>ติดต่อ</h1>
                    <h2>Email: nobphawat.s@ku.th</h2>
                    <h2>Tel: 095-555-5555</h2>
                    <h2>Facebook: Nobphawat Srinuanmak</h2>
                </div>
            </div>
        </div>
    )
}
