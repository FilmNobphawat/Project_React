import { NavbarAdmin } from "./NavbarAdmin";
import React,{useState, useEffect} from "react";
import {fs} from '../config/config';
import { EditProduct } from "./EditProduct";

export const Admin = () => {
    
    const [products,setProducts] = useState([]);

    const getProduct = async () => {
        const products = await fs.collection('Products').get();
        const productsArray = [];
        for (var snap of products.docs){
            var data = snap.data();
            data.ID = snap.id;
            productsArray.push({
                ...data
            })
            if(productsArray.length === products.docs.length){
                setProducts(productsArray);
            }
        }
    }

    useEffect(() => {
        getProduct();
    },[])

    return(
        <div>
            <NavbarAdmin/>
            {products.length > 0 && (
                <div className="container-fluid">
                    <h1 className="text-center padmar50px">สินค้าทั้งหมด</h1>
                    <div className="products-box">
                        <EditProduct products={products}/>
                    </div>
                </div>
            )}
            {products.length < 1 && (
                <div className="container-fluid">กรุณารอสักครู่ ....</div>
            )}
        </div>
    )
}