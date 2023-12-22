/*const db = require("../routes/db-config.js");
const jwt = require("jsonwebtoken");*/
import {db} from '../routes/db-config.js';
import jwt from 'jsonwebtoken';
import { Blob } from 'buffer';
import dayjs from 'dayjs';

//ว่าจะมาทำcheck เพิ่มว่าถ้าไม่ใช่เจ้าของsccountให้มันrenderหน้าอื่น

export const petEdit = async (req, res, next) => {
      
      const { petName, petType, petDoB, petPfpUrl, petGender, petPfp, petBDShow} = req.body;
      console.log(petPfpUrl);
      var binaryData
      try{
            binaryData = Buffer.from(petPfp.dataUrl.split(',')[1], 'base64'); 
      }catch {
            binaryData = Buffer.from(petPfpUrl.split(',')[1], 'base64');
      }
      console.log("pet Edit \n" + petPfp.dataUrl)
      
      const formattedDate = new Date(petBDShow).toISOString().substring(0, 10);

      try {
            db.query('UPDATE Pet SET ? WHERE petID = ?', [{petName: petName, petType: petType, petDoB: petBDShow, petPfp: binaryData, petGender: petGender}, req.params.petid], (err, result) => {
                  if (err) {
                        console.log("Can't Edit pet inform" + petName , petDoB);
                        console.log(err);
                        res.json({error: "success", error: "Edit " + petName + " is not success"});
                  }else{
                        console.log("Edit pet inform success");
                        res.json({status: "success", success: "Edit Success"});
                  }
            })
      } catch (error) {
            console.log(error);
            
      }
}

//module.exports = petEdit;