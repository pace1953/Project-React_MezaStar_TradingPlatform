import { Link } from 'react-router-dom';

function Cart() {
  return (
    <div>
      <h2>Cart</h2>
      <p>Your cart is empty.</p>
      <Link to='/'>首頁</Link>
    </div>
  );
}
export default Cart;