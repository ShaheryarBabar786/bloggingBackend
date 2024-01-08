// const router = require('express').Router()

// const User = require('../models/user')
// const { auth, jwtSign } = require('../middleware/jwt')
// //const passwordHash=require('password-hash')

// //const bcrypt = require('bcrypt')
// const salt = 10

// //login
// router.post('/login', async (req, res) => {
//   try { 
//     let b = req.body
//     let data = await User.findOne({
//       email: b.email,
//       status: '1',
//     })
//     if (data && (await bcrypt.compare(b.password, data.password))) {
//       data.password = undefined
//       res.json({ status: 1, data, jwtToken: jwtSign(data) })
      
//     } else {
//       res.json({ status: 0, message: 'Email or password is not correct' })
//     }
//   } catch (err) {
//     res.json({ status: -1, message: err.message })
//   }
// })



// //user sign-in
// router.post('/create', async (req, res) => {
//   try {
//     let b = req.body
//     b.password = await bcrypt.hash(b.password, salt)
//     let data = await User.findOne({
//       $or: [{ email: b.email }],
     
//     })

//     if (data) res.json({ status: 0, message: 'Email already Exist' })
//     else {
      

//       data = await new User(req.body).save()

//       res.json({ status: 1, data, jwtToken: jwtSign(data) })
//     }
//   } catch (err) {
//     console.log(err)
//     res.json({ status: -1, message: err.message })
//   }
// })


// //get user (all)



// //get by id
// router.get('/getById/:id', async (req, res) => {
//   try {
//     const data = await User.findById(req.params.id)
//     res.json({ status: 1, data })
//   } catch (err) {
//     res.json({ status: -1, message: err.message })
//   }
// })


// //get all

// router.get("/getAll", async (req, res) => {
//   try {
//     const data = await User.find({ status: { $nin: "-1" } }).sort("-createdAt");
//     res.json({ status: 1, data })
//   } catch (err) {
//     res.json({ status: -1, message: "Something went wrong" });
//   }
// });

// //delete user
// router.post('/delete/:id', async (req, res) => {
//   try {
//    let data = await User.findByIdAndUpdate({ _id: req.params.id },{status:-1})
//     console.log(req.params.id)
//     res.json({ status: 1, data:data,message: 'success' })
//   } catch (err) {
//     res.json({ status: -1, message: err.message })
//   }
// })

// //update

// router.post('/update', async (req, res) => {
//   console.log(req.body)
//   try {
     
//       let info = req.body
//       console.log(info,'---------------------------------------');
//       const data = await User.findByIdAndUpdate(info.id, info, {new:true});
//       //updatedUser = await User.findById(id)
//       res.json({ status: 1,  data:data })
//   }
//   catch (e) {
//       res.json({ status: 0, message: e.message })
//     }
// }),


// router.post('/booked', async (req, res) => {
//   try {
//     const renterId = req.body.id;
//     const userId = req.body.userId;
//     const productId = req.body.productId;
//     console.log(req.body)
   
//     const data = await User.findByIdAndUpdate(
//       renterId,
//       { $push: { booked: req.body.booked } },
//       { new: true }
//     ).populate('renterId productId');;
   


//     res.json({ status: 1, data: data });
//   } catch (e) {
//     res.json({ status: 0, message: e.message });
//   }
// });


// router.post('/cancelbooked', async (req, res) => {
//   try {
//     const renterId = req.body.id;
//     const userId = req.body.userId;
//     const productId = req.body.productId;
//     console.log(req.body)
   
//     const data = await User.findByIdAndUpdate(
//       renterId,
//       { $pull: { booked: req.body.booked } },
//       { new: true }
//     );
   


//     res.json({ status: 1, data: data });
//   } catch (e) {
//     res.json({ status: 0, message: e.message });
//   }
// });




// module.exports =router;