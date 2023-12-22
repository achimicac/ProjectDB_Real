import { db } from '../routes/db-config.js';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { promisify } from 'util';

export const petregister = async (req, res) => {
    try {
        const userRegisteredCookie = req.cookies.userRegistered;
        const decodedToken = jwt.decode(userRegisteredCookie, process.env.JWT_SECRET);

        const { petName, petType, petDoB, petGender, petPfp } = req.body;
        const binaryData = Buffer.from(petPfp.dataUrl.split(',')[1], 'base64');

        if (!petName || !petType || !petDoB || !binaryData || !petGender) {
            return res.json({
                status: "error",
                error: "Please enter all your pet information"
            });
        }

        const queryAsync = promisify(db.query).bind(db);

        const petQueryResult = await queryAsync('SELECT * FROM Pet WHERE id = ? and petName = ?', [decodedToken.id, petName]);

        if (petQueryResult && petQueryResult.length > 0) {
            return res.json({ status: "error", error: `${petName} has already been registered.` });
        } else {
            const petInsertResult = await queryAsync('INSERT INTO Pet SET ?', {
                petName: petName,
                petType: petType,
                petDoB: petDoB,
                petPfp: binaryData,
                petGender: petGender,
                id: decodedToken.id
            });

            res.json({ status: "success", success: "Your pet is ready!" });

            const petDetailsQueryResult = await queryAsync('SELECT * FROM Pet where id = ? and petName = ?', [decodedToken.id, petName]);
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

            petDetailsQueryResult[0].weeks = calculateWeeks(petDetailsQueryResult[0].petDoB)
            petDetailsQueryResult[0].months = calculateMonths(petDetailsQueryResult[0].petDoB)
            petDetailsQueryResult[0].years = calculateYears(petDetailsQueryResult[0].petDoB)

            if (petDetailsQueryResult && petDetailsQueryResult.length > 0) {
                const procQueryResult = await queryAsync('SELECT * FROM Procedural WHERE petType = ? AND procName = ?', [petType, 'core vaccination']);

                if (procQueryResult && procQueryResult.length > 0) {
                    for (let i = 0; i < procQueryResult.length; i++) {
                        await queryAsync('INSERT INTO Appointment SET ?', {
                            petID: petDetailsQueryResult[0].petID,
                            procID: procQueryResult[i].procID,
                            status: 'info'
                        });
                    }
                }

                const appointmentQueryResult = await queryAsync("SELECT * FROM Appointment INNER JOIN Procedural ON Appointment.procID = Procedural.procID WHERE Appointment.petID = ?", [petDetailsQueryResult[0].petID]);
                console.log(appointmentQueryResult[0].appID)

                for (let i = 0; i < appointmentQueryResult.length; i++) {
                  if (appointmentQueryResult[i].forAgeEnd && appointmentQueryResult[i].forAgeStart) {
                      const procdateEnd = appointmentQueryResult[i].forAgeEnd.split(':');
                      let year = parseInt(procdateEnd[0])
                      let month = parseInt(procdateEnd[1])
                      let week = parseInt(procdateEnd[2])
                      console.log("year: " + year + " month: " + month + " week: " + week)
                      
                      console.log("Pet Age:  " + petDetailsQueryResult[0].years + " " + petDetailsQueryResult[0].months + " " + parseInt(petDetailsQueryResult[0].weeks))
                    
                      if (parseInt(petDetailsQueryResult[0].years) > year) {
                        db.query("UPDATE Appointment SET status = 'danger' WHERE appID = ?", [appointmentQueryResult[i].appID])
                      }
                      else if (parseInt(petDetailsQueryResult[0].months) > month && parseInt(petDetailsQueryResult[0].years) === year) {
                        db.query("UPDATE Appointment SET status = 'danger' WHERE appID = ?", [appointmentQueryResult[i].appID])
                      }
                      else if (parseInt(petDetailsQueryResult[0].weeks) > week && parseInt(petDetailsQueryResult[0].months) === month && parseInt(petDetailsQueryResult[0].year) === year) {
                        db.query("UPDATE Appointment SET status = 'danger' WHERE appID = ?", [appointmentQueryResult[i].appID])
                      }else {
                        
                          const procdateStart = appointmentQueryResult[i].forAgeStart.split(':');
                          let yearstart = parseInt(procdateStart[0])
                          let monthstart = parseInt(procdateStart[1])
                          let weekstart = parseInt(procdateStart[2])
                          
                          if (parseInt(petDetailsQueryResult[0].years) > yearstart) {
                            db.query("UPDATE Appointment SET status = 'info', date = CURDATE() WHERE appID = ?", [appointmentQueryResult[i].appID])
                          }
                          else if (parseInt(petDetailsQueryResult[0].months) > monthstart && parseInt(petDetailsQueryResult[0].years) === yearstart) {
                            db.query("UPDATE Appointment SET status = 'info', date = CURDATE() WHERE appID = ?", [appointmentQueryResult[i].appID])
                          }
                          else if (parseInt(petDetailsQueryResult[0].weeks) > weekstart && parseInt(petDetailsQueryResult[0].months) === monthstart && parseInt(petDetailsQueryResult[0].year) === yearstart) {
                            db.query("UPDATE Appointment SET status = 'info', date = CURDATE() WHERE appID = ?", [appointmentQueryResult[i].appID])
                          }else {
                            let calweek = (parseInt(petDetailsQueryResult[0].weeks) - weekstart) * 7;
                            let calmonth = (monthstart - parseInt(petDetailsQueryResult[0].months)) * 28;
                            let calyear = (yearstart - parseInt(petDetailsQueryResult[0].years)) * 336;
                            let datecal = 0;
                            console.log("calweek: " + calweek + " calmonth: " + calmonth + " calyear: " + calyear)
                            if (calweek > 0){datecal += calweek}
                            if (calmonth > 0){datecal += calmonth}
                            if (calyear > 0){datecal += calyear}
                            
                            let calcudate = dayjs().add(parseInt(datecal), 'day')
                            console.log("Calcudate :  " + calcudate)
                            const formattedDate = new Date(calcudate).toISOString().substring(0, 10);
                            console.log()
                            db.query("UPDATE Appointment SET status = 'info', date = ? WHERE appID = ?", [formattedDate, appointmentQueryResult[i].appID])
                          }
                          
                      }
                  } else {
                      console.log("forAgeEnd or forAgeStart is null for appointment ID:", appointmentQueryResult[i].appID);
                      if(appointmentQueryResult[i].frequent === 'every_year'){
                        db.query("UPDATE Appointment SET status = 'info', date = CURDATE() WHERE appID = ?", appointmentQueryResult[i].appID)
                      } else if (appointmentQueryResult[i].forAgeStart){
                          const procdateStart = appointmentQueryResult[i].forAgeStart.split(':');
                          let yearstart = parseInt(procdateStart[0])
                          let monthstart = parseInt(procdateStart[1])
                          let weekstart = parseInt(procdateStart[2])
                          if (parseInt(petDetailsQueryResult[0].years) > yearstart) {
                            db.query("UPDATE Appointment SET date = CURDATE() WHERE appID = ?", [appointmentQueryResult[i].appID])
                          }
                          else if (parseInt(petDetailsQueryResult[0].months) > monthstart ) {
                            db.query("UPDATE Appointment SET date = CURDATE() WHERE appID = ?", [appointmentQueryResult[i].appID])
                          }
                          else if (parseInt(petDetailsQueryResult[0].weeks) > weekstart ) {
                            db.query("UPDATE Appointment SET date = CURDATE() WHERE appID = ?", [appointmentQueryResult[i].appID])
                          } else {
                            let calweek = (parseInt(petDetailsQueryResult[0].weeks) - weekstart) * 7;
                            let calmonth = (parseInt(petDetailsQueryResult[0].months) - monthstart) * 28;
                            let calyear = (parseInt(petDetailsQueryResult[0].years) - yearstart) * 336;

                            if (calweek > 0) {
                              datecal += calweek;
                            } else if (calweek < 0) {
                              datecal -= calweek;
                            }
                            if (calmonth > 0) {
                              datecal += calmonth;
                            } else if (calmonth < 0) {
                              datecal -= calmonth;
                            }
                            if (calyear > 0) {
                              datecal += calyear;
                            } else if (calyear < 0) {
                              datecal -= calyear;
                            }

                            let calcudate = dayjs().add(datecal, 'day');
                            console.log("Calcudate :  " + calcudate);
                            const formattedDate = new Date(calcudate).toISOString().substring(0, 10);
                            console.log()
                            db.query("UPDATE Appointment SET status = 'info', date = ? WHERE appID = ?", [formattedDate, appointmentQueryResult[i].appID])
                          }

                      }
                      // Handle or log this scenario accordingly if needed
                  }
              }
              
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: 'Something went wrong.' });
    }
};

//module.exports = petregister;