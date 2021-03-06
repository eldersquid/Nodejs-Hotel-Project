const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const alertMessage = require('../helpers/messenger.js');
const foodPic = require('../helpers/foodPicture.js');
const Contact = require('../models/Contact');
const Response = require('../models/Response');
const FoodCart = require('../models/FoodCart');
const multer = require('multer');
const path = require('path');
// Required for file upload
// const fs = require('fs');
// const upload = require('../helpers/imageUpload');

const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const FoodGallery = require('../models/FoodGallery');
const { body, validationResult } = require('express-validator');



const CLIENT_ID = '188467906173-a5cq8hviitnaanin3cmag7el6kkqrcru.apps.googleusercontent.com'
const CLIENT_SECRET = 'uJwKO7Pc693-lYfqgWNbIVNB'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04Tt7yjfGWpdQCgYIARAAGAQSNwF-L9Ir_wKE_gHmQitcazwILvpG0TVhGDTssYZSZUOjozi05MfSKJrBjCcw4VE32AgEiL3cfcs';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(toEmail, toSubject, toMessage) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'hotel.la.bodo@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: "Hotel La Bodo <hotel.la.bodo@gmail.com>",
            to: toEmail,
            subject: "RE:" + toSubject,
            text: toMessage,
        };

        const result = await transport.sendMail(mailOptions);
        return result;

    } catch (error) {

        return error
    }
};

// View Reservation
router.get('/viewReservation', (req, res) => {
    const title = 'Reservation';
    Reservation.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((reservation) => {
            console.log(reservation);
            res.render('admRestaurant/viewReservation', {
                layout: "admin",
                title: title,
                reservation: reservation
            });
        })
        .catch(err => console.log(err));
});

