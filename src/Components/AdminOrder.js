import React, {useState, useEffect}from "react";
import {fs} from '../config/config';
import { NavbarAdmin } from "./NavbarAdmin";
import { Slip } from "./Slip";
import { MapAdmin } from "./MapAdmin";
import { ShowDetail } from "./ShowDetail";

export const AdminOrder = () => {

    //const navigate = useNavigate();

    const [orders,setOrder] = useState([]);
    const [data,setData] = useState("ASC")

    
    useEffect(() => {
        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').onSnapshot(snapshot => {
            const ordersArray = [];
            let i = 0;
            for (var snap of snapshot.docs){
                var data = snap.data();
                data.ID = snap.id;
                ordersArray.push({
                    ...data
                })
                let names = '';
                let detail = '';
                console.log(ordersArray[i])
                for (let j = 0;j < ordersArray[i].number_of_product_types;j++){
                    if(j === 0){
                        names = names+ordersArray[i][j].title;
                        detail = detail+ordersArray[i][j].title+': '+ordersArray[i][j].details+'  ';
                    }else{
                        names = names+','+ordersArray[i][j].title;
                        detail = detail+','+ordersArray[i][j].title+': '+ordersArray[i][j].details+'  ';
                    }
                }
                ordersArray[i].All_Name = names
                ordersArray[i].All_Detail = detail
                i = i+1
                if(ordersArray.length === snapshot.docs.length){
                    i = 0;
                    setOrder(ordersArray);
                    names = '';
                }
            }
        })
    },[]);

    const sorting = (col) => {
        if (data === "ASC"){
            const sorted = [...orders].sort((a, b) =>
                a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
            );
            setOrder(sorted);
            setData("DSC")
        }
        if (data === "DSC"){
            const sorted = [...orders].sort((a, b) =>
                a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
            );
            setOrder(sorted);
            setData("ASC")
        }
    };

    const changeStatus = async(status,uuid,id,date) => {
        let orderid;
        let breakCondition = false;
        const user = await fs.collection('users').doc(uuid).collection('Order').get()
        const userArray = [];
        for (var snap of user.docs){
            var data = snap.data();
            data.ID = snap.id;
            userArray.push({
                ...data
            })
            for(var j = 0;j < userArray.length;j++){
                if(date === userArray[j].date){
                    orderid = userArray[j].ID
                }
            }
        }
        let statusDelivery;
        const order = await fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').get()
        const orderArray = [];
        for (var snap of order.docs){
            var data = snap.data();
            data.ID = snap.id;
            orderArray.push({
                ...data
            })
            for(var i = 0; i < orderArray.length; i++){
                if(id === orderArray[i].ID && !breakCondition){
                    orderArray[i].status = status;
                        statusDelivery = "success"
                        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').doc(orderArray[i].ID).update({status: statusDelivery}).then(() => {console.log('Admin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({status: statusDelivery}).then(() => {console.log('users')})
                        for(var k = 0; k < orderArray[i].number_of_product_types; k++){
                            fs.collection('revenue').add({
                                name :orderArray[i][k].title,
                                TotalPrice : orderArray[i][k].TotalProductPrice,
                                qty : orderArray[i][k].qty,
                                date : new Date()
                            })                      
                        }                   
                    breakCondition  = true
                }
                }
        }

    }

    const changePreparationStatus = async(status,uuid,id,date) => {
        let orderid;
        let breakCondition = false;
        const user = await fs.collection('users').doc(uuid).collection('Order').get()
        const userArray = [];
        for (var snap of user.docs){
            var data = snap.data();
            data.ID = snap.id;
            userArray.push({
                ...data
            })
            for(var j = 0;j < userArray.length;j++){
                if(date === userArray[j].date){
                    orderid = userArray[j].ID
                }
            }
        }
        let statusDelivery;
        const order = await fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').get()
        const orderArray = [];
        for (var snap of order.docs){
            var data = snap.data();
            data.ID = snap.id;
            orderArray.push({
                ...data
            })
            for(var i = 0; i < orderArray.length; i++){
                if(id === orderArray[i].ID && !breakCondition){
                    orderArray[i].status = status;
                    if(status === "?????????????????????????????????"){
                        statusDelivery = "?????????????????????????????????"
                        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').doc(orderArray[i].ID).update({Product_preparation_status: statusDelivery}).then(() => {console.log('?????????????????????????????????Admin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({Product_preparation_status: statusDelivery}).then(() => {console.log('?????????????????????????????????users')})
                    }
                    else{
                        statusDelivery = "????????????????????????????????????"
                        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').doc(orderArray[i].ID).update({Product_preparation_status: statusDelivery}).then(() => {console.log('???????????????????????????Admin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({Product_preparation_status: statusDelivery}).then(() => {console.log('???????????????????????????users')})
                    }
                    breakCondition  = true
                }
            }
        }
    }

    const [showModal,setShowModal] = useState(false);
    const [showMap,setShowMap] = useState(false);
    const [imageSlip,setImageSlip] = useState(false);
    const [showDetail,setShowDetail] = useState('')
    const [lat,setLat] = useState(0)
    const [long,setLong] = useState(0)
    const triggerModal = (image) => {
        setShowModal(true);
        setImageSlip(image);
    }
    const triggerMap = (latitude,longitude) => {
        setShowMap(true);
        setLat(latitude)
        setLong(longitude)
    }
    const triggerDetail = (detail) => {
        setShowModal(true);
        setShowDetail(detail)
    }
    function onCloseClickDetail(){
        setShowModal(null)
    }
    function onCloseClick(){
        setShowModal(null)
    }
    function onCloseClickMap(){
        setShowMap(null)
    }

    return (
        <div>
            <NavbarAdmin/>
            <h1 className="text-center stepmargin">??????????????????????????????????????????</h1>
            <table className="table border shadow padmar50px">
                <tbody>
                    <tr className="tdcenter">
                        <th onClick={() => sorting('date')}>??????????????????????????????</th>
                        <th onClick={() => sorting('Fullname')}>????????????</th>
                        <th onClick={() => sorting('All_Name')}>??????????????????</th>
                        <th className="tdright" onClick={() => sorting('totalShipping')}>????????????</th>
                        <th className="tdright" onClick={() => sorting('totalQty')}>?????????????????????????????????</th>
                        <th onClick={() => sorting('details')}>?????????????????????????????????????????????</th>
                        <th onClick={() => sorting('statusDelivery')}>????????????????????????????????????</th>
                        <th onClick={() => sorting('Slip_url')}>????????????</th>
                        <th className="tdright" onClick={() => sorting('status')}>????????????????????????????????????????????????</th>
                        <th className="tdright" onClick={() => sorting('Product_preparation_status')}>??????????????????????????????????????????</th>
                        <th className="tdright" onClick={() => sorting('Product_preparation_status')}>???????????????????????????????????????</th>
                    </tr>
                    {
                        orders.map(
                            (info,ind) => {
                                return(
                                        <tr key={ind}>
                                            <td className="tdcenter">{info.date}</td>
                                            <td className="tdcenter">{info.Fullname}</td>
                                            <td className="tdcenter">{info.All_Name}</td>
                                            <td className="tdcenter tdright">{info.totalShipping}</td>
                                            <td className="tdcenter tdright">{info.totalQty}</td>
                                            <td className="tdcenter"><button className="rebuybutton" onClick={() => triggerDetail(info.All_Detail)}>????????????????????????????????????????????????????????????</button></td>
                                            <td className="tdcenter">{info.statusDelivery}</td>
                                            {info.Slip_url !== null && info.statusDelivery === "??????????????????" && (
                                                // <td className="tdcenter" onClick={() => triggerModal(info.Slip_url)}>??????????????????</td>
                                                <td className="tdcenter"><button className="rebuybutton" onClick={() => triggerModal(info.Slip_url)}>??????????????????</button></td>

                                            )}
                                            {info.Slip_url === null && info.statusDelivery === "??????????????????" && (
                                                <td className="tdcenter">??????????????????????????????????????????????????????</td>
                                            )}
                                            {info.statusDelivery === "??????????????????" &&(
                                                <td className="tdcenter">?????????????????????????????????</td>
                                            )}
                                            <td className="tdcenter tdright">{info.status}     <button className="rebuybutton" onClick={() => changeStatus(info.status,info.UUID,info.ID,info.date)}>????????????????????????????????????</button></td>
                                            <td className="tdcenter tdright">{info.Product_preparation_status}     <button className="rebuybutton" onClick={() => changePreparationStatus(info.Product_preparation_status,info.UUID,info.ID,info.date)}>????????????????????????????????????</button></td>
                                            <td className="tdcenter tdright"><button className="rebuybutton" onClick={() => triggerMap(info.latitude,info.longitude)}>??????</button></td> 
                                            {showModal === true && (    
                                            <Slip onBgClick={onCloseClick} imageSlip = {imageSlip}/>
                                            )}
                                            {showMap === true && (
                                            <MapAdmin onBgClick={onCloseClickMap} latitude = {lat} longitude = {long}/>
                                            )}
                                            {showModal === true && (    
                                            <ShowDetail onBgClick={onCloseClickDetail} showDetail = {showDetail}/>
                                            )} 
                                        </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}