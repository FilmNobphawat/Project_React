import React,{useState, useEffect} from "react";
import Icon from "react-icons-kit";
import {plus} from 'react-icons-kit/feather/plus'
import {minus} from 'react-icons-kit/feather/minus'
import {auth, fs} from '../config/config';
import firebase from 'firebase/compat/app'
import Dropdown from 'react-dropdown';

export const IndividualCartProduct =({cartProduct,cartProductIncrease,cartProductDecrease,onsetdetail}) =>{

    const headleCartProductIncrease = () => {
        cartProductIncrease(cartProduct);
    }

    const headleCartProductDecrease = () => {
        cartProductDecrease(cartProduct);
    }

    const headleCartProductDelete = () => {
        auth.onAuthStateChanged(user => {
            if(user){
                firebase.firestore().collection('users').doc(user.uid).collection('Cart').doc(cartProduct.ID).delete().then(()=>{
                    console.log('successfully deleted');
                })
                fs.collection('Products').doc(cartProduct.ID).update({numberOfProducts: cartProduct.numberOfProducts + cartProduct.qty}).then(() => {
                    console.log('increment number of products')
                })
            }
        })
    }

    const options  = ['ตัวหัวผ่าท้อง','ถอดเกล็ดอย่างเดียว','ผ่าท้องอย่างเดียว','ไม่ต้องทำอะไร','อื่นๆ']
    const [details, setDetails] = useState('');
    const [damodetails, setDamoDetails] = useState(null);

    const test = (test1) => {
        setDetails(test1)
        onsetdetail(test1,cartProduct)
    }

    return( 
        <div className="product">
            <div className="product-img">
                <img src={cartProduct.url} alt = "product-img"/>
            </div>
            <div className="product-text title">ชื่อ: {cartProduct.title}</div>
            <div className="product-text description">รายละเอียด: {cartProduct.description}</div>
            <div className="product-text price">ราคา: {cartProduct.price} บาท/กิโลกรัม</div>
            <div className="product-quantity"> 
                
                {cartProduct.numberOfProducts === 0 && (<><div class="product-quantity-c">
		            <a onClick = {headleCartProductDecrease}>⬅️</a>
                    {/* <button onClick = {headleCartProductDecrease} className="redbutton">-</button> */}

                    จำนวนสินค้าไม่พอ

	            </div></>)}

                {cartProduct.numberOfProducts >0 && (<>
                    <div className="product-quantity-l">
                    จำนวน
                </div>
                <div className="product-quantity-r">
                <div className="product-text quantity-box">
                <div className="action-btns minus">
                    <Icon icon={minus} size={20} onClick = {headleCartProductDecrease}/>
                </div>
                <div>{cartProduct.qty}</div>
                <div className="action-btns plus">
                <Icon icon={plus} size={20} onClick = {headleCartProductIncrease}/>
                </div>
            </div>   </div>             
                </>)}
                

            </div>

            


            <div className="product-text cart-price">ราคาสุทธิ {cartProduct.TotalProductPrice} บาท</div>
            <h6>รูปแบบการจัดทำปลา</h6>
                <Dropdown options={options} onChange={test} placeholder="โปรดเลือกรูปแบบ" />
                <div>
                {details.label === 'อื่นๆ' && (
                    <input className="margintop8" type="text" required onChange={(e) => {setDamoDetails(e.target.value)}} value={damodetails}/>
                )}
                {details.label === 'อื่นๆ' && (
                    <button onClick={() => test(damodetails)}>ยืนยัน</button>
                )}
                </div>
            <div className="product-bt">
                <div className="btn btn-danger btn-md cart-btn" onClick = {headleCartProductDelete}>นำออกจากตะกร้า</div>
            </div>



            
        </div>

        
    )
}