import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-md  shadow-md transition-all duration-300">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-900">
              Bookstore
          </Link>


        <div className="flex items-center space-x-6">

           <button onClick={openModal} className="text-gray-700 hover:text-gray-900">
            About Us
          </button>

          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        About Our Bookstore
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                        Welcome to our bookstore! We offer a wide variety of books for all interests. Our mission is to make reading accessible and enjoyable for everyone.
                        </p>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          <button onClick={()=>navigate('/login')} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Login
            </button>

            <button onClick={()=>navigate('/signup')} className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              Sign Up
            </button>
        </div>


        <div className="flex items-center space-x-6">

          <Link to="/cart" className="text-gray-700 hover:text-gray-900">
            Cart
          </Link>

          <Link to="/orders" className="text-gray-700 hover:text-gray-900">
            Orders
          </Link>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;