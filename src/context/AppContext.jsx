import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // --- Auth State ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ortho_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('ortho_token'));

  // --- Saved Items (Wishlist) State ---
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem('ortho_saved');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Enquiry Items (Cart) State ---
  const [enquiryItems, setEnquiryItems] = useState(() => {
    const items = localStorage.getItem('ortho_enquiry');
    return items ? JSON.parse(items) : [];
  });

  const wishlistCount = savedItems.length;
  const cartCount = enquiryItems.length;

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('ortho_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('ortho_token', authToken);
      return;
    }
    localStorage.removeItem('ortho_token');
  }, [authToken]);

  useEffect(() => {
    localStorage.setItem('ortho_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('ortho_enquiry', JSON.stringify(enquiryItems));
  }, [enquiryItems]);

  // --- Handlers ---
  const login = (userData, token = null) => {
    setUser(userData);
    if (token) {
      setAuthToken(token);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  const toggleSaved = (productId) => {
    setSavedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToEnquiry = (product) => {
    setEnquiryItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromEnquiry = (productId) => {
    setEnquiryItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearEnquiry = () => {
    setEnquiryItems([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authToken,
        login,
        logout,
        savedItems,
        wishlistCount,
        toggleSaved,
        enquiryItems,
        cartCount,
        addToEnquiry,
        removeFromEnquiry,
        clearEnquiry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
