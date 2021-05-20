const express=require('express')
const axios=require('axios')
const mongoose =require('mongoose')
const app=express()
const Store=require('./api/models/store')
const GooogleMaps=require('./api/services/googleMapsServices')
const googlemaps=new GooogleMaps;

require('dotenv').config()




mongoose.connect('mongodb+srv://mathews_pwj:lvzHx2XBFOnYchQ2@cluster0.9tyvt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true

});

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    next();
})


app.use(express.json({limit: '50mb'}));


app.get('/api/stores',(req,res)=>{
    const zipcode=req.query.zip_code
    const googleapiurl='https://maps.googleapis.com/maps/api/geocode/json'
    let zipcoordinates=[]
 
    googlemaps.getCoordinates(zipcode).then((coordinates)=>{


        Store.find({          //to get the stores near to the zipcode
            location:{
                $near:{
                    $maxDistance: 19343,
                    $geometry:{
                        type:"Point",
                        coordinates: coordinates
                    }
                }
            }
        },(err,stores)=>{
            if(err){
                res.status(500).send(err)
            }
            else{
                res.status(200).send(stores)
            }
        })

    })
        
       
    })

  
  
 


app.post('/api/stores',(req,res)=>{

   let dbStores=[]

   let stores=req.body;
  // console.log(stores)

   stores.forEach((store) => {

    dbStores.push({
        storeName:store.name,
        phoneNumber:store.phoneNumber,
        address:store.address,
        openStatusText:store.openStatusText,
        addressLines:store.addressLines,
        location:{
            type:'Point',
            coordinates:[
                store.coordinates.longitude,
                store.coordinates.latitude
            ]

        }
    })
       
   });

   Store.create(dbStores,(err,stores)=>{
       if(err){
           res.status(500).send(err)
       }
       else{
       res.status(200).send(stores)
       }
   })



    //console.log(req.body)

    
});

app.delete('/api/stores',(req,res)=>{

   Store.deleteMany({},(err)=>{
       res.status(200).send(err);
   })
    
})

app.listen(5000, ()=>console.log("listening on http://localhost:5000"))