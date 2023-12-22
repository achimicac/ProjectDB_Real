import express from "express";
import {db} from './routes/db-config.js';
import cors from "cors";
const app = express();
import path from "path";
const port = process.env.PORT || 3009;
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {router} from '../backend/routes/pages.js';
import {router as auth} from '../backend/controllers/auth.js'
import fileUpload from 'express-fileupload';
import bodyParser from "body-parser";
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

/*app.use("/js", express.static(path.join(__dirname + "/public/js")));
app.use("/css", express.static(path.join(__dirname + "/public/css")));*/
/*app.set("view engine", "ejs");
app.set("views", "./views");*/
app.use("/uploads", express.static('../uploads'));
app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: '100mb'}));
app.use(express.json()); //Can read the json file that get from user register.html
/*
app.use(cors(
      {
            origin: "http://localhost:3000",
            methods: ["POST", "GET", "PUT", "DELETE"],
            credentials: true
      }
));*/
app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
}));

/*const storage = multer.diskStorage({
      destination: (req, res, cb) => {
            cb(null, 'public/image')
      },
      filename: (req, file, cb) => {
            cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
      }
})

const upload = multer({
      storage: storage
})*/

/*router.post('/upload', upload.single('image), (req, res) => {
      const image = req.file.filename;
      const sql = "UPDATE Pet SET petPfp = ?"
      db.query(sql, [image], (err, result) => {
            if(err) return res.json({Message: Error});
            return res.json({status: "success"})
      })
})*/

app.use(fileUpload())

db.connect((err) => {
      if (err) throw err;
      console.log("db connected");
});

app.use("/", router);
//app.use("/api", auth);

app.listen(port);