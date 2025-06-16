import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyOrders() { 
    return (
        <div className='my_orders_container'>
            <nav className='my_orders_navbar'>
                <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
                <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>


            </nav>
            <h1>My Orders</h1>
            <p>This is the My Orders page.</p>
            <Link to="/">首頁</Link>
        </div>
    )
}
export default MyOrders;