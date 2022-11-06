import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import { Navbar } from "./Navbar";
import { Product } from "./Product";
import {auth, fs} from '../config/config';
import {useNavigate} from 'react-router-dom'

export const Home = () => {

    const navigate = useNavigate();

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
    //console.log(user);


    const [products,setProducts] = useState([]);

    const getProduct = async () => {
        const products = await fs.collection('Products').get();
        const productsArray = [];
        for (var snap of products.docs){
            var data = snap.data();
            data.ID = snap.id;
            productsArray.push({
                ...data
            })
            if(productsArray.length === products.docs.length){
                setProducts(productsArray);
            }
        }
    }

    useEffect(() => {
        getProduct();
    },[])

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

    let Pro;
    const addToCart = (product) => {
        if(uid !== null){
            Pro = product;
            Pro.numberOfProducts = Pro.numberOfProducts-1
            Pro['qty']=1;
            Pro['TotalProductPrice'] = Pro.qty*Pro.price;
            Pro['details'] = null;
            firebase.firestore().collection('users').doc(uid).collection('Cart').doc(product.ID).set(Pro).then(() => {
                console.log('successfully added to cart')
            })
            fs.collection('Products').doc(product.ID).update({numberOfProducts: Pro.numberOfProducts});
        }
        else{
            navigate('/login');
        }

    }

    return(
        <div>
            <Navbar user = {user} totalProducts = {totalProducts}/>
            <br></br>
            {products.length > 0 && (
                <div className="container-fluid">
                    <h1 className="text-center marginbottom">สินค้า</h1>
                    <div className="products-box">
                        <Product products={products} addToCart = {addToCart}/>
                    </div>
                </div>
            )}
            {products.length < 1 && (
                <div className="container-fluid">กรุณารอสักครู่ ....</div>
            )}
        </div>
    )
}