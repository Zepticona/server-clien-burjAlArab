import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [bookings, setBookings] = useState([])
    useEffect( () => {
        fetch('http://localhost:4000/bookings?email='+loggedInUser.email, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem('token')}`
            }
        })
        .then( res => res.json())
        .then( data => {
            console.log(data);
            setBookings(data)
        })
    }, [])
    return (
        <div>
            <p>Total Bookings: {bookings.length} </p>
            {
                bookings.map( booking => <li key={booking._id}>Booked by {booking.name} from {booking.checkIn} to {(new Date(booking.checkOut)).toDateString('dd/MM/yyyy')}</li> )
            }
        </div>
    );
};

export default Bookings;