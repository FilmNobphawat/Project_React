import React,{useState, useEffect} from "react";
import firebase from 'firebase/compat/app'
import 'firebase/firestore';
import { Navbar } from "./Navbar";
import {auth, fs, storage} from '../config/config';
import { CartProduct } from "./CartProduct";
import StripeChecout from 'react-stripe-checkout'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { QRcode } from "./QRcode";
import Moment from 'moment';

import { toast } from "react-toastify";
import {} from'react-toastify/dist/ReactToastify.css';

//toast.configure();

export const Cart = () => {

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

    const uuid = GetUserUid();

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

    const [admin,setAdmin] = useState('')
    const GetCurrentAdmin = async() => {
        const adminId = await fs.collection('Admin').get();
        const adminIdArray = [];
        for (var snap of adminId.docs){
            var data = snap.data();
            data.ID = snap.id;
            adminIdArray.push({
                ...data
            })
            if(adminIdArray.length === adminId.docs.length){
                setAdmin(adminIdArray[0].ID)
                
            }
        }  
    }
    GetCurrentAdmin()

    const [cartProducts,setCartProducts] = useState([]);

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                firebase.firestore().collection('users').doc(user.uid).collection('Cart').onSnapshot(snapshot=>{
                    const newCsrtProduct = snapshot.docs.map((doc)=>({
                        ID : doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCsrtProduct);
                })
            }
            else{
                console.log('user is not signed in to retrieve cart');
            }
        })
    },[])

    //console.log(cartProducts);

    const qty = cartProducts.map(cartProduct => {
        return cartProduct.qty;
    })

    const reducerOfQty = (accumulator, currentValue) => accumulator+currentValue;

    const totalQty = qty.reduce(reducerOfQty,0);

    const price = cartProducts.map((cartProduct) => {
        return cartProduct.TotalProductPrice;
    })

    const reducerOfPrice = (accumulator,currentValue) => accumulator+currentValue;

    const totalPrice = price.reduce(reducerOfPrice,0);

    let Product;
    const cartProductIncrease = async(cartProducts) => {

        Product = cartProducts;
        if(Product.numberOfProducts > 0){
            Product.qty = Product.qty+1;
            Product.numberOfProducts = Product.numberOfProducts-1;
            Product.TotalProductPrice = Product.qty*Product.price;
            auth.onAuthStateChanged(user => {
                if(user){
                    firebase.firestore().collection('users').doc(user.uid).collection('Cart').doc(cartProducts.ID).update(Product).then(() => {
                        console.log('increment added')
                    });
                    fs.collection('Products').doc(cartProducts.ID).update({numberOfProducts: Product.numberOfProducts});
                }
                else{
                    console.log('user is not logged in to increment')
                }
            })
        }
    }

    const cartProductDecrease = async(cartProducts) => {

        Product = cartProducts;
        if (Product.qty > 1){
            Product.qty = Product.qty-1;
            Product.numberOfProducts = Product.numberOfProducts+1;
            Product.TotalProductPrice = Product.qty*Product.price;
            auth.onAuthStateChanged(user => {
                if(user){
                    firebase.firestore().collection('users').doc(user.uid).collection('Cart').doc(cartProducts.ID).update(Product).then(() => {
                        console.log('decrement')
                    });
                    fs.collection('Products').doc(cartProducts.ID).update({numberOfProducts: Product.numberOfProducts});
                }
                else{
                    console.log('user is not logged in to decrement')
                }
            })
        }
        
    }

    const [uploadError,setUploadError] = useState('');

    let addOr = cartProducts;

    const addToOrder = async() => {
        if (discountcount !== 0){
            addOr['totalPrice'] = discountcount;
        }else{
            addOr['totalPrice'] = totalPrice;
        }
        addOr['totalQty'] = totalQty;
        if (damodetails !== null){
            addOr['details'] = damodetails;
            setDamoDetails(null)
        }else{
            addOr['details'] = details.label;
        }
        addOr['statusDelivery'] = statusDelivery.label;
        addOr['status'] = status;
        addOr['number_of_product_types'] = totalProducts;
        addOr['date'] = Moment().format('YYYY-MM-DD,HH:mm:ss');
        addOr['Product_preparation_status'] = 'รอการยืนยัน';
        addOr['deliveryPrice'] = Math.round(deliveryPrice);
        addOr['totalShipping'] = Math.round(deliveryPrice+totalPrice)
        addOr['All_Name'] = "";
        addOr['Fullname'] = user;
        addOr['UUID'] = uuid;
        if(image !== null){
            const uploadTask = storage.ref(`Slip-images/${image.name}`).put(image);
            uploadTask.on('state_changed',snapshot =>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                console.log(progress);
            },error => setUploadError(error.message),() => {
                storage.ref('Slip-images').child(image.name).getDownloadURL(image).then(url =>{
                    addOr['Slip_url'] = url;
                    firebase.firestore().collection('users').doc(uuid).collection('Order').doc(addOr.ID).set(Object.assign({},addOr)).then(() => {
                        console.log('Userเสร็จ')
                    })
                    firebase.firestore().collection('Admin').doc(admin).collection('Order').doc(addOr.ID).set(Object.assign({},addOr)).then(() => {
                        console.log('Adminเสร็จ')
                    })
                })
            })
        }else{
            addOr['Slip_url'] = image;
            firebase.firestore().collection('users').doc(uuid).collection('Order').doc(addOr.ID).set(Object.assign({},addOr)).then(() => {
                console.log('Userเสร็จ')
            })
            firebase.firestore().collection('Admin').doc(admin).collection('Order').doc(addOr.ID).set(Object.assign({},addOr)).then(() => {
                console.log('Adminเสร็จ')
            })
        }
        const uid = auth.currentUser.uid;
        const carts = await firebase.firestore().collection('users').doc(uid).collection('Cart').get();
        for(var snap of carts.docs){
            firebase.firestore().collection('users').doc(uid).collection('Cart').doc(snap.id).delete();
        }
        navigate('/');
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

    const handleToken = async(token) => {
        //console.log(token);
        const cart = {name: 'All Products',totalPrice}
        const response = await axios.post('http://localhost:8080/checkout', {
            token,
            cart
        })
        let {status} = response.data;
        if(status === 'success'){
            toast.success('Your order has been placed successfully',{
                position: 'top-right',
                autoClose: 5000,
                //hideProgressBar: false,
                //closeOnClick: true,
                //pauseOnHover: false,
                //draggable: false,
                //progress: undefined,
            });
            setStatus('success');
        }
        else{
            alert('Something went wrong in checkout');
        }
    }

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
            if(discountArray.length === discount.docs.length){
                const count = (totalPrice-((totalPrice*discountArray[0].discount)/100))
                setDiscountCount(count)
                console.log(discountcount)
                return (count)
            }
        }
    }
    getDiscount();

    const [deliveryPrice,setDeliveryPrice] = useState(0)
    const getDelivery = async () => {
        const discount = await firebase.firestore().collection('users').doc(uuid).collection('Address').get();
        const discountArray = [];
        for (var snap of discount.docs){
            var data = snap.data();
            data.ID = snap.id;
            discountArray.push({
                ...data
            })
            if(discountArray.length === discount.docs.length){
                const count = (discountArray[0].distance/1000)
                if (count < 5){
                    setDeliveryPrice(count*15)
                }else{
                    setDeliveryPrice(count*20)
                }
            }
        }
    }
    getDelivery();

    const options  = ['ตัวหัวผ่าท้อง','ถอดเกล็ดอย่างเดียว','ผ่าท้องอย่างเดียว','ไม่ต้องทำอะไร','อื่นๆ']
    const options1  = ['รับเอง','จัดส่ง']
    const [details, setDetails] = useState('');
    const [damodetails, setDamoDetails] = useState(null);
    const [statusDelivery,setStatusDelivery] = useState('');
    const [showModal,setShowModal] = useState(false);
    const [status,setStatus] = useState('not success')
    const triggerModal = () => {
        setShowModal(true);
    }
    const [image,setImage] = useState(null)

    function onCloseClick(image){
        setShowModal(null)
        setImage(image)
    }

    return(
        <div>
            <Navbar user={user} totalProducts ={totalProducts}/>
            <br></br>
            {cartProducts.length > 0 && (
                <div className="container-fluid">
                    <h1 className="text-center">Cart</h1>
                    <div className="products-box">
                        <CartProduct cartProducts={cartProducts}
                            cartProductIncrease ={cartProductIncrease}
                            cartProductDecrease ={cartProductDecrease}
                        />
                    </div>
                    <div className="summary-box">
                        <h5>Cart summary</h5>
                        <br></br>
                        <div>
                            Total No of Products : <span>{totalQty}</span>
                        </div>
                        <div>
                            Total Price to Pay : <span>$ {totalPrice}</span>
                        </div>
                        {discountcount > 0 && (
                            <div>
                                Total discount to Pay: <span>$ {Math.round(discountcount)}</span>
                            </div>
                        )}
                        <h6>ให้ทำปลาแบบไหน</h6>
                        <Dropdown options={options} onChange={setDetails} value="ให้ทำปลาแบบไหน" placeholder="Select an option" />
                        <div>
                        {details.label === 'อื่นๆ' && (
                            <input type="text" required onChange={(e) => {setDamoDetails(e.target.value)}} value={damodetails}/>
                        )}
                        </div>
                        <h6>จัดส่งหรือรับเอง</h6>
                        <Dropdown options={options1} onChange={setStatusDelivery} value="จัดส่งหรือรับเอง" placeholder="Select an option" />
                        <br></br>
                        {statusDelivery.label === 'จัดส่ง' && (<>
                            <div>
                                Delivery to Pay: <span>$ {Math.round(deliveryPrice)}</span>
                            </div>
                            <div>
                            total shipping to Pay: <span>$ {Math.round(deliveryPrice+totalPrice)}</span>
                            </div>
                            <StripeChecout
                            stripeKey = 'pk_test_51LoVhZCFsKrvXBJT6RKf3ve6QMC75rLnFfLvo74ybSoDhTgEBPLUcNQR7HvvJPm4HaDtYHw6cBgwDnQMTKua5OzG00GTHKHzKi'
                            token={handleToken}
                            billingAddress
                            shippingAddress
                            name="All Products"
                            amount={totalPrice * 100}>
                            </StripeChecout>
                            <h6 style={{marginTop:7+"px"}}>OR</h6>
                            <div className="btn btn-danger btn-md cart-btn" onClick={() => triggerModal()}>Pay With QR</div>
                            </>
                        )}
                        <br></br>
                        <div className="btn btn-danger btn-md cart-btn" onClick={addToOrder}>ADD TO CART</div>
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className="container-fluid">No product to show</div>
            )}

            {showModal === true && (
                <QRcode onBgClick={onCloseClick}/>
            )
            }
            {uploadError&&<>
                    <br></br>
                    <div className="error-msg">{uploadError}</div>
                </>}
        </div>
    )
}