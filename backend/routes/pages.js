import express from "express";
import {loggedIn} from '../controllers/loggedIn.js';
import {logout} from '../controllers/logout.js';
import {userprofile} from '../controllers/userprofile.js';
import {allPet} from '../controllers/home.js';
import {petprofile} from '../controllers/petprofile.js';
import {petdelete} from '../controllers/petDelete.js';
import {petvaccine} from '../controllers/petvaccine.js';
import {calendar, selectmonth} from '../controllers/calendar.js';
import {article} from '../controllers/articles.js';
import {appoint} from '../controllers/app.js';
import { login } from "../controllers/login.js";
import { petregister } from "../controllers/petregister.js";
import { petEdit } from "../controllers/petedit.js";
import { register } from "../controllers/register.js";
import multer from 'multer';
import {db} from '../routes/db-config.js';
import jwt from 'jsonwebtoken';
import { userEdit } from "../controllers/useredit.js";
import {petrecord} from '../controllers/petrecord.js';
import {addrecord} from '../controllers/addrecord.js';
import {allprocedure} from '../controllers/addrecord.js';
import { updateApp } from "../controllers/app.js";
import pkg from 'body-parser';

export const router = express.Router();

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is 0
    let day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}


router.get("/petprofile/:petid/delete", petdelete,(req, res) => {
    res.redirect('/home');
})
  
/////////////////////////////////////////////////////////Edit with Frontend

var imgconfig = multer.diskStorage({
    destination:(req, file,callback)=>{
        callback(null,"client/uploads/");
    },
    filename:(req, file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
});

const isImage = (req,file,cb)=>{
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
      ) {
        cb(null, true);
        console.log(cb)
      }
      cb(null, false);
};
/*
var upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})*/
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

router.get('/', loggedIn, (req, res) => {
    return res.json({status: "success"})
});

router.post("/login", login);

router.post("/petregister", upload.single("petPfp"), petregister);

router.put('/userprofile/edit', userEdit);

router.get("/articles", article, (req, res, next) => {
    const data = res.all_article;
    console.log(data)
    return res.json(data);
})

router.get("/home", allPet, (req, res, next)=>{
    const data = res.petData;
    return res.json( data);
    
});

router.get("/records", appoint, (req, res, next) => {
    const data = req.event
    return res.json(data)
} )

router.get("/petprofile/:petid", petprofile, (req, res) => {
    let data = res.petinfo;
    return res.json(data);
})

router.get("/petprofile/:petid/vaccine", petvaccine, (req, res, next) => {
    const data = res.core_vac;
    return res.json(data);
})


/*const calendar = (req, res, next) => {
    const userRegisteredCookie = req.cookies.userRegistered;
    const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);
    //const {date} = req.body;
    db.query( 'SELECT * FROM Pet INNER JOIN Appointment ON Pet.petID = Appointment.petID WHERE id = ? AND date IS NOT NULL', [27], (error, results) => {
          res.all_event = results;
          return next()
          //console.log(res.all_event)
    })
}*/

router.get("/calendar", (req, res, next) => {
    const userRegisteredCookie = req.cookies.userRegistered;
    const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);
    const { selectedMonth } = req.body;

    try {
        db.query(
            "SELECT *, DATE_FORMAT(Appointment.date, '%d %M %Y') appdate  FROM Pet INNER JOIN Appointment ON Appointment.petID = Pet.petID INNER JOIN Procedural ON Procedural.procID = Appointment.procID INNER JOIN Vaccine ON Vaccine.vacID = Procedural.vacID WHERE MONTH(Appointment.date) = MONTH(CURRENT_DATE()) AND YEAR(CURRENT_DATE()) = YEAR(Appointment.date) AND id = ?",
            [decodedToken.id],
            (error, results) => {
                if (error) {
                    console.error("Error in query:", error);
                    return res.status(500).json({ error: "Database error" });
                }
                const data = results;
                res.json(data);

                console.log("From Calendar\n", results);
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});


router.put("/appointment/:appid", updateApp)

router.get("/userprofile", userprofile, (req, res) => {
    const data = res.userdata
    res.json(data);
})

router.post("/register", register, (req, res) => {
    res.redirect('/login')
})

router.put("/petprofile/:petid/edit", upload.single("petPfp"), petEdit)

router.put("/petprofile/:petid/delete", petdelete, (req, res)=>{
    res.redirect('/home');
})

router.get("/petprofile/:petid/record", petrecord, (req, res) => {
    let data = res.allrec;
    return res.json(data);
})

router.get("/petprofile/:petid/addrecord", allprocedure, (req, res) => {
    let data = res.allprocedure;
    return res.json(data);
})

router.post("/petprofile/:petid/addrecord", addrecord)

//router.post("/upload", selectmonth)

router.get("/calendar/:data", selectmonth, (req, res, next)=>{
    const data = res.event
    console.log(data)
    return res.json(data)
})

router.get("/logout", logout);

//module.exports = router;