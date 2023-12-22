/*const db = require("../routes/db-config.js");
const jwt = require("jsonwebtoken");*/
import {db} from '../routes/db-config.js';
import jwt from 'jsonwebtoken';

//ว่าจะมาทำcheck เพิ่มว่าถ้าไม่ใช่เจ้าของsccountให้มันrenderหน้าอื่น

export const userEdit = async (req, res, next) => {

      const userRegisteredCookie = req.cookies.userRegistered;
      const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);

      const { fname, lname, email, phone} = req.body;

      try {

            db.query('UPDATE User SET fname=?, lname=?, email=?, phone=? WHERE id=?', [fname, lname, email, phone, decodedToken.id], (err, result) => {
                  if (err) {
                        console.log("Can't Edit user inform");
                        console.log(err);
                  }else{
                        //console.log("from petprofile.js: " + req.params.petid + " name: " + result[0].petName);
                        console.log("Edit user inform success");
                        res.json({status: "success", success: "Edit Success"});
                  }
            })
      } catch (error) {
            console.log(error);
            
      }
}

//module.exports = userEdit;