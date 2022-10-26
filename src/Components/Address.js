import React,{ useRef, useEffect, useState } from "react"
import * as tt from '@tomtom-international/web-sdk-maps'
import * as ttapi from '@tomtom-international/web-sdk-services'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import firebase from 'firebase/compat/app'
import {auth, fs} from '../config/config';
import { Navbar } from "./Navbar"
import {useNavigate} from 'react-router-dom'
  
export const Address = () =>  {

  const navigate = useNavigate();

  const mapElement = useRef()
  const [map, setMap] = useState({})
  const [longitude, setLongitude] = useState(100.630928)
  const [latitude, setLatitude] = useState(13.8789862)
  const [address, setAddress] = useState('')
  const [province, setProvince] = useState('')
  const [country, setCountry] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [distance, setDistance] = useState('')

  function GetUserUid(){
    const [uid, setUid] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user){
                setUid(user.uid);
            }
        })
    },[])
    return uid;
}

const uid = GetUserUid();

  function GetCurrentUser(){
    const [user,setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(user =>{
            if(user){
                fs.collection('users').doc(user.uid).get().then(snapshot =>{
                    setUser(snapshot.data().Fullname);
                })
            }
            else{
                setUser(null);
            }
        })
    },[])
    return user;
  }

  const user = GetCurrentUser();

  const [totalProducts,setTotalProduct] = useState(0);

  useEffect(() => {
      auth.onAuthStateChanged(user => {
          if(user){
              firebase.firestore().collection('users').doc(user.uid).collection('Cart').onSnapshot(snapshot => {
                  const qty = snapshot.docs.length;
                  setTotalProduct(qty);
              })
          }
      })
  },[])

  const handleAddress = () => {
    firebase.firestore().collection('users').doc(uid).collection('Address').add({
      address,
      province,
      country,
      zipcode,
      distance
    }).then(() => {
      setAddress('');
      setProvince('');
      setCountry('');
      setZipcode('');
      navigate('/');
    })
  }

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoordinates);
    }else{
        alert("Geolocation is not supporter by this browser.");
    }
  }

  function getCoordinates(position) {
    console.log(position)
    //console.log(position.coords.latitude)
    setLatitude(position.coords.latitude)   
    setLongitude(position.coords.longitude)     
  }

  const convertToPoints = (lngLat) => {
   /* console.log('convertToPoints')
    console.log(lngLat)*/
    return {
      point: {
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }
    }
  }

  /*const drawRoute = (geoJson, map) => {
    console.log('drawRoute')
    console.log(geoJson)
    console.log(map)
    if (map.getLayer('route')) {
      map.removeLayer('route')
      map.removeSource('route')
    }
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geoJson
      },
      paint: {
        'line-color': '#4a90e2',
        'line-width': 6
  
      }
    })
  }*/

  const addDeliveryMarker = (lngLat, map) => {
    console.log('addDeliveryMarker')
    console.log(lngLat)
    console.log(map)
    const element = document.createElement('div')
    element.className = 'marker-delivery'
    console.log(element)
    new tt.Marker({
      element: element
    })
    .setLngLat(lngLat)
    .addTo(map)
  }

  useEffect(() => {
    const origin = {
      lng: longitude,
      lat: latitude,
    }
    const destinations = [{lng:100.60871752644282,lat:13.897332673468775}]
    

    let map = tt.map({
      key: process.env.REACT_APP_TOM_TOM_API_KEY,
      container: mapElement.current,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
      center: [longitude, latitude],
      zoom: 14,
    })
    setMap(map)

    const addMarker = () => {
      console.log('addMarker')
      const popupOffset = {
        bottom: [0, -25]
      }
      const popup = new tt.Popup({ offset: popupOffset }).setHTML('This is you!')
      const element = document.createElement('div')
      element.className = 'marker'

      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat([longitude, latitude])
        .addTo(map)
      
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat()
        setLongitude(lngLat.lng)
        setLatitude(lngLat.lat)
      })

      marker.setPopup(popup).togglePopup()
      
    }
    addMarker()

    const sortDestinations = (locations) => {
      console.log('sortDestinations')
      //console.log(locations)
      const pointsForDestinations = locations.map((destination) => {
        return convertToPoints(destination)
      })
      const callParameters = {
        key: process.env.REACT_APP_TOM_TOM_API_KEY,
        destinations: pointsForDestinations,
        origins: [convertToPoints(origin)],
      }

    return new Promise((resolve, reject) => {
      ttapi.services
        .matrixRouting(callParameters)
        .then((matrixAPIResults) => {
          const results = matrixAPIResults.matrix[0]
          const resultsArray = results.map((result, index) => {
            return {
              location: locations[index],
              drivingtime: result.response.routeSummary.travelTimeInSeconds,
            }
          })
          resultsArray.sort((a, b) => {
            return a.drivingtime - b.drivingtime
          })
          const sortedLocations = resultsArray.map((result) => {
            return result.location
          })
          resolve(sortedLocations)
        })
      })
    }

    const recalculateRoutes = () => {
      console.log('recalculateRoutes')
      sortDestinations(destinations).then((sorted) => {
        sorted.unshift(origin)
        //console.log(sorted.unshift(origin))

        ttapi.services
          .calculateRoute({
            key: process.env.REACT_APP_TOM_TOM_API_KEY,
            locations: sorted,
          })
          .then((routeData) => {
            const geoJson = routeData.toGeoJson()
            setDistance(geoJson.features[0].properties.summary.lengthInMeters)
            console.log(geoJson.features[0].properties.summary.lengthInMeters)
            console.log(geoJson.features[0].properties.summary.travelTimeInSeconds)
            //drawRoute(geoJson, map)
          })
      })
    }
    recalculateRoutes()

    /*map.on('click', (e) => {
      console.log(e.lngLat)
      destinations.push(e.lngLat)
      addDeliveryMarker(e.lngLat, map)
      recalculateRoutes()
    })*/

    return () => map.remove()
  }, [longitude, latitude])

  
  const SearchMap = (num) => {
    if(num ===1){
    ttapi.services
      .fuzzySearch({
        key: process.env.REACT_APP_TOM_TOM_API_KEY,
        query: document.getElementById("query").value,

      }).then((routeData) => {
          setLatitude(routeData.results[0].position.lat)
          setLongitude(routeData.results[0].position.lng)
          console.log(routeData.results[0].position.lat)
          console.log(routeData.results[0].position.lng)
      })
    }
  }

    return (
      <>
      {/*<Navbar user = {user} totalProducts = {totalProducts}/>*/}
      <h1>ที่อยู่</h1>
      <input type="text" onChange={(e) => {setAddress(e.target.value)}}/>
      <h1>จังหวัด</h1>
      <input type="text" onChange={(e) => {setProvince(e.target.value)}}/>
      <h1>ประเทศ</h1>
      <input type="text" onChange={(e) => {setCountry(e.target.value)}}/>
      <h1>รหัสไปรษณีย์</h1>
      <input type="text" onChange={(e) => {setZipcode(e.target.value)}}/>
        {map && (
          <div className="app">
            <div className="search-bar">
              <h1>Search Location</h1>
              <input
                type="text"
                id="query"
                onChange={(e) => {
                  SearchMap(e.target.value)
                }}
              />
              <button onClick={() => SearchMap(1)} >Search</button>
              <button onClick={getLocation}>Location</button>
            </div>
            <div ref={mapElement} className="map" />
            <div>
              <button onClick={handleAddress}>Submit</button>
            </div>
          </div>
        )}
      </>
    )
}