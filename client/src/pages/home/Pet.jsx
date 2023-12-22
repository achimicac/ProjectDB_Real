import React, { useEffect } from 'react';
import { useState } from 'react';
import './stylehomepage.css'; 
import { Helmet } from 'react-helmet';
import logoDog from './logodog.png';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
const Pet = () => {
    const navigate = useNavigate();

    const [auth, setAuth] = useState(false);
    const [pets, setPet] = useState([]);

    axios.defaults.withCredentials = true;


    useEffect(()=>{
        
        axios.get('http://localhost:3009/').then(res => {
            if (res.data.status === "success") {
                setAuth(true)
                navigate('/login')
            } else {
                setAuth(false)
            }
        })

        const fetchAllPets = async ()=>{
            try{
                const respone = await axios.get("http://localhost:3009/home");
                setPet(respone.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchAllPets();
    }, []);
    

    console.log(pets)


    return (
        <div className="home">
            <Helmet>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Home</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
                <script src="https://kit.fontawesome.com/957263c2c4.js" crossorigin="anonymous"></script>
            </Helmet>
            <header>
                <img src={logoDog} alt="Logo" />
                <nav className="Profile">

                    <Link to="/userprofile"><a className="user" href="#"><i className="fa-solid fa-user fa-2x"></i></a></Link>
                    
                </nav>
            </header>
            <main>
                <div class="Pet">
                    {pets.map(pet=>(
                        <figure className='pet' key={pet.petID}>
                            <Link to={`/petprofile/${pet.petID}`} style={{ textDecoration: 'none' }}>

                                {pet.id && <img src={pet.petPfpUrl}/>}
                                
                                <figcaption>{pet.petName}</figcaption>
                            </Link>
                        </figure>
                    ))}
                    
                    
                    <div class="addpet">
                        <a href="#"><Link to="/petregister"><i class="fa-solid fa-plus fa-4x"></i></Link></a>
                    </div>
                </div>
            </main>
            
            <nav className="navigate">
                <Link to="/articles"><a href="#"><i class="fa-solid fa-book-open fa-2x"></i></a></Link>
                <Link to="/home"><a href="#"><i class="fa-solid fa-house fa-2x"></i></a></Link>
                <Link to="/calendar"><a href="#"><i class="fa-regular fa-calendar-days fa-2x"></i></a></Link>
            </nav>

        </div>
    )
}

export default Pet;