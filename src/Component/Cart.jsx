import { Link, useLocation } from 'react-router-dom';
import '../Css/Cart.css';
import { useContextAPI } from '../Context/ContextAPI';
import { useEffect } from 'react';

function Cart() {
  const { 
    isLoggedIn,
    isMenuOpen, 
    setIsMenuOpen, 
    currentUser,
    cartItems,
    setCartItems,
    handleLoadCartItems,
    handleUpdateCartItem,
    handleDeleteCartItem,
    handleClearCart,
    handleCheckout,
    handleCheckLogin
  } = useContextAPI();

const location = useLocation();

// 透過ReactRouter的useLocation監聽 -> 每次進入購物車頁面都重新載入
useEffect(() => {
  if(isLoggedIn){
    handleLoadCartItems();
  }
},[location.pathname, isLoggedIn]) // 監聽路由的變化和登入狀態


  // 購物車的邏輯 ------------------------

  // 購物車內的商品數量變更
  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) { // 如果數量小於1，則不允許更新
      alert('商品數量不能小於1');
      return; 
    }
    await handleUpdateCartItem(cartId, newQuantity);
  };

  // 刪除購物車內的商品
  const handleDeleteItem = async (cartId) => {
    if (window.confirm('確定要刪除此商品嗎？')) {
      await handleDeleteCartItem(cartId);
    }
  };

  // 清空購物車
  const handleClearCartItems = async () => {
    if (window.confirm('確定要清空購物車嗎？')) {
      await handleClearCart();
      setCartItems([]);
    }
  };

  // 計算購物車內的總價
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const subtotal = Number(item.subtotal) || 0;
      return total + subtotal;
    }, 0);
  };

  return (
    <div className="cart_container">
      <nav className="cart_navbar">
        <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
        <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>

        <div className={`cart_navbar_container ${isMenuOpen ? 'menu-open' : ''}`}>
          <ul className='cart_nav_menu'>
            <li className='cart_menu_list'><Link className='home-page-links' to='/'>首頁</Link></li>
            <li className='cart_menu_list'><Link className='myorder-page-links' to='/myorders' onClick={(e) => handleCheckLogin(e)}>我的訂單</Link></li>
            <li className='cart_menu_list'><Link className='cart-page-links'>購物車</Link></li>
            <li className='cart_menu_list'><Link className='machine-position-page-links' to='/machine-position'>機台位置</Link></li>
          </ul>
        </div>

        <div className='cart_user_info'>
          {isLoggedIn ? (
              <a className='username'>{currentUser.username}的購物車</a>
          ) : (
              <a className='username'>請先登入</a>
          )}
        </div>
      </nav>

      <div className='cart_content_container'>
        <div className='cart_content'>
          <h2>購物車</h2>
          
          {isLoggedIn ? (
            cartItems.length > 0 ? (
              <div className='cart_items_container'>
                <div className='cart_items'>
                  {cartItems.map((item) => (
                    <div key={item.cartId} className='cart_item'>
                      <div className='cart_item_info'>
                        <h3>{item.cardName || '未知商品'}</h3>
                        <p>系列: {item.series || '未知'}</p>
                        <p>星級: {item.starLevel || '未知'}</p>
                        <p>賣家: {item.sellerName || '未知'}</p>
                        <p>單價: NT$ {(item.cardPrice || 0).toLocaleString()}</p>
                      </div>

                      <div className='cart_item_quantity_controls'>
                        <div className='cart_item_quantity'>
                          <div className='quantity_controls'>
                            <button className='quantity_button_decrease'
                              onClick={() => handleQuantityChange(item.cartId, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 0) <= 1}>
                                -
                            </button>
                            <span className='quantity_display'>{item.quantity || 0}</span>
                            <button className='quantity_button_increase'
                              onClick={() => handleQuantityChange(item.cartId, (item.quantity || 0) + 1)}>
                              +
                            </button>
                          </div>
                        </div>

                        <div className='cart_item_total'>
                          小計: NT$ {(item.subtotal || 0).toLocaleString()}
                        </div>

                        <button className='cart_item_remove_button'
                          onClick={() => handleDeleteItem(item.cartId)}>
                          移除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='cart_item_summary'>
                  <div className='cart_item_total_price'>
                    <h3>總計: NT$ {calculateTotalPrice().toLocaleString()}</h3>
                  </div>

                  <div className='cart_item_clearAndcheckout'>
                    <button className='cart_item_clear_button'
                      onClick={handleClearCartItems}>
                      清空購物車
                    </button>
                    <button className='cart_item_checkout_button'
                      onClick={handleCheckout}>
                      結帳
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className='cart_isEmpty'>
                <p>您的購物車目前是空的</p>
                <Link to='/' className='cart_continue_shopping'>繼續購物</Link>
              </div>
            )
          ) : (
            <div className='cart_login_toHome'>
              <p>請先登入查看購物車內容。</p>
              <Link to='/' className='cart_continue_shopping'>回到首頁登入</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;