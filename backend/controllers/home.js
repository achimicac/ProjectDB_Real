import { db } from '../routes/db-config.js';
import jwt from 'jsonwebtoken';

export const allPet = (req, res, next) => {
      const userRegisteredCookie = req.cookies.userRegistered;
      const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);
      //console.log(decodedToken.id)
      const pet = db.query("SELECT * FROM Pet WHERE id = ?",[decodedToken.id])
      for (let i = 0; i < pet.length; i++) {
            const appoint = db.query("SELECT * FROM Appointment Where petID = ?", [pet[i].petID])
            for (let k = 0; k < appoint.length; k++) {
                  db.query("SELECT * FROM Appointment WHERE appID = ? AND date > CURDATE() AND status = 'info'",[appoint[i].appID], (apperr, reapp)=>{
                        db.query("UPDATE FROM Appointment SET status = 'danger' WHERE appID = ?", [appoint[i].appID])
                  })
            }
      }
      db.query("SELECT *, TIMESTAMPDIFF(YEAR, petDoB, CURDATE()) AS years, FLOOR(TIMESTAMPDIFF(DAY, petDoB, CURDATE()) / 7 / 4) AS months, FLOOR(TIMESTAMPDIFF(DAY, petDoB, CURDATE()) / 7) AS weeks, TIMESTAMPDIFF(DAY, petDoB, CURDATE()) AS days FROM Pet WHERE id = ?", [decodedToken.id], (err, result) => {
            if (err) {
            console.log("Can't find this user");
            return res.status(404).send("Can't find this user");
            } else {
                  for (let i = 0; i < result.length; i++) {
                        //console.log(result[i]);
                        let petPfpUrl;
                        if (result[i].petPfp !== undefined) {
                            const binaryData = result[i].petPfp;
                            petPfpUrl = `data:image/jpeg;base64,${binaryData.toString('base64')}`;
                            // Assign the petPfpUrl to the result item directly
                            result[i].petPfpUrl = petPfpUrl;
                        }
                  }
            res.petData = result;
            //console.log(res.petData)
            return next();
            }
      })
}

//const bufferBase64 = Buffer.from(result[0].petPfp, 'binary').toString('base64');
//res.petPic = bufferBase64;
