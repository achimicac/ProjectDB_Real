import React, { useEffect } from 'react';
import { useState } from 'react';
import './Record.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

const Records = () => {
    const navigate = useNavigate();

    const { petid } = useParams();

    const [records, setRecords] = useState([]);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchAllRecords = async () => {
            try {
                const res = await axios.get(`http://localhost:3009/petprofile/${petid}/record`);
                setRecords(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllRecords();
    }, []);
    console.log(records)

    return (
        <div className="Records">
            <Helmet>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Pet Records</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet" />
                <script src="https://kit.fontawesome.com/957263c2c4.js" crossorigin="anonymous"></script>
            </Helmet>
            <body>
                    <header>
                        <div class="back">
                            <Link to="/petprofile/:id"></Link><a href="#"><i class="fa-solid fa-chevron-left fa-3x"></i></a>
                        </div>
                        <h1>{records.length > 0 && records[0].petName}'s record</h1>
                    </header>

                    <main>
                    {records.length > 0 && records.map(record => (
                        <div className="record" key={record.appID}>
                            <h2>{record.procName}</h2>
                            <p>{record.vacName}</p>
                            <p>{record.appdate}</p>
                        </div>
                    ))}
                
                    <div class="addrecord">
                        <a href={`/petprofile/${petid}/addrecord`}><i class="fa-solid fa-plus fa-4x"></i></a>
                    </div>
                
                </main>

                <nav class="navigate">
                    <Link to="/articles"><a href="#"><i class="fa-solid fa-book-open fa-2x"></i></a></Link>
                    <Link to="/home"><a href="#"><i class="fa-solid fa-house fa-2x"></i></a></Link>
                    <Link to="/calendar"><a href="#"><i class="fa-regular fa-calendar-days fa-2x"></i></a></Link>
                </nav>
            </body>
        </div>
    )
}

export default Records;
