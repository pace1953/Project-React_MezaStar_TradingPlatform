import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyOrders() { 
    return (
        <div>
            <h1>My Orders</h1>
            <p>This is the My Orders page.</p>
            <Link to="/">首頁</Link>
        </div>
    )
}
export default MyOrders;