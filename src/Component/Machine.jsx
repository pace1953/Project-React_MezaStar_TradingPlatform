import { Link } from "react-router-dom";
import '../Css/Machine.css';
import { useContextAPI } from "../Context/ContextAPI";

function Machine() {
  const{
    setIsMenuOpen,
    isMenuOpen,
    handleCheckLogin,
    isLoggedIn,
    currentUser,
  } = useContextAPI();


  return (
    <div className="mac_container">
        <nav className="mac_navbar">
            <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
                <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>

                <div className={`mac_navbar_container ${isMenuOpen ? 'menu-open' : ''}`}>
                  <ul className='mac_nav_menu'>
                      <li className='mac_menu_list'><Link className='home_page_links' to='/'>首頁</Link></li>
                      <li className='mac_menu_list'><Link className='myorder_page_links' to='/myorders' onClick={(e) => handleCheckLogin(e)}>我的訂單</Link></li>
                      <li className='mac_menu_list'><Link className='cart_page_links' to='/cart' onClick={(e) => handleCheckLogin(e)}>購物車</Link></li>
                      <li className='mac_menu_list'><Link className='machine_position_page_links' to='/machine-position'>機台位置</Link></li>
                  </ul>
              </div>

              <div className='mac_user_info'>
                {isLoggedIn ? (
                    <a className='username'>Hi, {currentUser.username}</a>
                ) : (
                    <a className='username'>HI, 使用者</a>
                )}
              </div>
        </nav>
        
        <div className="mac_map_container">
            <div>
                <iframe 
                    src="https://www.google.com/maps/d/embed?mid=1P5i95AJDSdOFORq7UZdCDR3fefAplMQ&ehbc=2E312F" 
                    width="100%" 
                    height="480"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MezaStar 位置地圖"
                    />
            </div>
        </div>

    </div>
  );
}
export default Machine;