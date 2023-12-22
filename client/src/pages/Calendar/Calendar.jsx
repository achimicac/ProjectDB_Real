import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Calendar.css';
import dayjs from 'dayjs';


const Calendar = () => {
  const [showapp, setShowapp] = useState([]);
  const [appointmentDates, setAppointmentDates] = useState({});

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:3009/calendar`);
        setShowapp(response.data);
  
        const dates = {};
        response.data.forEach(appointment => {
          dates[appointment.appID] = appointment.date || '';
        });
        setAppointmentDates(dates);
      } catch (error) {
        console.error('Error fetching to-do list:', error);
      }
    };
  
    fetchAppointments();
  }, []);
  
    const filterMonth = event => {
    const selectedMonth = event.target.value;
    const requestData = {
      selectedMonth: selectedMonth
    };
    const filmonth =axios.post('http://localhost:3009/upload', requestData)
      .then(res => {
        if (res.data.Status === 'success') {
          console.log('Select Month Success');
        } else {
          console.log('Select Month Failed');
        }
      })
      .catch(error => {
        console.error('Select Month error:', error);
      });
  };

    const handleChangeDate = async appointmentID => {
        console.log(appointmentDates)
    try {

        const inputDate = new Date(appointmentDates[appointmentID]);
        const formattedDate = inputDate.toISOString().split('T')[0]; // Extracts yyyy-MM-dd
        console.log(formattedDate);
      const upapp = await axios.put(`http://localhost:3009/appointment/${appointmentID}`, { date: formattedDate });
        if(upapp.data.status === 'success'){
            alert(upapp.data.success)
            window.location.reload()
        }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleClick = async () => {
    navigate('/calendar');
  };

  const handleDateChange = (appointmentID, date) => {
    setAppointmentDates({ ...appointmentDates, [appointmentID]: date });
  };
    
    
    return (
        <div className="Today">
            <Helmet>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Appointment List</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <script src="https://kit.fontawesome.com/957263c2c4.js" crossorigin="anonymous"></script>
            </Helmet>
            <header>
                <h1>Appointment List</h1>
            </header>


            <main>
        {showapp.map(app => (
          <div className="container" key={app.appID}>
            <div className="appointment">
              <h2>{app.procName}</h2>
              <h3>Vaccine name:<br /> {app.vacName}</h3>
                                          <span>for {app.petName} on {app.appdate}</span>
            </div>
            <form className="changing-box" onSubmit={e => {
              e.preventDefault();
              handleChangeDate(app.appID);
            }}>
                <input
                    type="date"
                    name="date"
                    value={appointmentDates[app.appID] || ''}
                    onChange={e => handleDateChange(app.appID, e.target.value)}
                />
              <div className="CancelAndSubmit">
                <button id="cancel" className="button" onClick={handleClick}>Cancel</button>
                <button id="submit" className="button" type="submit" name="submit">Save Changes</button>
              </div>
            </form>
          </div>
        ))}
      </main>
            
      <nav className="navigate">
                <Link to="/articles"><a href="#"><i className="fa-solid fa-book-open fa-2x"></i></a></Link>
                <Link to="/home"><a href="#"><i className="fa-solid fa-house fa-2x"></i></a></Link>
                <Link to="/calendar"><a href="#"><i className="fa-regular fa-calendar-days fa-2x calendaricon"></i></a></Link>
            </nav>
        </div>
    );
};

export default Calendar;
