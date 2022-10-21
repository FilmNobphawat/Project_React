import React, {useState, useEffect}from "react";
import firebase from 'firebase/compat/app'
import {auth,fs} from '../config/config';
import { NavbarAdmin } from "./NavbarAdmin";
import {useNavigate} from 'react-router-dom';
import Dropdown from 'react-dropdown';
import { Slip } from "./Slip";
import Moment from 'moment';

export const AdminOrder = () => {

    //const navigate = useNavigate();

    const [orders,setOrder] = useState([]);
    const [data,setData] = useState("ASC")

    useEffect(() => {
        fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').onSnapshot(snapshot => {
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
        const order = await fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').get()
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
                        fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').doc(orderArray[i].ID).update({status: statusDelivery}).then(() => {console.log('notAdmin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({status: statusDelivery}).then(() => {console.log('notusers')})
                    }else{
                        statusDelivery = "success"
                        fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').doc(orderArray[i].ID).update({status: statusDelivery}).then(() => {console.log('Admin')})
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
        const order = await fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').get()
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
                        fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').doc(orderArray[i].ID).update({Product_preparation_status: statusDelivery}).then(() => {console.log('กำลังจัดส่งAdmin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({Product_preparation_status: statusDelivery}).then(() => {console.log('กำลังจัดส่งusers')})
                    }
                    else{
                        statusDelivery = "รอการยืนยัน"
                        fs.collection('Admin').doc("xcOC1eVQvz94ETYwYg3i").collection('Order').doc(orderArray[i].ID).update({Product_preparation_status: statusDelivery}).then(() => {console.log('ส่งสำเร็จAdmin')})
                        fs.collection('users').doc(uuid).collection('Order').doc(orderid).update({Product_preparation_status: statusDelivery}).then(() => {console.log('ส่งสำเร็จusers')})
                    }
                    breakCondition  = true
                }
            }
        }
    }

    const [showModal,setShowModal] = useState(false);
    const [imageSlip,setImageSlip] = useState(false);
    const triggerModal = (image) => {
        setShowModal(true);
        setImageSlip(image);
    }

    function onCloseClick(){
        setShowModal(null)
    }

    return (
        <div>
            <NavbarAdmin/>
            <table className="table border shadow">
                <tbody>
                    <tr>
                        <th onClick={() => sorting('date')}>วันที่สั่ง</th>
                        <th onClick={() => sorting('Fullname')}>ชื่อ</th>
                        <th onClick={() => sorting('All_Name')}>สินค้า</th>
                        <th onClick={() => sorting('totalShipping')}>ราคา</th>
                        <th onClick={() => sorting('totalQty')}>จำนวนสินค้า</th>
                        <th onClick={() => sorting('details')}>รูปแบบการจัดการ</th>
                        <th onClick={() => sorting('statusDelivery')}>รูปแบบการส่ง</th>
                        <th onClick={() => sorting('Slip_url')}>สลิป</th>
                        <th onClick={() => sorting('status')}>สถานะการจ่ายเงิน</th>
                        <th onClick={() => sorting('Product_preparation_status')}>สถานะการจัดส่ง</th>
                    </tr>
                    {
                        orders.map(
                            (info,ind) => {
                                return(
                                        <tr key={ind}>
                                            <td>{info.date}</td>
                                            <td>{info.Fullname}</td>
                                            <td>{info.All_Name}</td>
                                            <td>{info.totalShipping}</td>
                                            <td>{info.totalQty}</td>
                                            <td>{info.details}</td>
                                            <td>{info.statusDelivery}</td>
                                            {info.Slip_url !== null && (
                                                <td onClick={() => triggerModal(info.Slip_url)}>กด</td>
                                            )}
                                            {info.Slip_url === null && (
                                                <td>จ่ายผ่านบัตรเครดิต</td>
                                            )}
                                            <td>{info.status}<button onClick={() => changeStatus(info.status,info.UUID,info.ID,info.date)}>กด</button></td>
                                            <td>{info.Product_preparation_status}<button onClick={() => changePreparationStatus(info.Product_preparation_status,info.UUID,info.ID,info.date)}>กด</button></td> 
                                            {showModal === true && (    
                                            <Slip onBgClick={onCloseClick} imageSlip = {imageSlip}/>
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