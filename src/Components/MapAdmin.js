import React,{ useRef, useEffect, useState } from "react"
import * as tt from '@tomtom-international/web-sdk-maps'
import * as ttapi from '@tomtom-international/web-sdk-services'
import '@tomtom-international/web-sdk-maps/dist/maps.css'
import firebase from 'firebase/compat/app'
import {auth, fs} from '../config/config';
import { Navbar } from "./Navbar"
import {useNavigate} from 'react-router-dom'

export const MapAdmin = (props) => {
    const { onBgClick,latitude,longitude} = props;
    const navigate = useNavigate();
    const mapElement = useRef()
    const [map, setMap] = useState({})
    const [long, setLong] = useState(100.630928)
    const [lat, setLat] = useState(13.8789862)   
      const convertToPoints = (lngLat) => {
        return {
          point: {
            latitude: lngLat.lat,
            longitude: lngLat.lng
          }
        }
      }
    
      const drawRoute = (geoJson, map) => {
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
      }
    
      const addDeliveryMarker = (lngLat, map) => {
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
            setLong(lngLat.lng)
            setLat(lngLat.lat)
          })
    
          marker.setPopup(popup).togglePopup()
          
        }
        addMarker()
    
        const sortDestinations = (locations) => {
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
          sortDestinations(destinations).then((sorted) => {
            sorted.unshift(origin)
    
            ttapi.services
              .calculateRoute({
                key: process.env.REACT_APP_TOM_TOM_API_KEY,
                locations: sorted,
              })
              .then((routeData) => {
                const geoJson = routeData.toGeoJson()
                drawRoute(geoJson, map)
              })
          })
        }
        recalculateRoutes()
    
        map.on('click', (e) => {
          console.log(e.lngLat)
          destinations.push(e.lngLat)
          addDeliveryMarker(e.lngLat, map)
          recalculateRoutes()
        })
    
        return () => map.remove()
      }, [longitude, latitude])

      return(
        <div className="shade-area" onClick={onBgClick}>
            <div className="modal-container">
            {map && (
                <div className="app">
                    <div ref={mapElement} className="map" />
                </div>
                )}
            </div>
        </div>
    )
}