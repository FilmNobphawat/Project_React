import React from "react";

export const IndividualProduct = ({individualProduct, addToCart}) => {
    //console.log(individualProduct);
    const handleAddToCart = () => {
        addToCart(individualProduct);
    }
    return(
        <div className="product">
            <div className="product-img">
                <img src = {individualProduct.url} alt = "product-img"/>
            </div>
            <div className="product-text title">ชื่อ :{individualProduct.title}</div>
            <div className="product-text description">รายละเอียด :{individualProduct.description}</div>
            <div className="product-text price">ราคา :{individualProduct.price} /กิโลกรัม</div>
            {individualProduct.numberOfProducts > 0 && (<>
                <div className="product-text price">จำนวนสินค้า :{individualProduct.numberOfProducts} กิโลกรัม</div>
                <div className="btn btn-danger btn-md cart-btn" onClick={handleAddToCart}>ADD TO CART</div>
            </>)}
            {individualProduct.numberOfProducts === 0 && (<><div className="error-msg">สินค้าหมดแล้ว</div></>)}
        </div>
    )
}