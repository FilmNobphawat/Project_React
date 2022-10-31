import React, {useState, useEffect}from "react";
import {fs} from '../config/config';
import { NavbarAdmin } from "./NavbarAdmin";
import { Slip } from "./Slip";
import { MapAdmin } from "./MapAdmin";

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
                for (let j = 0;j < ordersArray[i].number_of_product_types;j++){
                    if(j === 0){
                        names = names+ordersArray[i][j].title;
                    }else{
                        names = names+','+ordersArray[i][j].title;
                    }
                }
                ordersArray[i].All_Name = names
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
                    if(status === "success"){
                        statusDelivery = "not success"
                        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').doc(orderArray[i].ID).update({status: statusDelivery}).then(() => {console.log('notAdmin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({status: statusDelivery}).then(() => {console.log('notusers')})
                    }else{
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
                    if(status === "รอการยืนยัน"){
                        statusDelivery = "กำลังจัดส่ง"
                        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').doc(orderArray[i].ID).update({Product_preparation_status: statusDelivery}).then(() => {console.log('กำลังจัดส่งAdmin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({Product_preparation_status: statusDelivery}).then(() => {console.log('กำลังจัดส่งusers')})
                    }
                    else{
                        statusDelivery = "จัดส่งสำเร็จ"
                        fs.collection('Admin').doc('lh7WUjZ9hxR0MFZiYzte').collection('Order').doc(orderArray[i].ID).update({Product_preparation_status: statusDelivery}).then(() => {console.log('ส่งสำเร็จAdmin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({Product_preparation_status: statusDelivery}).then(() => {console.log('ส่งสำเร็จusers')})
                    }
                    breakCondition  = true
                }
            }
        }
    }

    const [showModal,setShowModal] = useState(false);
    const [showMap,setShowMap] = useState(false);
    const [imageSlip,setImageSlip] = useState(false);
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
    function onCloseClick(){
        setShowModal(null)
    }
    function onCloseClickMap(){
        setShowMap(null)
    }

    return (
        <div>
            <NavbarAdmin/>
            <h1 className="text-center stepmargin">รายการสั่งซื้อ</h1>
            <table className="table border shadow padmar50px">
                <tbody>
                    <tr className="tdcenter">
                        <th onClick={() => sorting('date')}>วันที่สั่ง</th>
                        <th onClick={() => sorting('Fullname')}>ชื่อ</th>
                        <th onClick={() => sorting('All_Name')}>สินค้า</th>
                        <th className="tdright" onClick={() => sorting('totalShipping')}>ราคา</th>
                        <th className="tdright" onClick={() => sorting('totalQty')}>จำนวนสินค้า</th>
                        <th onClick={() => sorting('details')}>รูปแบบการจัดการ</th>
                        <th onClick={() => sorting('statusDelivery')}>รูปแบบการส่ง</th>
                        <th onClick={() => sorting('Slip_url')}>สลิป</th>
                        <th className="tdright" onClick={() => sorting('status')}>สถานะการจ่ายเงิน</th>
                        <th className="tdright" onClick={() => sorting('Product_preparation_status')}>สถานะการจัดส่ง</th>
                        <th className="tdright" onClick={() => sorting('Product_preparation_status')}>สถานที่จัดส่ง</th>
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
                                            <td className="tdcenter">{info.details}</td>
                                            <td className="tdcenter">{info.statusDelivery}</td>
                                            {info.Slip_url !== null && info.statusDelivery === "จัดส่ง" && (
                                                <td className="tdcenter" onClick={() => triggerModal(info.Slip_url)}>ดูสลิป</td>
                                            )}
                                            {info.Slip_url === null && info.statusDelivery === "จัดส่ง" && (
                                                <td className="tdcenter">จ่ายผ่านบัตรเครดิต</td>
                                            )}
                                            {info.statusDelivery === "รับเอง" &&(
                                                <td className="tdcenter">จ่ายปลายทาง</td>
                                            )}
                                            <td className="tdcenter tdright">{info.status}     <button className="rebuybutton" onClick={() => changeStatus(info.status,info.UUID,info.ID,info.date)}>เปลี่ยนสถานะ</button></td>
                                            <td className="tdcenter tdright">{info.Product_preparation_status}     <button className="rebuybutton" onClick={() => changePreparationStatus(info.Product_preparation_status,info.UUID,info.ID,info.date)}>เปลี่ยนสถานะ</button></td>
                                            <td className="tdcenter tdright"><button className="rebuybutton" onClick={() => triggerMap(info.latitude,info.longitude)}>ดู</button></td> 
                                            {showModal === true && (    
                                            <Slip onBgClick={onCloseClick} imageSlip = {imageSlip}/>
                                            )}
                                            {showMap === true && (
                                            <MapAdmin onBgClick={onCloseClickMap} latitude = {lat} longitude = {long}/>
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