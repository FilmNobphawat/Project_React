import React ,{useState}from "react";
import { Edit } from "./Edit";
import {auth, fs} from '../config/config';
import firebase from 'firebase/compat/app'

export const IndividualEdit = ({individualEdit}) => {

    const [showModal,setShowModal] = useState(false);

    const triggerModal = () => {
        setShowModal(true);
    }

    function onCloseClick(){
        setShowModal(null)   
    }

    const headleProductDelete = () => {  
        fs.collection('Products').doc(individualEdit.ID).delete().then(()=>{
            console.log('successfully deleted');
        })
    }

    return(
        <div className="product">
            <div className="product-img">
                <img src = {individualEdit.url} alt = "product-img"/>
            </div>
            <div className="product-text title">{individualEdit.title}</div>
            <div className="product-text description">รายละเอียด: {individualEdit.description}</div>
            <div className="product-text price">ราคา: {individualEdit.price} /กิโลกรัม</div>
            <div className="product-text price">จำนวนสินค้า: {individualEdit.numberOfProducts} กิโลกรัม</div>
            <div className="product-bt">
            <div className="btn btn-danger btn-md cart-btn" onClick={() => triggerModal()}>EDIT</div>
            {showModal === true && (
                <Edit onBgClick={onCloseClick} individualEdit = {individualEdit}/>
            )
            }
            </div>
            <div className="product-bt">
                <div className="btn btn-danger btn-md cart-btn" onClick = {headleProductDelete}>ลบ</div>
            </div>
        </div>
    )
}