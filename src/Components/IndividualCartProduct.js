import React from "react";
import Icon from "react-icons-kit";
import {plus} from 'react-icons-kit/feather/plus'
import {minus} from 'react-icons-kit/feather/minus'
import {auth, fs} from '../config/config';
import firebase from 'firebase/compat/app'

export const IndividualCartProduct =({cartProduct,cartProductIncrease,cartProductDecrease}) =>{

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

    return( 
        <div className="product">
            <div className="product-img">
                <img src={cartProduct.url} alt = "product-img"/>
            </div>
            <div className="product-text title">ชื่อ: {cartProduct.title}</div>
            <div className="product-text description">รายละเอียด: {cartProduct.description}</div>
            <div className="product-text price">ราคา: {cartProduct.price}/กิโลกรัม</div>
            <div className="product-quantity"> 
                
                {cartProduct.numberOfProducts === 0 && (<><div class="product-quantity-c">
		            <a onClick = {headleCartProductDecrease}>&times;</a>

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
            <div className="product-bt">
                <div className="btn btn-danger btn-md cart-btn" onClick = {headleCartProductDelete}>นำออกจากตะกร้า</div>
            </div>



            
        </div>

        
    )
}