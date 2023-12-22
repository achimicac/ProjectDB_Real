import {db} from '../routes/db-config.js';
import jwt from 'jsonwebtoken';

export const calendar = async (req, res, next) => {
      const userRegisteredCookie = req.cookies.userRegistered;
      const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);
      
      try{db.query("SELECT *, DATE_FORMAT(Appointment.date, '%d %M %Y') appdate  FROM Pet INNER JOIN Appointment ON Appointment.petID = Pet.petID INNER JOIN Procedural ON Procedural.procID = Appointment.procID INNER JOIN Vaccine ON Vaccine.vacID = Procedural.vacID WHERE MONTH(Appointment.date) = MONTH(CURRENT_DATE()) AND YEAR(CURRENT_DATE()) = YEAR(Appointment.date) AND id = ?", [decodedToken.id], (error, results) => {
            if (error) {
                console.error("Error in query:", error);
                return res.status(500).json({ error: "Database error" });
            }
            res.all_event = results;
            console.log("From Calendar\n", results);
            return next();
        });} catch {console.error();}
}
//module.exports = calendar;
//return res.json({status: "error", error: "This username has already been in use"})
//'SELECT * FROM Pet INNER JOIN Appointment ON Pet.petID = Appointment.petID WHERE id = ? AND date LIKE *2023-12-13*'

export const selectmonth = async (req, res, next) => {
    const userRegisteredCookie = req.cookies.userRegistered;
    const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);
    const selectedMonth = req.params.data
    console.log(selectedMonth)
    

    /*db.query("SELECT *, DATE_FORMAT(Appointment.date, '%d %M %Y') AS appdate FROM Pet INNER JOIN Appointment ON Appointment.petID = Pet.petID INNER JOIN Procedural ON Procedural.procID = Appointment.procID INNER JOIN Vaccine ON Vaccine.vacID = Procedural.vacID WHERE MONTH(Appointment.date) = ? AND YEAR(Appointment.date) = ? AND id = ?", [semonth, seyear, decodedToken.id], (error, results) => {
        if (error) {
            console.error("Error in query:", error);
            return res.status(500).json({ error: "Database error" });
        }
        res.event = results;
        console.log("From selectmonth\n", results);
        return next();
    });*/
    
    console.log(selectedMonth.concat('%'))
    db.query(
        "SELECT Pet.petName, Procedural.procName, Vaccine.vacName, Appointment.appID, Procedural.procID, Pet.petName, Appointment.date, Pet.petID, Pet.id, DATE_FORMAT(Appointment.date, '%d %M %Y') AS appdate FROM Pet RIGHT JOIN Appointment ON Appointment.petID = Pet.petID LEFT JOIN Procedural ON Procedural.procID = Appointment.procID LEFT JOIN Vaccine ON Vaccine.vacID = Procedural.vacID WHERE id = ? AND date LIKE ?",
        [decodedToken.id, selectedMonth.concat('%')],
        (errca, recar) => {
          if (errca) {
            console.log(errca);
            return res.status(500).json({ error: 'An error occurred' });
          }
      
          console.log('Data retrieved from the database:', recar);
      
          // Assuming `res` is an Express response object
          res.event = recar[0]; // Store the retrieved data in `res.event`
          next() // Sending a success response with the retrieved data
        }
      );      
      


}