// Update Reservation
router.get('/updateReservation/:id', (req, res) => {
    const title = 'updateReservation';
    console.log(req.params.id)
    Reservation.findOne({
        where: {
            id: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((reservation) => {
            console.log(reservation);
            res.render('admRestaurant/updateReservation', {
                layout: "admin",
                title: title,
                reservation: reservation
            });
        }).catch(err => console.log(err));
});


router.post('/updateReservation/:id', (req, res) => {
    let cust_fname = req.body.cust_fname;
    let cust_lname = req.body.cust_lname;
    let cust_email = req.body.cust_email;
    let cust_phone = req.body.cust_phone;
    let number_guest = req.body.number_guest;
    let cust_date = req.body.cust_date;
    let cust_time = req.body.cust_time;
    let cust_message = req.body.cust_message;

    Reservation.update({
        cust_fname,
        cust_lname,
        cust_email,
        cust_phone,
        number_guest,
        cust_date,
        cust_time,
        cust_message
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/admRestaurant/viewReservation'); // redirect to call router.get(/listSupplier...) to retrieve all updated
        // reservation
    }).catch(err => console.log(err));
});
// router.post('/updateReservation/:id', [
//     body('cust_fname').not().isEmpty().isAlpha().trim().escape().withMessage("First name is Invalid"),
//     body('cust_lname').not().isEmpty().isAlpha().trim().escape().withMessage("Last name is Invalid"),
//     body('cust_email').trim().isEmail().withMessage("Invalid Email").normalizeEmail().toLowerCase(),
//     body('cust_message').not().isEmpty().trim().escape().withMessage("Invalid Message"),
//     body('cust_date').not().isEmpty().trim().escape().withMessage("Require Date Field"),
//     body('cust_time').not().isEmpty().trim().escape().withMessage("Require Time Field"),
//     // body('cust_phone').custom(value => {
//     //     if (value > 9){
//     //         throw new Error("Invalid phone number!");
//     //     }
//     //     return true;
//     // }),
//     body('number_guest').custom(value => {
//         if (value > 5) {
//             throw new Error("Cannot Exceed 5 memebers!");
//         }
//         return true;
//     }),
// ], (req, res) => {
//     console.log("retrieving Updated reservation")
//     let errors = [];
//     let cust_fname = req.body.cust_fname;
//     let cust_lname = req.body.cust_lname;
//     let cust_email = req.body.cust_email;
//     // let cust_phone = req.body.cust_phone;
//     let number_guest = req.body.number_guest;
//     let cust_date = req.body.cust_date;
//     let cust_time = req.body.cust_time;
//     let cust_message = req.body.cust_message;

//     const validatorErrors = validationResult(req);

//     if (!validatorErrors.isEmpty()) {
//         console.log("Errors updating reservation")
//         validatorErrors.array().forEach(error => {
//             console.log(error);
//             errors.push({ text: error.msg })
//         });
//         res.render('admRestaurant/updateReservation', {
//             layout: "admin",
//             errors,
//             cust_fname,
//             cust_lname,
//             cust_email,
//             // cust_phone,
//             number_guest,
//             cust_date,
//             cust_time,
//             cust_message
//         });
//     } else {
//         console.log("Updating reservation")
//         Reservation.update({
//             cust_fname,
//             cust_lname,
//             cust_email,
//             // cust_phone,
//             number_guest,
//             cust_date,
//             cust_time,
//             cust_message
//         }, {
//             where: {
//                 id: req.params.id
//             }
//         }).then(() => {
//             res.redirect('/admRestaurant/viewReservation'); // redirect to call router.get(/listSupplier...) to retrieve all updated
//             // reservation
//         }).catch(err => console.log(err));
//     }
// });

// Delete Reservation
router.get('/deleteReservation/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Reservation.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((reservation) => {
        // if record is found, user is owner of video
        if (reservation != null) {
            reservation.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewReservation'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});

// view Contact Us
router.get('/viewContact', (req, res) => {
    const title = 'Contact';
    Contact.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((contact) => {
            console.log(contact);
            res.render('admRestaurant/viewContact', {
                layout: "admin",
                title: title,
                contact: contact
            });
        })
        .catch(err => console.log(err));
})

// Delete Contact Us
router.get('/deleteContact/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Contact.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((contact) => {
        // if record is found, user is owner of video
        if (contact != null) {
            contact.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewContact'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});

// Create Response
router.get('/createResponse/:id', (req, res) => {
    const title = 'contact';
    console.log(req.params.id)
    Contact.findOne({
        where: {
            id: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    }).then((contact) => {
        console.log(contact);
        res.render('admRestaurant/createResponse', {
            layout: "admin",
            title: title,
            contact: contact
        });
    }).catch(err => console.log(err));
})

router.post('/createResponse', (req, res) => {
    let toEmail = req.body.toEmail
    let toSubject = req.body.toSubject
    let toMessage = req.body.toMessage

    Response.create({
        toEmail,
        toSubject,
        toMessage
    }).then((response) => {
        sendMail(toEmail, toSubject, toMessage).then(result => console.log('Email sent...', result))
            .catch(error => console.log(error.message));
        alertMessage(res, 'success', ' Response has been sent successfully.', 'fas fa-sign-in-alt', true);
        res.redirect('/admRestaurant/viewResponse');
    }).catch(err => console.log(err))

});

// view Response
router.get('/viewResponse', (req, res) => {
    const title = 'Response';
    Response.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((response) => {
            console.log(response);
            res.render('admRestaurant/viewResponse', {
                layout: "admin",
                title: title,
                response: response
            });
        })
        .catch(err => console.log(err));
})

// Delete Response
router.get('/deleteResponse/:id', (req, res) => {
    let id = req.params.id;
    // Select * from videos where videos.id=videoID and videos.userId=userID
    Response.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((response) => {
        // if record is found, user is owner of video
        if (response != null) {
            response.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewResponse'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});

// Create Picture
router.post('/Foodupload', (req, res) => {
    let createPic = req.body.trueFilePicture;
    console.log("THis is foodpic data", createPic);
    const title = "Upload Food Pictures";
    FoodGallery.create({
        foodPhoto: createPic
    })
        .then((foodgallery) => {
            res.redirect('/admRestaurant/viewFoodGallery');
        }).catch(err => console.log(err));
});

// Upload picture inside the folder
router.post('/foodPic', (req, res) => {
    foodPic(req, res, async (err) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (req.file === undefined) {
                console.log("The file is undefine.");
                res.json({ err: err });
            } else {
                res.json({ file: `${req.file.filename}`, path: '/foodPictures/' + `${req.file.filename}` });
                // res.json({file: `/foodPictures/${req.file.filename}`});
            }
        }
    });
});

// View Uploaded Images 
router.get('/viewFoodGallery', (req, res) => {
    const title = 'FoodGallery';
    FoodGallery.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((foodgallery) => {
            res.render('admRestaurant/viewFoodGallery', {
                layout: "admin",
                title: title,
                foodgallery: foodgallery
            });
        })
        .catch(err => console.log(err));
});

router.get('/UpdateFoodPic/:id', (req,res) => {
    const title = 'updatePicture';
    console.log(req.params.id)
    FoodGallery.findOne({
        where: {
            id: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((foodgallery) => {
            console.log(foodgallery);
            res.render('admRestaurant/viewFoodGallery', {
                layout: "admin",
                title: title,
                foodgallery:foodgallery
            });
        }).catch(err => console.log(err));
});

// Update Picture
router.post('/UpdateFoodPic/:id', (req, res) => {
    let foodpic_data = req.body.trueFilePicture2;
    console.log("THis is Update foodpic data", foodpic_data);
    FoodGallery.update({
        foodPhoto: foodpic_data
    }, {
        where: {
            id: req.params.id
        }
    }).then((foodgallery) => {
        res.redirect('/admRestaurant/viewFoodGallery');
    }).catch(err => console.log(err));
});

// Delete Picture
router.get('/deleteFoodGallery/:id', (req, res) => {
    let id = req.params.id;
    FoodGallery.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((foodgallery) => {
        // if record is found, user is owner of video
        if (foodgallery != null) {
            foodgallery.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewFoodGallery'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/' + '/');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});



// MENU

// // Upload Picture
// router.post('/createMenu', (req, res) => {
// 	let cardPhoto_data = req.body.trueMenuPicture;
//     let cardName = req.body.cardName
//     let cardPrice = req.body.cardPrice
// 	const title = "Upload Food Menu";
//     FoodCart.create({
//         cardName,
//         cardPrice,
//         cardPhoto : cardPhoto_data

//     }).then((foodcart) => {
//             res.redirect('/admRestaurant/viewFoodCart');
//         }).catch(err => console.log(err));


// });

router.get('/createMenu', (req, res) => {
    const title = 'FoodCart';
    res.render('admRestaurant/createMenu', {
        layout: "admin",
        title: title
    })
});

// Create Menu
router.post('/createMenu', (req, res) => {
    let errors = [];
    let cardPhoto_data = req.body.trueMenuPicture;
    let cardName = req.body.cardName;
    let cardPrice = req.body.cardPrice;
    console.log("THis photo data", cardPhoto_data)

    FoodCart.findOne({
        where: {
            cardName: cardName
        }
    }).then((foodcart) => {
        console.log(foodcart);

        if (foodcart) {
            alertMessage(res, 'danger', 'Item already Existed. ', 'fas fa-sign-in-alt', true);
            errors.push(1);
        }
        if (errors.length > 0) {
            console.log("It went hereee")
            res.render('admRestaurant/createMenu', {
                layout: "admin",
            });
        } else if (errors.length == 0) {
            FoodCart.create({
                cardPhoto: cardPhoto_data,
                cardName: cardName,
                cardPrice: cardPrice
            }).then((foodcart) => {
                alertMessage(res, 'success', ' ' + req.body.cardName + ' with the price of' + ' ' + '$' + req.body.cardPrice + ' ' + 'is added.', 'fas fa-sign-in-alt', true)
                res.redirect('/admRestaurant/viewFoodCart');
            }).catch(err => console.log(err))
        }
    });
})

// router.post('/createMenu', [
//     body('cardPrice').not().isEmpty().trim().escape().isInt().withMessage("Invalid Price."),
//     body('cardName').custom(value => {
//         var value = cardName;
//         if (foodcart == value) {
//             // throw new Error('Item already existed.');
//             alertMessage(res, 'danger', 'Item already Existed. ', 'fas fa-sign-in-alt', true);
//         }
//         return true;
//     })
// ], (req, res) => {
//     console.log("retrieving Menu")
//     let errors = [];
//     let cardPhoto_data = req.body.trueMenuPicture;
//     let cardName = req.body.cardName;
//     let cardPrice = req.body.cardPrice;
//     const validatorErrors = validationResult(req);
//     console.log("THis photo data", cardPhoto_data)

//     if (!validatorErrors.isEmpty()) {
//         console.log("Errors creating reservation")
//         validatorErrors.array().forEach(error => {
//             console.log(error);
//             errors.push({ text: error.msg })
//         });
//         res.render('admRestaurant/createMenu', {
//             layout: "admin",
//             errors,
//             cardName,
//             cardPhoto,
//             cardPrice
//         });
//     } else {
//         console.log("creating Menu")
//         FoodCart.findOne({
//             where: {
//                 // id: req.params.id
//             }
//         }).then((foodcart) => {
//             FoodCart.create({
//                 cardPhoto: cardPhoto_data,
//                 cardName: cardName,
//                 cardPrice: cardPrice
//             }).then((foodcart) => {
//                 alertMessage(res, 'success', ' ' + req.body.cardName + ' with the price of' + ' ' + '$' + req.body.cardPrice + ' ' + 'is added.', 'fas fa-sign-in-alt', true)
//                 res.redirect('/admRestaurant/viewFoodCart');
//             }).catch(err => console.log(err))
//         })
//     }
// });


// Update Menu
router.get("/updateMenu/:id", (req, res) => {
    const title = "Update Menu";
    FoodCart.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    }).then((foodcart) => {
        res.render("admRestaurant/updateMenu", {
            layout: "admin",
            foodcart: foodcart,
            title: title
        });
    }).catch((err) => console.log(err)); // To catch no video ID
});

router.put('/updatedMenu/:id', (req, res) => {
    let cardPhoto = req.body.trueMenuPicture2;
    let cardName = req.body.cardName
    let cardPrice = req.body.cardPrice
    console.log("THIS IS CARD PHOTO :")
    console.log(cardPhoto);

    FoodCart.update({
        cardPhoto: cardPhoto,
        cardName: cardName,
        cardPrice: cardPrice
    }, {
        where: {
            id: req.params.id
        }
    }).then((foodcart) => {
        alertMessage(res, 'success', ' ' + req.body.cardName + ' has been updated. ' , 'fas fa-sign-in-alt', true)
        res.redirect('/admRestaurant/viewFoodCart');
    }).catch(err => console.log(err));
});

// router.put('/updatedMenu/:id', [
//     body('cardName').not().isEmpty().isAlpha().trim().escape().withMessage("Name is Invalid"),
// ],(req, res) => {
//     let errors = [];
//     let cardPhoto = req.body.trueMenuPicture2;
//     let cardName = req.body.cardName
//     let cardPrice = req.body.cardPrice
//     console.log("THIS IS CARD PHOTO :")
//     console.log(cardPhoto);
//     const validatorErrors = validationResult(req);
//     if (!validatorErrors.isEmpty()) {
//         console.log("Errors creating contact")
//         validatorErrors.array().forEach(error => {
//             console.log(error);
//             errors.push({ text: error.msg})
//         });
//         res.render('admRestaurant/updateMenu', {
//             layout:"admin",
//             errors,
//             cardPhoto,
//             cardName,
//             cardPrice
//         });
//     } else {
//         console.log("updating menu")
//     }FoodCart.update({
//         cardPhoto: cardPhoto,
//         cardName: cardName,
//         cardPrice: cardPrice
//     }, {
//         where: {
//             id: req.params.id
//         }
//     }).then((foodcart) => {
//         alertMessage(res, 'success', ' Menu has been updated.', 'fas fa-sign-in-alt', true);
//         res.redirect('/admRestaurant/viewFoodCart');
//     }).catch(err => console.log(err));
// });

// router.put('/updatedMenu/:id', (req, res) => {
//     let errors = [];
//     let cardPhoto = req.body.trueMenuPicture2;
//     let cardName = req.body.cardName
//     let cardPrice = req.body.cardPrice
//     console.log("THIS IS CARD PHOTO :")
//     console.log(cardPhoto);

//     FoodCart.findOne({
//         where: {
//             cardName:cardName
//         },
//         raw: true
//     }).then((foodcart) => {
//         console.log(foodcart);

//         if (foodcart) {
//             alertMessage(res, 'danger', 'Item already Existed. ', 'fas fa-sign-in-alt', true);
//             errors.push(1);
//         }
//         if (errors.length > 0) {
//             console.log("It went hereee")
//             res.render('admRestaurant/updateMenu', {
//                 layout: 'admin',
//             });
//         } else if (errors.length == 0) {
//             FoodCart.update({
//                 cardPhoto: cardPhoto,
//                 cardName: cardName,
//                 cardPrice: cardPrice
//             }, {
//                 where: {
//                     id: req.params.id
//                 }
//             }).then((foodcart) => {
//                 alertMessage(res, 'success', ' Menu has been updated.', 'fas fa-sign-in-alt', true);
//                 res.redirect('/admRestaurant/viewFoodCart');
//             }).catch(err => console.log(err));
//         }
//     })
// });



// Upload Menu pictures inside the folder
router.post('/menuPic', (req, res) => {
    foodPic(req, res, async (err) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (req.file === undefined) {
                console.log("The file is undefine.");
                res.json({ err: err });
            } else {
                res.json({ file: `${req.file.filename}`, path: '/menuPictures/' + `${req.file.filename}` });
                // res.json({file: `/foodPictures/${req.file.filename}`});
            }
        }
    });
});

// View Uploaded Images for Menu
router.get('/viewFoodCart', (req, res) => {
    const title = 'FoodCart';
    FoodCart.findAll({
        where: {
            // adminId: req.params.id
        },
        order: [
            // [reservation.id, 'ASC']
        ],
        raw: true
    })
        .then((foodcart) => {
            res.render('admRestaurant/viewFoodCart', {
                layout: "admin",
                title: title,
                foodcart: foodcart
            });
        })
        .catch(err => console.log(err));
});

// Delete Menu Items
router.get('/deleteFoodCart/:id', (req, res) => {
    let id = req.params.id;
    Foodcart.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((foodcart) => {
        // if record is found, user is owner of video
        if (foodcart != null) {
            foodcart.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewFoodCart'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});

// Delete Picture
router.get('/deleteMenu/:id', (req, res) => {
    let id = req.params.id;
    FoodCart.findOne({
        where: {
            id: id,
        },
        attributes: ['id']
    }).then((foodcart) => {
        // if record is found, user is owner of video
        if (foodcart != null) {
            foodcart.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admRestaurant/viewFoodCart'); // To retrieve all videos again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Test Error', 'fas fa-exclamation-circle', true);

        }
    });
});
module.exports = router;