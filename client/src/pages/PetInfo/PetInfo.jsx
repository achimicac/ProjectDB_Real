import React, { useEffect } from 'react';
import { useState } from 'react';
import './PetInfo.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";


const PetInfo = () => {
    
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const {petid} = useParams();
        function filterTable() {
        const dropdown = document.querySelector("#status");
        let selectValue = dropdown.value;
        const table = document.querySelector("#vaccine-table");
        let rows = table.getElementsByTagName("tr");

        for (var i = 0; i < rows.length; i++) {
            let row = rows[i];
            let status = row.cells[0].className;

            if (selectValue === "all" || status === selectValue) {
                row.style.display = "";
            }
            else {
                row.style.display = "none";
            }
        }
    }


    // State for the second set of data
    const [pets, setPet] = useState([]);
    const [vaccines, setVaccine] = useState([]);

    
    useEffect(() => {
        // Fetch data from the first path
        const fetchPet = async () => {
            try {
                const response = await axios.get(`http://localhost:3009/petprofile/${petid}`);
                
                setPet(response.data[0]);
            } catch (error) {
                console.error('Error fetching pet data:', error);
            }
        };

        // Fetch data from the second path
        const fetchVaccine = async () => {
            try {
                const response = await axios.get(`http://localhost:3009/petprofile/${petid}/vaccine`);
                setVaccine(response.data);
            } catch (error) {
                console.error('Error fetching vaccine data:', error);
            }
        };

        // Call the functions to fetch data when the component mounts
        fetchPet();
        fetchVaccine();
    }, []);
    console.log(pets)

    const handleDelete = async (id) => {
        
        try {
            
            const deletePet = await axios.put(`http://localhost:3009/petprofile/${petid}/delete`)
            if(deletePet.data.status === 'success'){
                console.log("Delete success")
                window.location.href = '/home'
            }
            //window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }
    console.log("From PetInfo" + pets.PetInfo)

    return (
        <div className="petInfo">
            <Helmet>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Your pet's information</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <script src="https://kit.fontawesome.com/957263c2c4.js" crossorigin="anonymous"></script>
            </Helmet>
            <header>
                <h1>Pet Info</h1>
            </header>
            <body>
                    

                <div className="Info" key={pets.petID}>
                    {pets.petID && <img src={pets.petPfpUrl} />}
                        <div class="text">
                            <h1>{pets.petName}</h1>
                            <table>
                                <tr>
                                    <th>Type :</th>
                                    <td id="Type">{pets.petType}</td>
                                </tr>
                                <tr>
                                    <th>Birthday: </th>
                                    <td id="DoB">Birthday: {pets.bd}</td>
                                </tr>
                                <tr>
                                    <th>Age :</th>
                                    <td id="Age">Age: {pets.weeks} weeks | {pets.months} months | {pets.years} years</td>
                                </tr>
                            </table>
                        </div>
                        <a href={`/petprofile/${pets.petID}/edit`}><i class="fa-solid fa-pen-to-square"></i></a>
                    </div>

                <div class="vaccinelist">

                    <div class="HeaderVacc">
                        <h2>Vaccination</h2>
                        <form action="">
                            <div>
                                <button className='delete' onClick={() => handleDelete(pets.petID)}>Delete This Pet</button>
                            </div>
                        </form>
                    </div>
                        
                    {vaccines.map(vaccine => (
                        <table id="vaccine-table" key={vaccine.vacID}>
                            <tr>
                                <th>Vaccine</th>
                                <th>Vaccine Name</th>
                                <th>Status</th>
                            </tr>
                            {(() => {
                                if (vaccine.status === 'success') {
                                    return (
                            <tr key={vaccine.vacID} >
                                <td className="Completed">{vaccine.vacName}</td>
                                <td>{vaccine.disease}</td>
                                <td> Completed </td>
                                <td>{vaccine.appdate}</td>
                            </tr>
                            );
                                } else if (vaccine.status === 'info') {
                                    return (
                            <tr key={vaccine.vacID} >
                                <td className="ongoing">{vaccine.vacName}</td>
                                <td>{vaccine.disease}</td>
                                <td> Next </td>
                                <td>{vaccine.appdate}</td>

                            </tr>
                            );
                                } else if (vaccine.status === 'danger') {
                                    return (
                            <tr key={vaccine.vacID} >
                                <td className="Incomplete">{vaccine.vacName}</td>
                                <td>{vaccine.disease}</td>
                                <td> Incomplete</td>
                                <td>{vaccine.appdate}</td>
                            </tr>
);
                                } else {
                                    return null; // Handle other cases or provide a default
                                }
                            })()}
                        </table>
                    ))}

                    <a href={`/petprofile/${pets.petID}/record`}><i class="fa-solid fa-book-medical fa-4x"></i></a>
                </div>
            </body>
            <nav className="navigate">
                <Link to="/articles"><a href="#"><i class="fa-solid fa-book-open fa-2x"></i></a></Link>
                <Link to="/home"><a href="#"><i class="fa-solid fa-house fa-2x"></i></a></Link>
                <Link to="/calendar"><a href="#"><i class="fa-regular fa-calendar-days fa-2x"></i></a></Link>
            </nav>
        </div>
    )
}

export default PetInfo;