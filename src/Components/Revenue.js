import React, {useState, useEffect}from "react";
import {fs} from '../config/config';
import { NavbarAdmin } from "./NavbarAdmin";
import Dropdown from 'react-dropdown';
import { CSVLink } from "react-csv";

export const Revenue = () => {

    const [orders,setOrder] = useState([]);
    const [data,setData] = useState("ASC")
    const [counts,setCounts] = useState('')
    const [countQTY,setCountQTY] = useState('')
    let now = new Date();
    let nextday = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    const headers = [
        { label: "Name", key: "name" },
        { label: "qty", key: "qty" },
        { label: "TotalPrice", key: "TotalPrice" },
      ];

    useEffect(() => {
        fs.collection('revenue').onSnapshot(snapshot => {
            const productsArray = [];
            let i = 0;
            let count = 0;
            let countQty = 0;
            for (var snap of snapshot.docs){
                var data = snap.data();
                data.ID = snap.id;
                productsArray.push({
                    ...data
                })
                count = count + productsArray[i].TotalPrice;
                countQty = countQty + productsArray[i].qty;
                if(now === nextday){
                    console.log('qwe')
                }
                if(productsArray.length === snapshot.docs.length){
                    setOrder(productsArray);
                    setCounts(count);
                    setCountQTY(countQty);
                    console.log(productsArray)
                    console.log(count)
                    console.log(countQty)
                }
                i = i+1;
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

    //const options  = ['รายวัน','รายเดือน','รายปี']
    //const [countdate,setCountDate] = useState('รายวัน')
    const csvReport = {
        data: orders,
        headers: headers,
      };

    return(
        <div>
            <NavbarAdmin/>
            {/*<Dropdown options={options} onChange={setCountDate} value={countdate} placeholder="Select an option" />*/}
            <table className="table border shadow">
                <tbody>
                    <tr>
                        <th onClick={() => sorting('name')}>ชื่อ</th>
                        <th onClick={() => sorting('qty')}>จำนวน</th>
                        <th onClick={() => sorting('TotalPrice')}>ราคา</th>
                    </tr>
                    {
                        orders.map((name,key) => {
                            return(
                                <tr key={key}>
                                    <td>{name.name}</td>
                                    <td>{name.qty}</td>
                                    <td>{name.TotalPrice}</td>
                                </tr>
                            )}
                        )
                    }
                </tbody>
            </table>
            <div>ยอดรวมทั้งหมด {counts}</div>
            <div>จำนวนทั้งหมด{countQTY}</div>
            <CSVLink  {...csvReport}>Export to CSV</CSVLink>
        </div>
    );
}