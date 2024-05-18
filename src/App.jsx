import { RouterProvider } from "react-router-dom";
import { CartContext, CartContextProvider } from "./Components/Web/Context/FeatureCart.jsx";
import { router } from './Layouts/Router.jsx';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./Components/Web/Context/FeatureUser.jsx";
import { BsWhatsapp } from "react-icons/bs";
import './App.css'

export default function App() {
  let { setUserToken } = useContext(UserContext);
  let { getCartContext, setCount, count } = useContext(CartContext);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('userToken') != null) {
      setUserToken(localStorage.getItem('userToken'));
      setCount(getCartContext().count);
    }
  }, []);

  const handleMouseEnter = () => {
    setShowMessage(true);
  };

  const handleMouseLeave = () => {
    setShowMessage(false);
  };

  return (
    <div>
      <a
        href="https://wa.me/972568642671"
        className="position-fixed bottom-0 end-0 me-2 mb-3 bg-colorx position-absolute text-white rounded-circle p-3 whatsapp-hover"
        target="_blank" // This ensures it opens in a new tab
        rel="noopener noreferrer" // This improves security
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <BsWhatsapp className="" />
        {showMessage && (
          <div className="message-box dir">
            مرحباً، كيف يمكننا مساعدتك؟
          </div>
        )}
      </a>
      <RouterProvider router={router} />

    </div>
  );
}
