import {db} from '../routes/db-config.js';
import jwt from 'jsonwebtoken';

export const appoint = (req, res, next) => {
      const userRegisteredCookie = req.cookies.userRegistered;
      const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);
      
      try {
            
            db.query("UPDATE * FROM Pet INNER JOIN Appointment ON Pet.petID = Appoinment.petID INNER JOIN Procedural ON Appointment.procID = Procedural.procID where id = ?", [decodedToken.id], (err, result) => {
                  //console.log("from userprofile.js: " + req.params.id + " name: " + result[0].username);
                  res.allevent = result;
                  console.log(result)
                  return next();
            })
      } catch (error) {
            throw error;      
      }
}

export const updateApp = (req, res, next) => {
      const {date} = req.body;
      console.log("From updateApp: " + req.params.appid + " : " + date)
      try {
            const formattedDate = new Date(date).toISOString().substring(0, 10);
            console.log( formattedDate )
            db.query("UPDATE Appointment SET date = ? WHERE appID = ?", [formattedDate, req.params.appid], (errupapp, resupapp)=>{
                  if(errupapp){console.log(errupapp)}
                  res.json({status: 'success', success: 'Update success'})
            })
      } catch (error) {
            console.log(error)
      }
      
}