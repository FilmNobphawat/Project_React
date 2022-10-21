import React,{useState} from "react";
import QR from '../image/QR.jpg'

export const QRcode = (props) =>  {
    const { onBgClick } = props;
    const [image,setImage] = useState(null);
    const [imageError,setImageError] = useState('');
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

    return(
        <div className="shade-area" >
            <div className="modal-container">
                <img src={QR} alt="QR" width='500px' height='700px'/>
                <br></br>
                <label>ส่งสลิป</label> 
                <input type="file" className='form-control' id="file" required
                    onChange={handleProductImg}></input>
                {imageError&&<>
                    <br></br>
                    <div className="error-msg">{imageError}</div>
                </>}
                <br></br>
                <button onClick={() => {onBgClick(image)}}>Submit</button>
            </div>
        </div>
    )
}