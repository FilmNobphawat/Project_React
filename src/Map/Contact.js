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
        <div>
            <Navbar user = {user} totalProducts = {totalProducts}/>
            <div>
                <h2>Contact</h2>
                <div class="mapouter">
                    <div class="gmap_canvas">
                        <iframe style={{width: "700px",height: "400px"}} src="https://maps.google.com/maps?width=700&amp;height=400&amp;hl=en&amp;q=ตลาดยิ่งเจริญ&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                    </div>
                </div>
                <div>
                    <h1>Email: nobphawat.s@ku.th</h1>
                    <h1>Tel: 095-555-5555</h1>
                    <h1>Facebook: Nobphawat Srinuanmak</h1>
                </div>
            </div>
        </div>
    )
}
