import React ,{useState}from "react";
import { Edit } from "./Edit";

export const IndividualEdit = ({individualEdit}) => {

    const [showModal,setShowModal] = useState(false);

    const triggerModal = () => {
        setShowModal(true);
    }

    function onCloseClick(){
        setShowModal(null)   
    }
    return(
        <div className="product">
            <div className="product-img">
                <img src = {individualEdit.url} alt = "product-img"/>
            </div>
            <div className="product-text title">ชื่อ :{individualEdit.title}</div>
            <div className="product-text description">รายละเอียด :{individualEdit.description}</div>
            <div className="product-text price">ราคา :{individualEdit.price} /กิโลกรัม</div>
            <div className="product-text price">จำนวนสินค้า :{individualEdit.numberOfProducts} กิโลกรัม</div>
            <div className="btn btn-danger btn-md cart-btn" onClick={() => triggerModal()}>EDIT</div>
            {showModal === true && (
                <Edit onBgClick={onCloseClick} individualEdit = {individualEdit}/>
            )
            }
        </div>

        
    )
}