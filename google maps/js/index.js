     
     
       let map;
       let markers=[]
      
      
      let infowindow;
      
     let URL1=''

     
      let myLatLng={lat: 34.063380, lng: -118.358080};
            function initMap() {
                map = new google.maps.Map(document.getElementById("map"), {
                    center: myLatLng,
                    zoom: 8,
                      mapId: '8d51f77e97f70615'
                    });
                 
                  //  getStores();
                  document.getElementById('search').addEventListener('click', getStores)
                  infowindow = new google.maps.InfoWindow();

                
                  
              }
           //   lvzHx2XBFOnYchQ2    
          const createMarker=(latlng,name,address,storeNumber,openStatus,phoneNumber,urladdress)=>{
     
            let html=`
            
            <div class="infowindow-container" id="infowindow" style="box-shadow: 0 8px 6px -6px black;">
              <div class="title" style="font-size: 18px; margin-bottom: 5px;" ><b>${name}</b></div>
            
              <div class="openStatus" style="border-bottom: solid 0.1px gray; padding-bottom: 8px;">${openStatus}</div>
              
             <a href="https://www.google.com/maps/search/?api=1&query=${urladdress}" style="text-decoration: none;">  <div class="address" id="address1"  style="margin-top: 10px;  margin-bottom: 10px;font-size: 16px;font-family: monospace;" >
              <i class="fa fa-location-arrow" aria-hidden="true" style="color: skyblue; font-size: 17px; padding-right:5px;"  ></i>${address}</div></a>
              <div class="contactNumber" style="font-size:15px"><i class="fa fa-phone-square fa-rotate-90 " aria-hidden="true" style="margin-right:9px;    font-size: 26px;
              color: darkslateblue;"></i>
              ${phoneNumber}</div>
            
            </div>
            
            
            `
            
           
           
           
          const marker=  new google.maps.Marker({
              
        
                position: latlng,
                name:name,
               label:`${storeNumber }`,
                map:map,
          
                });
              
                
            //    document.getElementById('listbox').innerHTML=storehtml;
                marker.addListener("mouseover", () => {
                  infowindow.setContent(html)
                  infowindow.setPosition(latlng);
                  infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -32) });
                  infowindow.open(map);
                 
                 // document.getElementById("infowindow").addEventListener('click',getdirection(address))
                 // infowindow.addListener('click',getdirection(address));
                  google.maps.event.addListener(marker, 'click', getdirection(address))
                  
              
               
               
                }); 

               
               
                markers.push(marker)
             //   document.q(".address").addEventListener('click',getdirection(address))
          //  document.getElementById("infowindow").addEventListener('click',getdirection(address))

           }
           
         
       
  const setStoresList=(stores)=>{
    let listhtml=''
    stores.forEach((store,index) => {
      
      listhtml+=`
      
      <div class="store-container">
      <div class="store-container-background">
              <div class="store-info-container">
                  <div class="store-name">${store.storeName}</div>
                  <div class="store-address">${store.addressLines}</div>
                  <div class="store-contact">${store.phoneNumber}</div >

              </div>
              <div class="store-number-container">
                  <div class="store-number">${index+1}</div>
              </div>
      </div>
    
  </div>
      
      `

    
    });
    document.querySelector('.list').innerHTML=listhtml;

  }     
  
  
 const OnEnter=(e)=>{
   if(e.key=='Enter'){
        getStores()
   }
 }

        
const setOnClickListener=()=>{

    let storeElements=document.querySelectorAll('.store-container');

    storeElements.forEach((elem,index) => {

        elem.addEventListener('click',()=>{
          google.maps.event.trigger(markers[index],'mouseover')
        })

      
    });

}

const searchLocationNear =(stores)=>{

          let bounds=new google.maps.LatLngBounds();
          
          stores.forEach((store,index) => {
            

            let latlng=new google.maps.LatLng(
              store.location.coordinates[1],
              store.location.coordinates[0]

            )

            let name=store.storeName;
            let address=store.addressLines;
            let openStatus=store.openStatusText;
            let contactNumber=store.phoneNumber
            bounds.extend(latlng)
            let stringaddress=address.toString()
           // console.log(stringaddress)
            let tempaddress=stringaddress.replaceAll(" ","+")
            let urladdress=tempaddress.replaceAll(",","%2C")
            console.log(urladdress)


            createMarker(latlng,name,address,index+1,openStatus,contactNumber,urladdress)

          });
          map.fitBounds(bounds);

}







const clearLocation=()=>{

  for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
      }
      markers.length=0;
   infowindow.close();

}

const  noStoresFound=()=>{
 let notfoundhtml=`

    <div style=" display: flex;
    flex-direction: column;
    align-items: center;">
      <span style="font-size:25px;  ">no stores found</span>
    
    </div>
  `
  document.querySelector('.list').innerHTML=notfoundhtml;
}


      const getStores=()=>{
      
        let zipcode=document.getElementById('zip').value;
        console.log(zipcode)
        const API_URl=`http://localhost:5000/api/stores?zip_code=${zipcode}`;
        fetch(API_URl,{
          method:'GET'
        }).then((response)=>{
          if(response.status==200){
          return response.json()
          }
          else{
            throw new Error(response.status);
          }
        }).then((data)=>{
         // console.log(data)
         if(data.length>0){
          clearLocation();
          searchLocationNear(data)
          setStoresList(data)
 
          setOnClickListener()
         }
         else{
          clearLocation();
          noStoresFound();

         }
        
        
         
        })

      }





