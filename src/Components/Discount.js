import React ,{useState,useEffect } from "react";
import { NavbarAdmin } from "./NavbarAdmin";
import { fs } from "../config/config";

export const Discount = () => {

      const [state] = useState({
        time: {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
          startTime: 0
        },
        duration: 0,
        timer: null,
      });

      const startTimer = start.bind(this);

      const minutesTimes = (timerr) =>{
        state.duration = timerr*1000
        console.log(state.duration)
      }

      const hoursTimes = (timerr) => {
        state.duration = timerr*60*1000;
        console.log(state.duration)
      }

      const getDiscount = async () => {
        fs.collection('Discount').doc('PNwEtfKcuYHzo0NA5Xyn').update({ discount: 0})
      }

      const setDis = (discount) =>{
        fs.collection('Discount').doc('PNwEtfKcuYHzo0NA5Xyn').update({ discount: discount})
        //setDiss(discount);
        console.log(discount)
      }
    
      function msToTime(duration) {
        let milliseconds = parseInt((duration % 1000));
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        milliseconds = milliseconds.toString().padStart(3, '0');
    
        return {
          hours,
          minutes,
          seconds,
          milliseconds
        };
      }
    
      function start() {
        if (!state.timer) {
          state.startTime = Date.now();
          state.timer = window.setInterval(() => run(), 10);
        }
      }
    
      const [pro,setPro] = useState(0)

      const run = () => {
        const diff = Date.now() - state.startTime;
        setPro(diff);
        console.log(diff)
        
        let remaining = state.duration - diff;
        if (remaining < 0) {
          remaining = 0;
        }
        
        if (remaining === 0) {
          window.clearTimeout(state.timer);
          state.timer = null;
          state.time = msToTime(remaining)
          getDiscount();
        }
      }

      useEffect (() => {
         state.time = msToTime(pro)
      })



      return(
        <div>
            <NavbarAdmin />
            <div className="container-fluid">
              <h1 className="text-center stepmargin">จัดโปรโมชั่น</h1>
              

              <div className="a3 a1S a5 padmar50px">
              <div className="summary-box">
              <label className="">Step 1 : เลือกมูลค่าส่วนลดที่จะใช้</label>
                  <button className="clicked" onClick={() => setDis(10)}>10%</button>
                  <br></br>
                  <button className="clicked" onClick={() => setDis(20)}>20%</button>
                  <br></br>
                  <button className="clicked" onClick={() => setDis(30)}>30%</button>
                  <br></br>
                  <button className="clicked" onClick={() => setDis(40)}>40%</button>
                  <br></br>
                  <button className="clicked" onClick={() => setDis(50)}>50%</button>
              </div>
              <br></br>
              
              <div className="summary-box">
              <label>Step 2 : เลือกระยะเวลาที่จะใช้ส่วนลด</label>
                  <button className="clicked" onClick={() => minutesTimes(30)}>30 นาที</button>
                  <br></br>
                  <button className="clicked" onClick={() => hoursTimes(1)}>1 ชม.</button>
                  <br></br>
                  <button className="clicked" onClick={() => hoursTimes(2)}>2 ชม.</button>
                  <br></br>
                  <button className="clicked" onClick={() => hoursTimes(3)}>3 ชม.</button>
                  <br></br>
                  <button className="clicked" onClick={() => hoursTimes(4)}>4 ชม.</button>
              </div>
              <div className="summary-box a5">
                
                <label>Step 3 : ยืนยันการใช้</label>
                    <button className="clicked iconmargin10" onClick = {startTimer} > เริ่มโปรโมชั่น </button> 
                    <div className="margintop8 refontsize">
                      {state.time.hours}: 
                      {state.time.minutes}: 
                      {state.time.seconds}. 
                      {state.time.milliseconds}:
                    </div>
                
              </div>
              </div>


              
            </div>
        </div>
    )
}