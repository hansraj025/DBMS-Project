import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch cart items when the component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        
        // Get the token from localStorage (or any other source)
        const token = localStorage.getItem("token"); // Replace with your method of storing the token

        // If token is not found, handle the error
        if (!token) {
          setError("Authentication token is missing.");
          setLoading(false);
          return;
        }

        // Send the token in the headers of the GET request
        const response = await axios.get("http://localhost:3001/carts/getitems", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token as Authorization header
          },
        });
        
        setCartItems(response.data || []);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to fetch cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Handle item removal
  const removeItem = async (cartItemID) => {
    try {
        console.log(cartItemID);
      // Get the token from localStorage (or any other source)
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      // Send the token in the headers of the POST request
      
      const response = await axios.post(
        "http://localhost:3001/carts/removeitem",
        { cartItemID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.cartItemID !== cartItemID)
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing cart item:", error);
      setError("Failed to remove cart item.");
    }
  };

  // Render cart items with book details
  const renderCartItems = () => {
    return cartItems.map((item) => (
      <div key={item.cartItemID} style={styles.cartItem}>
        <h3>{item.bookTitle}</h3>
        <p>Quantity: {item.quantity}</p>
        <p>Price: {item.price}</p>
        <button
          style={styles.removeButton}
          onClick={() => removeItem(item.cartItemID)}
        >
          Remove
        </button>
      </div>
    ));
  };

  return (
    <div style={styles.container}>
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading cart items...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : cartItems.length > 0 ? (
        renderCartItems()
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  cartItem: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  },
  removeButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default Cart;
