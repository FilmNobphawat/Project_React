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
            <div className="product-text title">{individualProduct.title}</div>
            <div className="product-text description">รายละเอียด: {individualProduct.description}</div>
            <div className="product-text price">ราคา: {individualProduct.price} บาท/กิโลกรัม</div>
            {individualProduct.numberOfProducts > 0 && (<>
                <div className="product-text price">สถานะสินค้า: ยังมีสินค้า</div>
                <div className="product-bt">
                    <div className="btn btn-danger btn-md cart-btn" onClick={handleAddToCart}>เพิ่มสินค้าลงตะกร้า</div>
                </div>
                
            </>)}
            {individualProduct.numberOfProducts <= 0 && (<>
                <div className="product-text price">สถานะสินค้า: สินค้าหมดแล้ว</div>
                <div className="product-bt">
                    <div className="btn btn-danger btn-md disabled" onClick={handleAddToCart}>สินค้าหมดแล้ว</div>
                </div>
                
            </>)}
        </div>
    )
}