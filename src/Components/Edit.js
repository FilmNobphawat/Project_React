import React ,{useState}from "react";
import {fs} from '../config/config';

export const Edit = (props) => {
    const { onBgClick,individualEdit } = props;

    const [title,setTitle] = useState(individualEdit.title);
    const [description,setDescription] = useState(individualEdit.description);
    const [price, setPrice] = useState(individualEdit.price);
    const [numberOfProducts,setNumberOfProducts] = useState(individualEdit.numberOfProducts);

    const Editer = async() => {
        const products = await fs.collection('Products').get();
        const productsArray = [];
        for (var snap of products.docs){
            var data = snap.data();
            data.ID = snap.id;
            productsArray.push({
                ...data
            })
        }
        for(var i = 0; i < productsArray.length; i++){
            if(individualEdit.ID === productsArray[i].ID){
                productsArray[i].title = title
                productsArray[i].description = description
                productsArray[i].price = price
                productsArray[i].numberOfProducts = numberOfProducts
                fs.collection('Products').doc(individualEdit.ID).update(
                    {
                        title: productsArray[i].title,
                        description: productsArray[i].description,
                        price: productsArray[i].price,
                        numberOfProducts: productsArray[i].numberOfProducts
                    });
            }
        }
        setTitle('')
        setDescription('')
        setPrice('')
        setNumberOfProducts('')
        onBgClick()
    }
    return(
        <div className="shade-area">
            <div className="modal-container">
                <label>ชื่อสินค้า</label>
                <input type="text" className='form-control' required
                onChange={(e) => setTitle(e.target.value)} value = {title}></input>
                <br></br>
                <label>รายละเอียนสินค้า</label>
                <input type="text" className='form-control' required
                onChange={(e) => setDescription(e.target.value)} value = {description}></input>
                <br></br>
                <label>ราคาสินค้า</label>
                <input type="number" className='form-control' required
                onChange={(e) => setPrice(e.target.value)} value = {price}></input>
                <br></br>
                <label>จำนวนสินค้า</label>
                <input type="number" className='form-control' required
                onChange={(e) => setNumberOfProducts(e.target.value)} value = {numberOfProducts}></input>
                <br></br>
                <button onClick={Editer}>Edit</button>
                <button onClick={onBgClick}>Back</button>
            </div>
        </div>
    )
}