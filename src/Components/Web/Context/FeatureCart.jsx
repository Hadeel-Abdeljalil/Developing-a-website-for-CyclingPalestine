import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext(null);

export function CartContextProvider({ children }) {
    let [count, setCount] = useState(0);
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartCleared, setCartCleared] = useState(false);
    let [quantity, setQuantity] = useState(0);

    const toastConfig = {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    };

    const addToCartContext = async (productId) => {
        try {
            const token = localStorage.getItem('userToken');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}cart/create`, { productId }, { headers: { Authorization: `Rufaidah__${token}` } });

            if (data.message === 'product added to cart' || data.message === 'success' ) {
                toast.success('تم إضافة المنتج بنجاح على السلة', toastConfig);
            }

            setCount(prevCount => prevCount + 1);
            setCart(data);
            setCartItems(data);
            return data;
        } catch (error) {
            if (error.response?.status === 401) {
                toast.info('تمت إضافة المنتج مسبقاً لزيادة الكمية الرجاء زيارة عربة التسوق', toastConfig);
            } else {
                console.error(error);
            }
        }
    };

    const getCartContext = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}cart`, { headers: { Authorization: `Rufaidah__${token}` } });

            setCount(data.numberOfProducts);
            setCart(data.finalProductsList);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCartContext = async (productId) => {
        try {
            const token = localStorage.getItem('userToken');
            const {data} = await axios.patch(`${import.meta.env.VITE_API_URL}cart/remove/${productId}`, {}, 
                { headers: { Authorization: `Rufaidah__${token}` } });

                if(data.message === "product removed"){
                    toast.success("تم  حذف المنتج بنجاح")
                }
            setCount(prevCount => prevCount - 1);
            setCart(null);
            setCartItems(data.cart);
            
            return data;
        } catch (error) {
            console.error(error);
        }
    };
    

    const clearCartContext = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}cart/clear`, {}, 
            { headers: { Authorization: `Rufaidah__${token}` } });

            setCount(0);
            setCart(null);
            setCartItems([]);
            setCartCleared(true);
            toast.warn('تم تفريغ السلة', toastConfig);
            return data;
        } catch (error) {
            console.error(error);
            setCartCleared(false);
        }
    };

    const increaseQuantityContext = async (productId) => {
        try {
            const token = localStorage.getItem('userToken');
            const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}cart/increaseQuantity`, { productId }, { headers: { Authorization: `Rufaidah__${token}` } });

            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const decreaseQuantityContext = async (productId) => {
        try {
            const token = localStorage.getItem('userToken');
            const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}cart/decreaseQuantity`, { productId }, { headers: { Authorization: `Rufaidah__${token}` } });

            setQuantity(prevQuantity => prevQuantity - 1);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const calculateTotalPriceContext = async () => {
        try {
            const cart = await getCartContext();
            return cart.reduce((total, product) => total + product.details.price * product.quantity, 0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ addToCartContext, getCartContext, removeFromCartContext, cart, setCart, count, setCount, clearCartContext, increaseQuantityContext, decreaseQuantityContext, calculateTotalPriceContext }}>
            {children}
        </CartContext.Provider>
    );
}
