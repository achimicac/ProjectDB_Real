import dayjs from 'dayjs';
import {db} from '../routes/db-config.js';

export const petprofile = async (req, res, next) => {
      console.log("req.params" + req.params.petid);
      try {
          db.query("SELECT * FROM Pet WHERE petID = ?",
              [req.params.petid],
              (err, result) => {
                  function calculateYears(petDoB) {
                        return Math.floor((Date.now() - new Date(petDoB)) / (365.25 * 24 * 60 * 60 * 1000));
                    }
                    
                    function calculateMonths(petDoB) {
                        const day = Math.floor((Date.now() - new Date(petDoB)) / (24 * 60 * 60 * 1000))
                        return Math.floor((day%365.25)/30.44);
                    }
                    
                    function calculateWeeks(petDoB) {
                        const day = Math.floor((Date.now() - new Date(petDoB)) / (24 * 60 * 60 * 1000))
                        return Math.floor((day%365.25%30.44)/7);
                    }
                    
                    function calculateDays(petDoB) {
                        const day = Math.floor((Date.now() - new Date(petDoB)) / (24 * 60 * 60 * 1000))
                        return Math.floor(day%365.25%30.44%7);
                  }
                  if (err) {
                      console.log("Can't find this user");
                      // Handle the error appropriately
                      return res.status(404).send("User not found");
                  } else {
                      const binaryData = result[0].petPfp;
                      let petPfpUrl = `data:image/jpeg;base64,${binaryData.toString('base64')}`;
                      result[0].petPfpUrl = petPfpUrl;
                      result[0].days = calculateDays(result[0].petDoB)
                      result[0].weeks = calculateWeeks(result[0].petDoB)
                      result[0].months = calculateMonths(result[0].petDoB)
                      result[0].years = calculateYears(result[0].petDoB)
                      result[0].petBDShow = dayjs(result[0].petDoB, 'YYYY-MM-DD').format('YYYY-MM-DD');
                      res.petinfo = result; // Storing data in res.locals
                      console.log(res.petinfo);
                      return next();
                  }
              }
          );
      } catch (error) {
          console.error(error);
          return res.status(500).send("Something went wrong");
      }
  };
  // DATE_FORMAT(petDoB, '%d %M %Y') bd, FLOOR(TIMESTAMPDIFF(WEEK, petDoB, CURDATE()) / 52) AS years, FLOOR(MOD(TIMESTAMPDIFF(MONTH, petDoB, CURDATE()), 12)) AS months, FLOOR(MOD(TIMESTAMPDIFF(DAY, petDoB, CURDATE()), 30) / 7) AS weeks