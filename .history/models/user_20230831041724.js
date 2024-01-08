const mongoose = require('mongoose');
const express=require('express');

const schema = new mongoose.Schema(
  {
      name:{type:String,required:true},
      // username:{type:String},
      // fname:{type:String},
      // lname:{type:String},
      email:{type:String,required:true},
      password:{type:String,required:true},
      role:{type:String,enum:['user','admin'],default:'user'}
      // phone:{type:Number},
      // status:{type:String,default:'1'},
      // gender:{type:String,enum: ["male", "female","other"]},
      // description:{type:String},
      // city:{type:String},
      // country:{type:String},
        
      // postalcode:{type:String},
      // address:{type:String},
       
      // image:{type:String},
      // type: { type: String, enum: ['image', 'video'] },
      // booked: [{
      //   renterId:{type:mongoose.Schema.Types.ObjectId,ref:'renter'},
      //   productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
      // }]
    
    
    
 
  },
  { timestamps: true},
    
  
    
)
const user=mongoose.model('user', schema);
module.exports = user;