import Modal from 'react-modal';

import './Css/menu.css';
import './Css/search.css';
import { Link, useLocation } from 'react-router-dom';
import { useContextAPI } from './Context/ContextAPI';
import { useEffect } from 'react';

function Home() {
    
    const {
        // 狀態
        isLoggedIn,
        setIsLoggedIn,
        loginForm,
        setLoginForm,
        registerForm,
        setRegisterForm,

        isMenuOpen,
        setIsMenuOpen,
        currentUser,
        setCurrentUser,

        hasSearched,
        setHasSearched,

        // Modal狀態
        modalIsOpen,
        setModalIsOpen,
        registermodalIsOpen,
        setRegisterModalIsOpen,
        sellmodalIsOpen,
        setSellModalIsOpen,

        // Modal方法
        openModal,
        closeModal,
        openRegisterModal,
        closeRegisterModal,
        openSellModal,
        closeSellModal,

        handleRegisterModalOpen,
        handleLoginModalOpen,
        handleSellModal,
        handleCheckLogin,



        // 卡匣資料
        cards,
        setCards,
        searchForm,
        setSearchForm,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        sellForm,
        setSellForm,

        // 卡匣方法
        loadAvailableCards,
        handleSearchChange,
        searchByMultipleCriteria,
        handleSearch,
        resetSearch,
        handleSellFormChange,
        handleSellSubmit,
        
        // 購物車方法
        addToCart,

        // 方法
        checkLoginStatus,
        handleLoginChange,
        handleLoginSubmit,
        handleRegisterChange,
        handleRegisterSubmit,
        handleLogout,

        // 賣家的卡匣狀態
        myCardsmodalIsOpen,
        myCards,
        editingCard,
        editForm,
        setEditingCard,
        setEditForm,

        // 賣家的卡匣方法
        
        closeMyCardsModal,
        handleMyCardsModal,
        handleEditCard,
        handleEditFormChange,
        handleUpdateCard,
        handleDeleteCard,
    
    } = useContextAPI();

    const location = useLocation();

    // 透過ReactRouter的useLocation監聽 ->每次進入首頁都重置搜尋
    useEffect(() => {
        resetSearch();
    }, [location.pathname])



    return (
        <div className='container'>
            <nav className='navbar'>

                <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
                <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>

                <div className={`nav_menu_container ${isMenuOpen ? 'menu-open' : ''}`}>
                    <ul className='nav_menu'>
                        <li className='menu_list'><Link className='home_page_links' to='/'>首頁</Link></li>
                        <li className='menu_list'><a className='sell_page_links' onClick={handleSellModal}>販賣卡匣</a></li>
                        <li className='menu_list'><Link className='myorder_page_links' to='/myorders' onClick={(e) => handleCheckLogin(e)}>我的訂單</Link></li>
                        <li className='menu_list'><Link className='cart_page_links' to='/cart' onClick={(e) => handleCheckLogin(e)}>購物車</Link></li>
                        <li className='menu_list'><Link className='machine_position_page_links' to='/machine-position'>機台位置</Link></li>
                    </ul>
                </div>

                <div className='loginlogout_button_container'>
                    {
                        isLoggedIn ? (
                            <div className='user_info'>
                                <a className='username'>{currentUser.username}</a>
                                <button className='logout_button' onClick={handleLogout}>登出</button>
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
                    <h2 className='modal_h2'>新增販賣卡匣</h2>
                    <button type="button" className='modal_close_button' onClick={closeSellModal}>X</button>
                    
                    <form onSubmit={handleSellSubmit} className='sell_form'>
                        <div className='sell_form_group'>
                            <label className='sell_label'>卡匣名稱：</label>
                            <input 
                                type="text" 
                                name="cardName"
                                value={sellForm.cardName}
                                onChange={handleSellFormChange}
                                placeholder="請輸入卡匣名稱"
                                className='sell_input'
                                required
                            />
                        </div>
                        
                        <div className='sell_form_group'>
                            <label className='sell_label'>卡匣系列：</label>
                            <select 
                                name="series"
                                value={sellForm.series}
                                onChange={handleSellFormChange}
                                className='sell_select'
                                required
                            >
                                <option value="">請選擇系列</option>
                                <option value="星塵第1彈">星塵第1彈</option>
                                <option value="星塵第2彈">星塵第2彈</option>
                                <option value="MEZASTAR活動卡匣">MEZASTAR活動卡匣</option>
                            </select>
                        </div>
                        
                        <div className='sell_form_group'>
                            <label className='sell_label'>卡匣星級：</label>
                            <select 
                                name="starLevel"
                                value={sellForm.starLevel}
                                onChange={handleSellFormChange}
                                className='sell_select'
                                required
                            >
                                <option value="">請選擇星級</option>
                                <option value="5">5星</option>
                                <option value="6">6星</option>
                                <option value="Special">Special</option>
                            </select>
                        </div>

                        <div className='sell_form_group'>
                            <label className='sell_label'>卡匣數量：</label>
                            <input 
                                type="number" 
                                name="quantity"
                                value={sellForm.quantity || ''}
                                onChange={handleSellFormChange}
                                placeholder="請輸入卡匣數量"
                                className='sell_input'
                                min="1"
                                required
                            />
                        </div>
                        
                        <div className='sell_form_group'>
                            <label className='sell_label'>售價 (NT$)：</label>
                            <input 
                                type="number" 
                                name="price"
                                value={sellForm.price}
                                onChange={handleSellFormChange}
                                placeholder="請輸入售價"
                                className='sell_input'
                                min="1"
                                required
                            />
                        </div>
                        
                        <div className='sell_form_buttons'>
                            <button type="submit" className='sell_submit_button'>
                                上架販賣
                            </button>
                            <button type="button" onClick={closeSellModal} className='sell_cancel_button'>
                                取消
                            </button>
                        </div>

                    </form>

                </Modal>
                <Modal className='my_cards_modal' overlayClassName='my_cards_modal_overlay' isOpen={myCardsmodalIsOpen} onRequestClose={closeMyCardsModal}>
                    <h2 className='modal_h2'>我的卡匣管理</h2>
                    <button type="button" className='modal_close_button' onClick={closeMyCardsModal}>X</button>
                    
                    <div className='my_cards_list'>
                        {myCards.length > 0 ? (
                            <table className='my_cards_table'>
                                <thead>
                                    <tr>
                                        <th>卡匣名稱</th>
                                        <th>系列</th>
                                        <th>星級</th>
                                        <th>數量</th>
                                        <th>單價</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myCards.map(card => (
                                        <tr key={card.cardId}>
                                            <td>{card.cardName}</td>
                                            <td>{card.series}</td>
                                            <td>{card.starLevel === 'Special' ? 'Special' : '★'.repeat(parseInt(card.starLevel))}</td>
                                            <td>{card.quantity}</td>
                                            <td>NT$ {card.price.toLocaleString()}</td>
 
                                            <td>
                                                <button 
                                                    className='edit_button' 
                                                    onClick={() => handleEditCard(card)}
                                                >
                                                    編輯
                                                </button>
                                                <button 
                                                    className='delete_button' 
                                                    onClick={() => handleDeleteCard(card.cardId)}
                                                >
                                                    刪除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='no_my_cards'>
                                <p>您還沒有上架任何卡匣</p>
                            </div>
                        )}
                    </div>
                    
                    {editingCard && (
                        <div className='edit_form_container'>
                            <h3>編輯卡匣</h3>
                            <form onSubmit={handleUpdateCard} className='edit_form'>
                                <div className='edit_form_group'>
                                    <label>卡匣名稱：</label>
                                    <input 
                                        type="text" 
                                        name="cardName"
                                        value={editForm.cardName}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>
                                
                                <div className='edit_form_group'>
                                    <label>卡匣系列：</label>
                                    <select 
                                        name="series"
                                        value={editForm.series}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="">請選擇系列</option>
                                        <option value="星塵第1彈">星塵第1彈</option>
                                        <option value="星塵第2彈">星塵第2彈</option>
                                        <option value="MEZASTAR活動卡匣">MEZASTAR活動卡匣</option>
                                    </select>
                                </div>
                                
                                <div className='edit_form_group'>
                                    <label>卡匣星級：</label>
                                    <select 
                                        name="starLevel"
                                        value={editForm.starLevel}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="">請選擇星級</option>
                                        <option value="5">5星</option>
                                        <option value="6">6星</option>
                                        <option value="Special">Special</option>
                                    </select>
                                </div>

                                <div className='edit_form_group'>
                                    <label>卡匣數量：</label>
                                    <input 
                                        type="number" 
                                        name="quantity"
                                        value={editForm.quantity || editForm.availableQuantity}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                
                                <div className='edit_form_group'>
                                    <label>售價 (NT$)：</label>
                                    <input 
                                        type="number" 
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                
                                <div className='edit_form_buttons'>
                                    <button type="submit" className='update_button'>
                                        更新
                                    </button>
                                    <button type="button" 
                                        onClick={() => {
                                            setEditingCard(null);
                                            setEditForm({
                                                cardName: '',
                                                series: '',
                                                starLevel: '',
                                                price: '',
                                                quantity: ''
                                            });
                                        }} 
                                        className='cancel_button'>
                                    取消
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </Modal>

            </div>
                
            <div className='cardSearch_container'>
                <h2 className='cardSearch_title'>卡匣交易<button className='my_cards_button' onClick={handleMyCardsModal}>我的卡匣</button></h2>
                
                <form onSubmit={handleSearch} className='cardSearch_form'>
                <div className='cardSearch_input_container'>
                    
                    <div className='cardSearch_field'>
                        <label className='cardSearch_label'>卡匣系列</label>
                            <select name="series" value={searchForm.series} 
                            onChange={handleSearchChange} 
                            className='cardSearch_select'>
                                <option value="">請選擇系列</option>
                                <option value="星塵第1彈">星塵第1彈</option>
                                <option value="星塵第2彈">星塵第2彈</option>
                                <option value="MEZASTAR活動卡匣">MEZASTAR活動卡匣</option>
                            </select>
                    </div>

                    <div className='cardSearch_field'>
                        <label className='cardSearch_label'>卡匣星級</label>
                        <select 
                            name="starLevel" 
                            value={searchForm.starLevel} 
                            onChange={handleSearchChange}
                            className='cardSearch_select'>
                            <option value="">請選擇星級</option>

                            <option value="5">5星</option>
                            <option value="6">6星</option>
                            <option value="Special">Special</option>
                        </select>
                    </div>

                    <div className='cardSearch_field'>
                        <label className='cardSearch_label'>卡匣名稱</label>
                        <input 
                            type="text" 
                            name="cardName" 
                            value={searchForm.cardName} 
                            onChange={handleSearchChange}
                            placeholder="請輸入卡匣名稱"
                            className='cardSearch_input'
                        />
                    </div>

                    <div className='cardSearch_field'>
                        <label className='cardSearch_label'>價格範圍</label>
                            <div className='price_range_container'>
                                <input 
                                    type="number" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="最低價"
                                    className='cardSearch_price_input'/>
                                <span>~</span>
                                <input 
                                    type="number" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="最高價"
                                    className='cardSearch_price_input'/>
                            </div>
                        </div>
                        <div className='cardSearch_button_container'>
                            <button type="submit" className='search_button'>搜尋</button>
                            <button type="button" onClick={resetSearch} className='reset_button'>重置</button>
                        </div>
                    </div>

                </form>

                    <div className='cards_container'>
                        <h3 className='cards_title'>可購買的卡匣 ({cards.length})</h3>
                        <div className='cards_grid'>

                            {hasSearched ? 
                                (cards.length > 0 ? (
                                    <table className='cards_table'>
                                        <thead className='table_header'>
                                            <tr>
                                                <th>狀態</th>
                                                <th>卡匣名稱</th>
                                                <th>系列</th>
                                                <th>星級</th>
                                                <th>數量</th>
                                                <th>單價</th>
                                                <th>賣家</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>

                                    <tbody>
                                        {cards.map(card => (
                                            <tr key={card.cardId} className='card_row'>
                                                <td >
                                                    <span className='status_badge status_selling'>出售</span>
                                                </td>
                                                <td className='card_name'>{card.cardName}</td>
                                                <td className='card_series'>
                                                    <span className='card_series_text'>{card.series}</span>
                                                </td>
                                                <td className='card_star'>
                                                    {card.starLevel === 'special' || card.starLevel === 'Special' 
                                                    ? 'Special' : '★'.repeat(parseInt(card.starLevel))}
                                                </td>

                                                <td className='card_selling_number'>
                                                    {card.availableQuantity || card.quantity}
                                                </td>

                                                <td className='card_price'>NT$ {card.price.toLocaleString()}</td>
                                                <td className='card_seller'>{card.sellerName || '未知'}</td>

                                                <td>
                                                    <button onClick={() => addToCart(card.cardId)}
                                                            className='add_to_cart_button'
                                                            disabled={!isLoggedIn}>
                                                            {isLoggedIn ? '加入購物車' : '請先登入'}
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                ): (
                                    <div className='no_cards'>
                                        <p>沒有找到符合條件的卡匣</p>
                                    </div>
                                )
                            ) : (
                                <div className='no_cards'>
                                    <p>開始搜尋</p>
                                    <p>請輸入搜尋條件來尋找您想要的卡匣!</p>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
            
        </div>
    );
}

export default Home;