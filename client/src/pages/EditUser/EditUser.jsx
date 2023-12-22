import React, { useState, useEffect } from 'react';
import './EditUser.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
    const { petid } = useParams();

    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3009/userprofile`); 
                setUser(response.data[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const resEdit = await axios.put(`http://localhost:3009/userprofile/edit`, user); 
            if (resEdit.data.status === "success") {
                alert(resEdit.data.success);
                navigate(`/userprofile`) //why
            } else {
                alert(resEdit.data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = async (e) => {
        navigate("/profile")
    }

    const [user, setUser] = useState({
        pfp: '',
        fname: '',
        lname: '',
        email: '',
        phone: '',
    });

    console.log(user);

    return (
        <div className="EditUser">
            <Helmet>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Edit User Profile</title>
                <link rel="stylesheet" href="style.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <script src="https://kit.fontawesome.com/957263c2c4.js" crossorigin="anonymous"></script>
            </Helmet>
            <body>
                <div class="back">
                    <Link to='/profile'><a href="#"><i class="fa-solid fa-chevron-left fa-3x"></i></a></Link>
                </div>

                <main>

                    <form action="" onSubmit={handleUpdateProfile}>

                        <div class="textinfo">
                            <label for="fname">First Name</label>
                            <input id="fname" type="text" value={user.fname} onChange={handleChange} name="fname" />
                            <label for="lname">Last Name</label>
                            <input id="lName" type="text" value={user.lname} onChange={handleChange} name="lname" />
                            <label for="email">Email</label>
                            <input id="email" type="text" value={user.email} onChange={handleChange} />
                            <label for="phone">Phone Number</label>
                            <input id="phone" type="tel" value={user.phone} onChange={handleChange} />
                            
                        </div>

                        <div class="CancelAndSubmit">
                            <button id="cancel" class="button" onClick={handleClick}>Cancel</button>
                            <button id="submit" class="button" type="submit" name="submit">Save Changes</button>
                        </div>

                    </form>

                </main>
                <nav class="navigate">
                    <Link to="/articles"><a href="#"><i class="fa-solid fa-book-open fa-2x"></i></a></Link>
                    <Link to="/"><a href="#"><i class="fa-solid fa-house fa-2x"></i></a></Link>
                    <Link to="/calendar"><a href="#"><i class="fa-regular fa-calendar-days fa-2x"></i></a></Link>
                </nav>
            </body>
        </div>
    )
}

export default EditUser;