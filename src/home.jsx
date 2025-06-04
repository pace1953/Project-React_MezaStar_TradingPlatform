import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './menu.css'
import './search.css';
import { Link } from 'react-router-dom';

function Home() {

    // Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [registermodalIsOpen, setRegisterModalIsOpen] = useState(false);
    const [sellmodalIsOpen, setSellModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const openRegisterModal = () => setRegisterModalIsOpen(true);
    const closeRegisterModal = () => setRegisterModalIsOpen(false);
    const openSellModal = () => setSellModalIsOpen(true);
    const closeSellModal = () => setSellModalIsOpen(false);

    // 登入, 註冊
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', password: '', email: '' });

    // 響應式漢堡
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // 檢查登入狀態
        checkLoginStatus();
    }, []);

    // -- 登入用 ----------------------------------------------------------------------
    // 檢查登入狀態(是否已經登入)
    const checkLoginStatus = async () => {
        try {
        const res = await fetch('http://localhost:8888/rest/check-login', {
            method: 'GET',
            credentials: 'include'
        });
        const resData = await res.json();
        setIsLoggedIn(resData.data);
        } catch (err) {
        setIsLoggedIn(false);
        }
    };

    // 登入表單資料狀態改變
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        // 只變更該欄位資料, 其他欄位仍保持原資料狀態
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    // 登入
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch('http://localhost:8888/rest/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(loginForm)
        });

        const resData = await res.json();
        if (res.ok && resData.status === 200) {
            alert('登入成功');
            setIsLoggedIn(true);
            closeModal();
        } else {
            alert('登入失敗：' + resData.message);
        }
        } catch (err) {
        alert('登入錯誤: ' + err.message);
        }
    };

    // 註冊
    const handleRegisterSubmit = async (e) => {
    e.preventDefault();
        try{
            const res = await fetch('http://localhost:8888/rest/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(registerForm)
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('註冊成功，請登入');
                closeRegisterModal();
                openModal();
            } else {
                alert('註冊失敗：' + resData.message);
            }
        } catch (error) {
            console.error('註冊請求失敗:', error);
            alert('註冊失敗：網路錯誤');
        }
    };
    
    // 新增註冊表單的資料狀態改變
    const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    };

    // 關閉登入的Modal，開啟註冊的Modal
    const handleRegisterModalOpen = () => {
        closeModal();
        openRegisterModal();
    }
    // 關閉註冊的Modal，開啟登入的Modal
    const handleLoginModalOpen = () => {
        closeRegisterModal(); 
        openModal();
    }

    // 如果登入狀態為true，則會打開sell_modal; false則會顯示請使用者先登入
    const handleSellModal = () => {
        if (isLoggedIn) {
            openSellModal();
        } else {
            alert('請先登入');
        }
    }
    

    return (
        <div className='container'>
            <nav className='navbar'>

                <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
                <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>

                <div className={`nav_menu_container ${isMenuOpen ? 'menu-open' : ''}`}>
                    <ul className='nav_menu'>
                        <li className='menu_list'><Link className='home-page-links' href='/'>首頁</Link></li>
                        <li className='menu_list'><a className='sell-page-links' onClick={handleSellModal}>販賣卡匣</a></li>
                        <li className='menu_list'><Link className='myorder-page-links' to='/myorders'>我的訂單</Link></li>
                        <li className='menu_list'><Link className='cart-page-links' to='/cart'>購物車</Link></li>
                        <li className='menu_list'><Link className='machine-position-page-links' to='/machine-position'>機台位置</Link></li>
                    </ul>
                </div>

                <div className='loginlogout_button_container'>
                    {
                        isLoggedIn ? (
                            <div className='login_status'>
                                <button className='logout_button' onClick={async () => {
                                    try {
                                        const res = await fetch('http://localhost:8888/rest/logout', {
                                            method: 'GET',
                                            credentials: 'include'
                                        });
                                        const resData = await res.json();
                                        if (res.ok && resData.status === 200) {
                                            alert(resData.message);
                                            setIsLoggedIn(false);
                                        } else {
                                            alert('登出失敗：' + resData.message);
                                        }
                                    } catch (err) {
                                        alert('登出錯誤: ' + err.message);
                                    }
                                }}>登出</button>
                            </div>
                        ) : (
                            <button className='login_button' onClick={openModal}>登入</button>
                        )
                    }
                </div>
        
            </nav>

            <div className='modal_container'>
                <Modal className='login_modal' overlayClassName='login_modal_overlay' isOpen={modalIsOpen} onRequestClose={closeModal} >
                    <h2 className='modal_h2'>會員登入</h2>
                    <button type="button" className='modal_close_button' onClick={closeModal}>X</button>
                    <input type="text" placeholder='請輸入帳號' className='modal_input' name="username" onChange={handleLoginChange} value={loginForm.username} required/>
                    <input type="password" placeholder='請輸入密碼' className='modal_input' name="password"  onChange={handleLoginChange} value={loginForm.password}  required/>
                    <button className='modal_login_button' onClick={handleLoginSubmit}>登入</button>
                    <div>
                        <span className='modal_span'>—————  透過以下社群帳號登入  —————</span>
                        <button className='modal_social_button_google'>Google</button>
                        <button className='modal_social_button_discord'>Discord</button>
                        <span className='modal_span'>還沒有帳號嗎？<button className='modal_register' onClick={handleRegisterModalOpen}>註冊</button></span>
                    </div>
                </Modal>
                <Modal className='register_modal' overlayClassName='register_modal_overlay' isOpen={registermodalIsOpen} onRequestClose={closeRegisterModal} >
                    <h2 className='modal_h2'>會員註冊</h2>
                    <button type="button" className='modal_close_button' onClick={closeRegisterModal}>X</button>
                    <input type="text" placeholder='請輸入帳號' className='modal_input' name="username" onChange={handleRegisterChange} value={registerForm.username} required/>
                    <input type="password" placeholder='請輸入密碼' className='modal_input' name="password"  onChange={handleRegisterChange} value={registerForm.password}  required/>
                    <input type="email" placeholder='請輸入電子郵件' className='modal_input' name="email"  onChange={handleRegisterChange} value={registerForm.email}  required/>
                    <button className='modal_register_button' onClick={handleRegisterSubmit}>註冊</button>
                    <span className='modal_span'>已經有帳號了嗎？<button className='modal_login' onClick={handleLoginModalOpen}>登入</button></span>
                </Modal>
                <Modal className='sell_modal' overlayClassName='sell_modal_overlay' isOpen={sellmodalIsOpen} onRequestClose={closeSellModal} >
                    <h2>新增卡匣販賣清單</h2>
                    <button type="button" className='modal_close_button' onClick={closeSellModal}>X</button>
                </Modal>
            </div>
                
            <div>
                <div className='cardSearch_container'>
                    <h2 className='cardSearch_title'>卡匣交易</h2>
                    <div className='cardSearch_input_container'>
                        <label className='cardSearch_label'>卡匣彈數</label>
                        <label className='cardSearch_label'>卡匣星數</label>
                        <label className='cardSearch_label'>卡匣名稱</label>
                    </div>  
                </div>
            </div>
        </div>
    );
}

export default Home;