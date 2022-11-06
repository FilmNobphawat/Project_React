import React from "react";
import { IndividualCartProduct } from "./IndividualCartProduct";

export const CartProduct = ({cartProducts,cartProductIncrease,cartProductDecrease,onsetdetail}) =>{
    return cartProducts.map((cartProduct) => (
        <IndividualCartProduct key={cartProduct.ID} cartProduct={cartProduct}
        cartProductIncrease = {cartProductIncrease}
        cartProductDecrease = {cartProductDecrease}
        onsetdetail = {onsetdetail}
        />
    ))
}

