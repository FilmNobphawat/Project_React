import React from "react";

export const Slip = (props) => {
    const { onBgClick,imageSlip} = props;
    /*console.log(image)
    console.log(id)
    console.log(uid)*/

    return(
        <div className="shade-area" onClick={onBgClick}>
            <div className="modal-container">
                <img src={imageSlip} alt="product-img"/>
            </div>
        </div>
    )
}