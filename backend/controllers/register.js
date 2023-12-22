
const saltRounds = 10;
import {db} from '../routes/db-config.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
      const { username, pw, fname, lname, email, phone, pfp } = req.body;
      console.log(username, pw, fname, lname, email, phone, pfp)
      if(!username || !pw || !fname || !lname || !email || !phone) return res.json({
            status: "error",
            error: "Please enter all your information"
      })
      else {
            console.log(username + " mail: " + email);

            //const pw = bcrypt.hash(Npw, 8);
            //Check ว่าเคยลงไปยัง พวกstatus กับ error successเชื่อมอยู่กับหน้าregister.jsในpublicนะ
            db.query('SELECT * FROM User where username = ? OR email = ?', [username, email], async (err, result) => {
                  //console.log("from db: " + result[0].username + " " + result[0].email);
                  console.log("from db : " + result[0]);
                  if (err) throw err;
                  if (result[0]) {
                        if(result[0].username === username && result[0].email === email){
                              res.json({status: "error", error: "This username and email are already been in use"})
                        }else{
                              if (result[0].username === username) {
                                    res.json({status: "error", error: "This username has already been in use"});
                              }
                              else{
                                    res.json({status: "error", error: "This email has already been in use"});
                              }
                        }
                  }
                  else {
                        bcrypt.hash(pw, saltRounds, function (err, hash){
                              db.query('INSERT INTO User SET ?', {username: username, pw: hash, fname: fname, lname: lname, email: email, phone: phone}, (error, results) => {
                                    if (error) throw error;

                                    return res.json({status: "success", success: "User has been registered"});
                              })
                        })
                  }
            })
      }
}
//module.exports = register;
//return res.json({status: "error", error: "This username has already been in use"})