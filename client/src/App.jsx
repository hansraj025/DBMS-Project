
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Footer from './components/shared/Footer';


const App = () => {

  return (
      <Router>
        <Navbar />
        <div className="pt-16">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
        <Footer />
      </Router>
  );
};

export default App;