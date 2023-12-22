
const saltRounds = 10;
import {db} from '../routes/db-config.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { petEdit } from './petedit.js';

export const addrecord = async (req, res) => {
      const { procName, date, procID} = req.body;
      console.log(date, procName, procID);
      
      const formattedDate = new Date(date).toISOString().substring(0, 10);
      try{
            if (procID === '' || procID === null || procID === undefined) {
                  db.query("INSERT INTO Procedural SET ?", {procName: procName, petType: 'all', forGender: 'all'}, (errproc, resproc) => {
                        db.query("SELECT * FROM Procedural WHERE procName = ?", [procName], (finderr, resfind) => {
                              console.log(resfind[0].procID)
                              db.query("INSERT INTO Appointment SET ?", {petID: req.params.petid, procID: resfind[0].procID, date: date, status: 'success'}, (apperr, appres) => {
                                    res.json({status: 'success', success: 'Already Add Appintment for your pet'})
                              })
                        })
                  })
                  console.log("procID is undefined or null")
            }
            else{
                  db.query("INSERT INTO Appointment SET ?", {procID: procID, date: date, status: 'success', petID: req.params.petid}, (apperr, appres) => {
                        res.json({status: 'success', success: 'Already Add Appintment for your pet'})
                  })
                  console.log("procID is defined")
            }
      } catch {
            console.log(err)
      }
}

export const allprocedure = async (req, res, next) => {
      
      //db.query("SELECT * FROM Pet WHERE petID = ?", [req.params.petid], (errpet, respet)=>{
            db.query("SELECT * FROM Pet WHERE petID = ?", [req.params.petid], (peterr, petre)=>{
                  db.query("SELECT DISTINCT(procName), vacName, forGender, petType, Procedural.procID procID FROM `Procedural` LEFT JOIN `Vaccine` ON Procedural.vacID = Vaccine.vacID WHERE Procedural.forGender IN (?, 'all', null) AND Procedural.petType IN (?, 'all', null)", [petre[0].petGender, petre[0].petType], (proerr, repro) => {
                        res.allprocedure = repro;
                        console.log(repro)
                        next()
                  })
            })
            
      //})
}
//WHERE Procedural.petType IN (?, 'All') AND Procedural.forGender IN (?, 'all')