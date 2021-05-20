
const googleapiurl='https://maps.googleapis.com/maps/api/geocode/json'
const axios=require('axios')



class GooogleMaps{

  

    async getCoordinates(zipcode){
let coordinates=[]
      await axios.get(googleapiurl,{
            params:{
                address: zipcode,
                key:` ${process.env.GOOGLE_MAPS_API_KEY}`
            }
    
        }).then((response)=>{
          //  console.log(response.data);
            const data =response.data;
            coordinates=[
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat,


    
    
            ]
            
           
        }).catch((error)=>{ 
            throw new Error(error);
        });
        return coordinates;
        
       
    }
}

module.exports=GooogleMaps;