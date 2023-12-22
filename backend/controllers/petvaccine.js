/*const db = require("../routes/db-config.js");
const jwt = require("jsonwebtoken");*/
import {db} from '../routes/db-config.js';
import jwt from 'jsonwebtoken';

//ว่าจะมาทำcheck เพิ่มว่าถ้าไม่ใช่เจ้าของsccountให้มันrenderหน้าอื่น

export const petvaccine = async (req, res, next) => {
      try {
            db.query("SELECT *, DATE_FORMAT(Appointment.date, '%d %M %Y') appdate FROM Pet INNER JOIN Appointment ON Pet.petID = Appointment.petID INNER JOIN Procedural ON Procedural.procID = Appointment.procID INNER JOIN Vaccine ON Vaccine.vacID = Procedural.vacID WHERE Pet.petID = ? AND Procedural.procName = ?",
                  [req.params.petid, "core vaccination"], (err, result) => {
                        res.core_vac = result;
                        next();
                  }
            )
      } catch (error) {
            throw error;
            
      }
}

//module.exports = petvaccine;