import React, { useState, useEffect } from 'react';
import { useContextAPI } from '../Context/ContextAPI';
import { Link, useLocation } from 'react-router-dom';
import '../Css/MyOrder.css';

function MyOrders() { 

    const {
        setIsMenuOpen,
        isMenuOpen,
        handleCheckLogin,
        isLoggedIn,
        currentUser,
        // 訂單
        buyerOrder,
        setBuyerOrder,
        sellerOrder,
        setSellerOrder,
        activeTab,
        setActiveTab,
        selectedStatus,
        setSelectedStatus,
        handleBuyerOrders,
        handleSellerOrders,
    } = useContextAPI();

    useEffect(() =>{
        if(isLoggedIn){
            if(activeTab === 'buyer'){
                handleBuyerOrders();
            } else{
                handleSellerOrders();
            }
        } else{
            setBuyerOrder([]);
            setSellerOrder([]);
        }
    },[isLoggedIn, activeTab, selectedStatus])

    // 切換買家/賣家訂單的視窗
    const handleTabChange = (tab) =>{
        setActiveTab(tab);
        setSelectedStatus('all');
    }

    // 訂單狀態的篩選變更
    const handleStatusChange = (s) =>{
        setSelectedStatus(s);
    }

    // 格式化訂單的日期
    const formatDate = (d) =>{
        const date = new Date(d);
        return date.toLocaleString('zh-TW',{
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const renderOrderList = (orders, isSeller = false) => {
        if(orders.length === 0){
            return(
                <div className='mos_empty_order'>
                    <p>{currentUser.username}，您尚未有任何訂單</p>
                </div>
            )
        };
        return (
            <div className='mos_orders_list'>
                {
                    orders.map(order => (
                        <div className='mos_order_card' key={order.orderId || order.orderItemId}>
                            <div className='mos_order_header'>
                                <div className='mos_order_info'>
                                    <h3>訂單編號:{order.orderNumber}</h3>
                                    <p className='mos_order_time'>
                                        下單時間:{formatDate(order.orderTime)}
                                    </p>
                                </div>

                                <div className='mos_order_status'>
                                    <span className={`mos_status_badge ${order.status}`}>
                                        {order.status}
                                    </span>
                                </div>

                            </div>

                            <div className='mos_order_details'>
                                <div className='mos_order_parties'>
                                    {
                                        isSeller ?(
                                            <p><strong>買家:</strong>{order.buyerName}</p>
                                        ):(
                                            <p><strong>賣家:</strong>{order.sellerName}</p>
                                        )
                                    }
                                </div>

                                {order.orderItems && order.orderItems.length > 0 && (
                                    <div className='mos_card_info'>
                                        {order.orderItems.map((item) => (
                                            <div key={item.orderItemId} className='mos_order_item'>
                                                <p>
                                                    <strong>卡匣名稱: </strong> {item.cardName}
                                                </p>

                                                <p>
                                                    <strong>卡匣系列: </strong> {item.series}
                                                </p>
                                                
                                                <p>
                                                    <strong>卡匣星級: {item.starLevel}</strong>
                                                </p>

                                                <p>
                                                    <strong>數量: {item.quantity}</strong> 
                                                    <strong>, 總計:NT$ {item.subtotal}</strong>
                                                </p>

                                                <p>
                                                    <strong>---------</strong>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className='mos_order_summary'>
                                    <p><strong>商品數量:</strong>{order.totalItems}</p>
                                    <p><strong>總金額:</strong>{order.totalAmount}</p>
                                </div>  

                                {order.completedTime && (
                                    <p className='mos_completed_time'><strong>完成時間:</strong>{formatDate(order.completedTime)}</p>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }

    return (
        <div className='mos_container'>
            <nav className='mos_navbar'>
                <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
                <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
                <div className={`mos_navbar_container ${isMenuOpen ? 'menu_open' : ''}`}>
                    <ul className='mos_nav_menu'>
                        <li className='mos_menu_list'><Link className='home_page_links' to='/'>首頁</Link></li>
                        <li className='mos_menu_list'><Link className='myorder_page_links'>我的訂單</Link></li>
                        <li className='mos_menu_list'><Link className='cart_page_links' to='/cart' onClick={(e) => handleCheckLogin(e)}>購物車</Link></li>
                        <li className='mos_menu_list'><Link className='machine_position_page_links' to='/machine-position'>機台位置</Link></li>
                    </ul>
                </div>

                <div className='mos_user_info'>
                    <a className='username'>
                         {isLoggedIn ? `${currentUser.username}的訂單` : '請先登入'}
                    </a>
                </div>
            </nav>

            {
                !isLoggedIn ? (
                    <div className='mos_login_prompt'>
                        <h2>請先登入，再查看訂單</h2>
                        <Link className='home_page_links' to='/'>返回首頁</Link>
                    </div>
                ):(
                    <div className='mos_order_content'>
                        <div className='mos_order_header'>
                            <h1>{currentUser.username}的訂單</h1>

                            <div className='mos_tab_buttons'>
                                <button
                                className={`mos_tab_btn ${activeTab === 'buyer' ? 'active':''}`}
                                onClick={() => handleTabChange('buyer')}>
                                    我是買家    
                                </button>

                                <button
                                className={`mos_tab_btn ${activeTab === 'seller' ? 'active':''}`}
                                onClick={() => handleTabChange('seller')}>
                                    我是賣家    
                                </button>

                            </div>

                            {
                                activeTab === 'seller' && (
                                    <div className='mos_status_filter'>
                                        <label>訂單狀態</label>
                                        <select className='mos_status_select' 
                                        value={selectedStatus}
                                        onChange={(e) => handleStatusChange(e.target.value)}> 
                                            <option value="all">全部</option>
                                            <option value="待處理">待處理</option>
                                            <option value="已完成">已完成</option>
                                        </select>
                                    </div>
                                )
                            }
                        </div>
                        <div className="mos_orders_main">
                            {
                            activeTab=== 'buyer' 
                                ? renderOrderList(buyerOrder, false)
                                : renderOrderList(sellerOrder, true)
                            }
                        </div>

                    </div>
                )
            }

        </div>
    )
}
export default MyOrders;