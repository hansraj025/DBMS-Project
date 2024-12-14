import { useState, useEffect } from 'react';
import BookCard from '../components/shared/BookCard';
import axios from 'axios';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const booksPerPage = 9;

    useEffect(() => {
    const fetchBooks = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:3001/books`, {
                params: {
                    page: currentPage,
                    limit: booksPerPage,
                },
            });
            // const data = await response.json();
            // console.log(data);
            setBooks(response.data);
            console.log(response.data);
            setTotalPages(Math.ceil(response.data.total/booksPerPage));
        } catch (err) {
            console.log("Failed to fetch books: ", err);
        } finally {
            setLoading(false);
        }
    };

        fetchBooks();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="text-center py-10">Loading books...</div>; //skeleton component
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map((book) => (
                <BookCard key={book.bookID} book={book} />
                ))}
            </div>
            <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-2 rounded-md ${
                        currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {page}
                </button>
                ))}
            </div>
        </div>
    );
};

export default Home;