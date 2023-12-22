/*const db = require("../routes/db-config.js");*/
import {db} from '../routes/db-config.js';

export const petdelete = async (req, res, next) => {
      try {
            db.query('DELETE FROM Pet WHERE petID=?', [req.params.petid], (err, result) => {
                  if (err) {
                        console.log("Can't Delete pet");
                        console.log(err);
                  }else{
                        
                        res.json({status: 'success', success: 'Already delete your pet'})
                        console.log("Delete pet success");
                        next();
                  }
            })
      } catch (error) {
            console.log(error);
            
      }
}

//module.exports = petedit;