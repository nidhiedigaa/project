const mongoose=require('mongoose')


mongoose.connect(process.env.DB_URL)
.then(()=>console.log('connected to the database'))
.catch((error)=>console.log('could not connect to the database'))



module.exports=mongoose