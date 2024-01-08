const router = require('express').Router()
const User = require('../models/user')
const { auth, jwtSign } = require('../middleware/jwt')
const bcrypt = require('bcrypt');
const salt = 10;


const passwordHash = require('password-hash');


router.post('/login', async (req, res) => {
  try {
    let b = req.body;
    let data = await User.findOne({
      email: b.email,
    });

    if (data && await bcrypt.compare(b.password, data.password)) {

      res.json({ status: 1, data, jwtToken: jwtSign(data) });
    } else {

      res.json({ status: 0, message: 'Email or password is not correct' });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: -1, message: err.message });
  }
});


router.post('/user/create', async (req, res) => {
  try {
    let b = req.body
    b.password = await bcrypt.hash(b.password, salt)
    b.role = 'user';
    let data = await User.findOne({
      $or: [{ email: b.email }],
      role: 'user'
    });

    if (data) {
      res.json({ status: 0, message: 'Email already exists' });
    } else {
      data = await new User(req.body).save()
      res.json({ status: 1, data, jwtToken: jwtSign(data) });
    }
  } catch (err) {
    console.log(err)
    res.json({ status: -1, message: err.message });
  }
});



router.post('/admin/create', async (req, res) => {
  try {
    let b = req.body;
    b.password = await bcrypt.hash(b.password, salt);
    b.role = 'admin'; // Set the role to 'admin'

    let data = await User.findOne({
      $or: [{ email: b.email }],
      role: 'admin'
    });

    if (data) {
      res.json({ status: 0, message: 'Email already exists' });
    } else {
      data = await new User(b).save();
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

//get all user
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


// get user by id 
router.get("/user/getbyId/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ status: 0, message: "Invalid user ID" });
    }

    const user = await User.findOne({ _id: userId, status: { $nin: "-1" } });

    if (user) {
      user.role = 'user';
      return res.json({ status: 1, data: user });
    } else {
      return res.json({ status: 0, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ status: -1, message: "Something went wrong" });
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

router.post("/addElement", async (req, res) => {
  try {
    const updatedData = req.body;
    const userId = updatedData._id;

    const user = await User.findByIdAndUpdate(userId, { bio: updatedData.bio, address: updatedData.address, image: updatedData.image, phone: updatedData.phone }, { new: true });


    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }

    res.json({ status: 1, user });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
});

//search 

router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q; // Get the search term from query parameters
    const regex = new RegExp(searchTerm, 'i'); // Create a case-insensitive regex pattern

    const users = await User.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        // Include other fields you want to search
      ],
      status: { $ne: "-1" }
    }).sort("-createdAt");

    res.json({ status: 1, data: users });
  } catch (err) {
    res.status(500).json({ status: -1, message: "Something went wrong" });
  }
});







//update

// router.post('/user/update/:id', async (req, res) => {
//   const userId = req.params.id; // Get the user ID from the URL

//   console.log(req.body);

//   try {
//     const updatedData = req.body; // Data to update

//     // Assuming "role" is a field in the user document
//     if (updatedData.role) {
//       updatedData.role = 'user'; // Setting the role to 'user' if present in the request body
//     }

//     const data = await User.findByIdAndUpdate(userId, updatedData, { new: true });
//     // The { new: true } option returns the updated document

//     if (!data) {
//       // If the user with the specified ID doesn't exist
//       return res.status(404).json({ status: 0, message: 'User not found' });
//     }

//     res.json({ status: 1, data: data });
//   } catch (e) {
//     res.status(500).json({ status: 0, message: e.message });
//   }
// });

// //update admin
// router.post('/admin/update', async (req, res) => {
//   console.log(req.body);
//   try {
//     let info = req.body;
//     console.log(info, '---------------------------------------');

//     // Assuming "role" is a field in the user document
//     if (info.role) {
//       info.role = 'admin'; // Setting the role to 'admin' if present in the request body
//     }

//     const data = await User.findByIdAndUpdate(info.id, info, { new: true });
//     //updatedUser = await User.findById(id)
//     res.json({ status: 1, data: data });
//   } catch (e) {
//     res.json({ status: 0, message: e.message });
//   }
// });



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


module.exports = router;



