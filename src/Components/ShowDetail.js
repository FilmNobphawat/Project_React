import React from "react";


export const ShowDetail = (props) => {
    const { onBgClick,showDetail} = props;

    return(
        <div className="shade-area" onClick={onBgClick}>
            <div className="modal-container">
                <h1>รายการจัดการสินค้า</h1>
                <div>{showDetail}</div>
            </div>
        </div>
    )
}