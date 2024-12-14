import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import img from "./../../assets/images/book.jpg";
import { handleError, handleSuccess } from '../../utils';

const BookCard = ({ book}) => { // Pass userId as a prop
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    console.log(quantity);

    if (!token) {
     handleError('User is not authenticated. Please log in.');
    }
    try {
      const response = await axios.post('http://localhost:3001/carts/additem', {
        bookID: book.bookID, // Assuming bookID comes from the book object
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(response);
    handleSuccess(`${book.bookTitle} added to cart successfully!`);
    
    } catch (error) {
      console.error('Error adding to cart:', error);
      handleError('Failed to add item to cart. Please try again.')
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        className="w-full h-60 object-cover"
        src={img}
        alt={book.bookTitle}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{book.bookTitle}</h3>
        <p className="text-gray-600 mb-2">Rating: {book.rating}/5</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="number"
              className="border rounded w-16 p-1 text-center"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default BookCard;
