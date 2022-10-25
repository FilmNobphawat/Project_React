import React,{useState} from "react";
import { fs, storage } from "../config/config";
import {useNavigate} from 'react-router-dom'
import { NavbarAdmin } from "./NavbarAdmin";

export const AddProducts = () => {

    const navigate = useNavigate();

    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [numberOfProducts,setNumberOfProducts] = useState('');
    const [image,setImage] = useState(null);

    const [imageError,setImageError] = useState('');

    const [successMsg,setSuccessMsg] = useState('');
    const [uploadError,setUploadError] = useState('');

    const types = ['image/jpg','image/jpeg','image/png','image/PNG'];

    const handleProductImg = (e) => {
        let selsctedFile = e.target.files[0];
        if(selsctedFile){
            if(selsctedFile&&types.includes(selsctedFile.type)){
                setImage(selsctedFile);
                setImageError('');
            }
            else{
                setImage(null);
                setImageError('please select a valid image file type (png or jpg)')
            }
        }
        else{
            console.log('please select your file')
        }
    }

    const handleAddProducts = (e) => {
        e.preventDefault();
        //console.log(title,description,price);
        //console.log(image);
        const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
        uploadTask.on('state_changed',snapshot =>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
            console.log(progress);
        },error => setUploadError(error.message),() => {
            storage.ref('product-images').child(image.name).getDownloadURL().then(url =>{
                console.log(image);
                fs.collection('Products').add({
                    title,
                    description,
                    price: Number(price),
                    numberOfProducts,
                    url
                }).then(() => {
                    setSuccessMsg('Product added successfully');
                    setTitle('');
                    setDescription('');
                    setPrice('');
                    setNumberOfProducts('');
                    document.getElementById('file').value='';
                    setImageError('');
                    setUploadError('');
                    setTimeout(() => {
                        setSuccessMsg('');
                        navigate('/admin');
                    },3000)
                }).catch(error => setUploadError(error.message));
            })
        })
    }

    return (
        <div>
            <NavbarAdmin/>
            <div className='container'>
                <br></br>
                <br></br>
                <h2>เพิ่มสินค้า</h2>
                <hr></hr>
                {successMsg&&<>
                    <div className="success-msg">{successMsg}</div>
                    <br></br>
                </>}
                <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                    <label>ชื่อสินค้า</label>
                    <input type="text" className='form-control' required
                    onChange={(e) => setTitle(e.target.value)} value = {title}></input>
                    <br></br>
                    <label>รายละเอียดสินค้า</label>
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
                    <label>รูปภาพสินค้า</label>
                    <input type="file" className='form-control' id="file" required
                    onChange={handleProductImg}></input>
                    {imageError&&<>
                        <br></br>
                        <div className="error-msg">{imageError}</div>
                    </>}
                    <br></br>
                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                        <button type="submit" className="btn btn-success btn-md">
                            เพิ่มสินค้า
                        </button>
                    </div>
                </form>
                {uploadError&&<>
                    <br></br>
                    <div className="error-msg">{uploadError}</div>
                </>}
            </div>
        </div>
    )
}