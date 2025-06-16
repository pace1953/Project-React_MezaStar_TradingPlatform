import { Link } from "react-router-dom";

function Machine() {
  return (
    <div className="machine_container">
      <nav className="machine_navbar">
        <div className='title'><a href='/'><span>MezaStar卡匣交易平台</span></a></div>
        <button className='hamburger' onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>

      </nav>
      <h2>Machine Position</h2>
      <Link to="/">Home</Link>

    </div>
  );
}
export default Machine;