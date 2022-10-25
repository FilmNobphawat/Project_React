import React, {useState, useEffect}from "react";
import firebase from 'firebase/compat/app'
import {auth,fs} from '../config/config';
import { Navbar } from "./Navbar";
import {useNavigate} from 'react-router-dom'

export const Order = () => {

    const navigate = useNavigate();

    const [orders,setOrder] = useState([]);
    const [data,setData] = useState("ASC")

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

    const sorting = (col) => {
        if (data === "ASC"){
            const sorted = [...orders].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            );
            setOrder(sorted);
            setData("DSC")
        }
        if (data === "DSC"){
            const sorted = [...orders].sort((a, b) =>
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            );
            setOrder(sorted);
            setData("ASC")
        }
    };
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

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user){
                firebase.firestore().collection('users').doc(user.uid).collection('Order').onSnapshot(snapshot => {
                    const ordersArray = [];
                    let i = 0;
                    for (var snap of snapshot.docs){
                        var data = snap.data();
                        data.ID = snap.id;
                        ordersArray.push({
                            ...data
                        })
                        let names = '';
                        console.log(ordersArray[i])
                        for (let j = 0;j < ordersArray[i].number_of_product_types;j++){
                            if(j === 0){
                                names = names+ordersArray[i][j].title;
                            }else{
                                names = names+','+ordersArray[i][j].title;
                            }
                        }
                        ordersArray[i].All_Name = names
                        i = i+1
                        if(ordersArray.length === snapshot.docs.length){
                            i = 0;
                            setOrder(ordersArray);
                            names = '';
                        }
                    }
                })
            }
        })
    },[]);

    let Pro ;
    const addToCart = async(id) => {

        const products = await fs.collection('Products').get();
        const productsArray = [];
        for (var snap of products.docs){
            var data = snap.data();
            data.ID = snap.id;
            productsArray.push({
                ...data
            })
        }

        for(var i = 0; i < orders.length; i++){
            if(id === orders[i].ID){
                for(var j = 0; j < orders[i].number_of_product_types; j++){
                    Pro = orders[i][j];
                    for(var k = 0; k < productsArray.length; k++){
                        if(Pro.ID === productsArray[k].ID){
                            Pro.numberOfProducts =productsArray[k].numberOfProducts-Pro.qty;
                            console.log(Pro.numberOfProducts)
                        }
                    }
                    console.log(Pro.numberOfProducts)
                    if(uid !== null){
                        firebase.firestore().collection('users').doc(uid).collection('Cart').doc(Pro.ID).set(Pro).then(() => {
                        console.log('successfully added to cart')
                        })
                        fs.collection('Products').doc(Pro.ID).update({numberOfProducts: Pro.numberOfProducts});
                        navigate('/cart');
                    }
                    else{
                        navigate('/login');
                    }
                }
            }
        }
        Pro = null;
        
    }

    return (
        <div>
            <Navbar user = {user} totalProducts = {totalProducts}/>
            <h1 className="text-center">ประวัติการสั่งซื้อ</h1>
            <table className="table border shadow">
                <tbody>
                    <tr className="tdcenter">
                        <th onClick={() => sorting('date')}>วันที่สั่ง</th>
                        <th onClick={() => sorting('All_Name')}>สินค้า</th>
                        <th className="tdright" onClick={() => sorting('totalShipping')}>ราคา</th>
                        <th className="tdright" onClick={() => sorting('totalQty')}>จำนวนสินค้า</th>
                        <th onClick={() => sorting('details')}>รูปแบบการจัดการ</th>
                        <th onClick={() => sorting('statusDelivery')}>รูปแบบการส่ง</th>
                        <th onClick={() => sorting('status')}>สถานะการจ่ายเงิน</th>
                        <th onClick={() => sorting('Product_preparation_status')}>สถานะการจัดส่ง</th>
                    </tr>
                    {
                        orders.map(
                            (info,ind) => {
                                return(
                                    <tr key={ind}>
                                        <td valign="middle" className="tdcenter">{info.date}</td>
                                        <td className="tdcenter">{info.All_Name}</td>
                                        {info.deliveryPrice === 0 &&(
                                            <td className="tdright tdcenter">{info.totalPrice}</td>
                                        )}
                                        {info.deliveryPrice !== 0 &&(
                                            <td className="tdright tdcenter">{info.totalShipping}</td>
                                        )}
                                        <td className="tdcenter tdright">{info.totalQty}</td>
                                        <td className="tdcenter">{info.details}</td>
                                        <td className="tdcenter">{info.statusDelivery}</td>
                                        <td className="tdcenter">{info.status}</td>
                                        <td className="tdcenter">{info.Product_preparation_status}</td>
                                        <td className="tdcenter"><button className="rebuybutton" onClick={() => addToCart(info.ID)}>สั่งซื้อซ้ำ</button></td>
                                    </tr>
                                )   
                            }
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Order;