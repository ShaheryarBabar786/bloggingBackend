const router = require('express').Router()

const User = require('../models/user')
const {auth, jwtSign } = require('../middleware/jwt')
const bcrypt = require('bcrypt');

const passwordHash=require('password-hash')
const salt = 10;



//login
router.post('/login', async (req, res) => {
  try {
    const b = req.body;
    const data = await User.findOne({
      email: b.email,
      status: '1',
      
    });
    console.log(data)
    if (!data) {
      return res.json({ status: 0, message: 'Email not found or user status is not active' });
    }

    if (!data.password) {
      return res.json({ status: 0, message: 'Password is missing for this user' });
    }

    const passwordMatch = await bcrypt.compare(b.password, data.password);

    if (passwordMatch) {
      data.password = undefined;
      return res.json({ status: 1, data, jwtToken: jwtSign(data) });
    } else {
      return res.json({ status: 0, message: 'Email or password is not correct' });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ status: -1, message: 'An error occurred during login' });
  }
});




//user sign-in

router.post('/user/create', async (req, res) => {
  try {
    let b = req.body
    b.password = await bcrypt.hash(b.password, salt)
    b.role = 'user';
    let data = await User.findOne({
      $or: [{ email: b.email }],
      role: 'user'
     
    })

    if (data) res.json({ status: 0, message: 'Email already Exist' })
    else {
      

      data = await new User(req.body).save()

      res.json({ status: 1, data, jwtToken: jwtSign(data) })
    }
  } catch (err) {
    console.log(err)
    res.json({ status: -1, message: err.message })
  }
})



//admin sign-in
router.post('/admin/create', async (req, res) => {
  try {
    let b = req.body;
    b.password = await (b.password); // Assuming you have a function to hash passwords
    b.role = 'admin'; // Set the role to 'admin'

    let data = await User.findOne({
      $or: [{ email: b.email }],
      role: 'admin'
    });

    if (data) {
      res.json({ status: 0, message: 'Email already Exist' });
    } else {
      data = await new User(b).save(); // Use the modified req.body here

      res.json({ status: 1, data, jwtToken: jwtSign(data) });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: -1, message: err.message });
  }
});

//get by id
router.get('/user/getById/:id', async (req, res) => {
  try {
    const data = await User.findById(req.params.id)
    // Assuming "role" is a field in the user document
    if (data) {
      data.role = 'user'; // Adding the "role" field with the value "admin"
    }
    res.json({ status: 1, data })
  } catch (err) {
    res.json({ status: -1, message: err.message })
  }
})
//get admin by id
router.get('/admin/getById/:id', async (req, res) => {
  try {
    const data = await User.findById(req.params.id)
    // Assuming "role" is a field in the user document
    if (data) {
      data.role = 'admin'; // Adding the "role" field with the value "admin"
    }
    res.json({ status: 1, data })
  } catch (err) {
    res.json({ status: -1, message: err.message })
  }
})

//get all

router.get("/user/getAll", async (req, res) => {
  try {
    const data = await User.find({ status: { $nin: "-1" } }).sort("-createdAt");
    
    // Assuming "role" is a field in the user document
    data.forEach(user => {
      user.role = 'user';
    });
    
    res.json({ status: 1, data });
  } catch (err) {
    res.json({ status: -1, message: "Something went wrong" });
  }
});

//get all admins
router.get("/admin/getAll", async (req, res) => {
  try {
    const data = await User.find({ status: { $nin: "-1" } }).sort("-createdAt");
    
    // Assuming "role" is a field in the user document
    data.forEach(user => {
      user.role = 'admin';
    });
    
    res.json({ status: 1, data });
  } catch (err) {
    res.json({ status: -1, message: "Something went wrong" });
  }
});


//delete user id
router.post('/user/delete/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { status: -1 },
      { new: true } // This option returns the updated user document
    );
    
    // Assuming "role" is a field in the user document
    if (updatedUser) {
      updatedUser.role = 'user';
    }
    
    res.json({ status: 1, data: updatedUser, message: 'success' });
  } catch (err) {
    res.json({ status: -1, message: err.message });
  }
});

//delete admin by id
router.post('/admin/delete/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { status: -1 },
      { new: true } // This option returns the updated user document
    );
    
    // Assuming "role" is a field in the user document
    if (updatedUser) {
      updatedUser.role = 'admin';
    }
    
    res.json({ status: 1, data: updatedUser, message: 'success' });
  } catch (err) {
    res.json({ status: -1, message: err.message });
  }
});


//update

router.post('/user/update', async (req, res) => {
  console.log(req.body);
  try {
    let info = req.body;
    console.log(info, '---------------------------------------');
    
    // Assuming "role" is a field in the user document
    if (info.role) {
      info.role = 'user'; // Setting the role to 'admin' if present in the request body
    }
    
    const data = await User.findByIdAndUpdate(info.id, info, { new: true });
    //updatedUser = await User.findById(id)
    res.json({ status: 1, data: data });
  } catch (e) {
    res.json({ status: 0, message: e.message });
  }
});

//update admin
router.post('/admin/update', async (req, res) => {
  console.log(req.body);
  try {
    let info = req.body;
    console.log(info, '---------------------------------------');
    
    // Assuming "role" is a field in the user document
    if (info.role) {
      info.role = 'admin'; // Setting the role to 'admin' if present in the request body
    }
    
    const data = await User.findByIdAndUpdate(info.id, info, { new: true });
    //updatedUser = await User.findById(id)
    res.json({ status: 1, data: data });
  } catch (e) {
    res.json({ status: 0, message: e.message });
  }
});



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


 module.exports =router;