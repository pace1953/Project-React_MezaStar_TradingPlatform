import React, { createContext, useContext, useState, useEffect } from "react";

export const ContextAPI = createContext();

export const useContextAPI = () => {
    const context = useContext(ContextAPI);

    if (!context) {
        throw new Error('useContextAPI 必須在 ContextProvider 內使用');
    }
    return context;
}

export const ContextProvider = ({ children }) => {

    // Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [registermodalIsOpen, setRegisterModalIsOpen] = useState(false);
    const [sellmodalIsOpen, setSellModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const openRegisterModal = () => setRegisterModalIsOpen(true);
    const closeRegisterModal = () => setRegisterModalIsOpen(false);
    const openSellModal = () => setSellModalIsOpen(true);
    const closeSellModal = () => setSellModalIsOpen(false);
    const openMyCardsModal = () => setMyCardsModalIsOpen(true);
    const closeMyCardsModal = () => {
        setMyCardsModalIsOpen(false);
        setEditingCard(null);
        setEditForm({
            cardName: '',
            series: '',
            starLevel: '',
            price: '',
            quantity: ''
        });
    };

    // 登入, 註冊
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ username: '', password: '', email: '' });

    // 獲得使用者名稱(登入按鈕旁邊就可以顯示使用者名稱)
    const [currentUser, setCurrentUser] = useState({ username: '' });

    // 響應式漢堡
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 卡匣資料
    const [cards, setCards] = useState([]);
    const [searchForm, setSearchForm] = useState({series: '', starLevel: '', cardName: ''});
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // 賣卡匣
    const [sellForm, setSellForm] = useState({cardName: '', series: '', starLevel: '', price: '', quantity: ''});

    // 顯示使用者的卡匣
    const [myCardsmodalIsOpen, setMyCardsModalIsOpen] = useState(false);
    const [myCards, setMyCards] = useState([]);
    const [editingCard, setEditingCard] = useState(null);
    const [editForm, setEditForm] = useState({
        cardName: '',
        series: '',
        starLevel: '',
        price: '',
        quantity: ''
    });


    // 紀錄搜尋後的狀態
    const [hasSearched, setHasSearched] = useState(false);

    // 購物車狀態
    const [cartItems, setCartItems] = useState([]);

    // 訂單的狀態
    const [buyerOrder, setBuyerOrder] = useState([]);
    const [sellerOrder, setSellerOrder] = useState([]);

    // 買賣家訂單的視窗狀態
    const [activeTab, setActiveTab] = useState('buyer');

    // 訂單的交易狀態
    const [selectedStatus, setSelectedStatus] = useState('all');


    useEffect(() => {
        // 檢查登入狀態
        checkLoginStatus();
    }, []);

    useEffect(() => {
        // 如果為登入狀態 -> 則顯示購物車內的資訊
        if(isLoggedIn){
            handleLoadCartItems();
        }else{
        // 如果不是登入狀態 -> 則不顯示購物車資訊
            setCartItems([]);
        }
    }, [isLoggedIn]);

    // -- 登入用 ----------------------------------------------------------------------
    // 檢查登入狀態(是否已經登入)

    const checkLoginStatus = async () => {
        try {
            // 先檢查登入狀態
            const res = await fetch('http://localhost:8888/rest/check-login', {
                method: 'GET',
                credentials: 'include'
            });

            const resData = await res.json();
            setIsLoggedIn(resData.data);
            
            // 如果已登入，再獲取使用者資訊
            if (resData.data) {
                const userRes = await fetch('http://localhost:8888/rest/user-info', {
                    method: 'GET',
                    credentials: 'include'
                });
                const userResData = await userRes.json();

                if (userResData.status === 200 && userResData.data) {
                    setCurrentUser({ username: userResData.data.userName });
                }
            }
        }catch (err) {
            setIsLoggedIn(false);
            setCurrentUser({ username: '' });
        }
    };

    // 登入表單資料狀態改變
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        // 只變更該欄位資料, 其他欄位仍保持原資料狀態
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    // 登入
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await fetch('http://localhost:8888/rest/login', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(loginForm)
        });

        const resData = await res.json();
        if (res.ok && resData.status === 200) {
            alert('登入成功');
            setIsLoggedIn(true);
            // 再檢查一次登入狀態 -> 以獲取使用者名稱
            await checkLoginStatus();
            closeModal();
        } else {
            alert('登入失敗：' + resData.message);
        }
        } catch (err) {
        alert('登入錯誤: ' + err.message);
        }
    };

    // 註冊
    const handleRegisterSubmit = async (e) => {
    e.preventDefault();
        try{
            const res = await fetch('http://localhost:8888/rest/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(registerForm)
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('註冊成功，請登入');
                closeRegisterModal();
                openModal();
            } else {
                alert('註冊失敗：' + resData.message);
            }
        } catch (error) {
            console.error('註冊請求失敗:', error);
            alert('註冊失敗：網路錯誤');
        }
    };

    // 登出
    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:8888/rest/logout', {
                method: 'GET',
                credentials: 'include'
            });
            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert(resData.message);
                setIsLoggedIn(false);
            } else {
                alert('登出失敗：' + resData.message);
            }
        } catch (err) {
            alert('登出錯誤: ' + err.message);
        }
    }
    
    // 新增註冊表單的資料狀態改變
    const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    };

   // Modal資料 -------------------------------------------------------------------

    // 關閉登入的Modal，開啟註冊的Modal
    const handleRegisterModalOpen = () => {
        closeModal();
        openRegisterModal();
    }
    // 關閉註冊的Modal，開啟登入的Modal
    const handleLoginModalOpen = () => {
        closeRegisterModal(); 
        openModal();
    }

    // 如果登入狀態為true，則會打開sell_modal; false則會顯示請使用者先登入
    const handleSellModal = () => {
        if (isLoggedIn) {
            openSellModal();
        } else {
            alert('請先登入');
            openModal();
        }
    }   

    // 如果登入狀態為true，則會顯示我的訂單/購物車頁面; false則會顯示請使用者先登入
    const handleCheckLogin = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert('請先登入');
            openModal();
        }
    }


    // 卡匣資料 ----------------------------------

    // 載入所有上架中的卡匣
    const loadAvailableCards = async () => {
        try {
            const res = await fetch('http://localhost:8888/rest/cards', {
                method: 'GET',
                credentials: 'include'
            });
            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                setCards(resData.data);
            }
        } catch (err) {
            console.error('載入卡匣失敗:', err);
        }
    };

    // 搜尋表單資料變更
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({ ...prev, [name]: value }));
    };

    // 多條件搜尋
    const searchByMultipleCriteria = async (searchCriteria) => {
        try {
            const params = new URLSearchParams();
            
            // 過濾並添加有效的搜尋參數
            Object.entries(searchCriteria).forEach(([key, value]) => {
                if (key === 'minPrice' || key === 'maxPrice') {
                    // 確保價格是有效的數字且大於0
                    const numValue = parseInt(value);
                    if (!isNaN(numValue) && numValue > 0) {
                        params.append(key, numValue.toString());
                    }
                } else if (value !== null && value !== undefined && value !== '' && value !== 0) {
                    params.append(key, value);
                }
            });
            
            const url = `http://localhost:8888/rest/cards/search-multiCondition?${params.toString()}`;
            
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });
            
            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                setCards(resData.data);
                setHasSearched(true); // 設置已搜尋狀態
            } else {
                console.error('搜尋失敗:', resData.message);
                setCards([]);
                setHasSearched(true); // 設置已搜尋狀態
            }
        } catch (err) {
            console.error('搜尋失敗:', err);
            setCards([]);
            setHasSearched(true); // 設置已搜尋狀態
        }
    };

    // 執行搜尋
    const handleSearch = async (e) => {
        e.preventDefault();
        const minPriceNum = minPrice ? parseInt(minPrice) : null;
        const maxPriceNum = maxPrice ? parseInt(maxPrice) : null;
        if (minPriceNum !== null && maxPriceNum !== null && minPriceNum > maxPriceNum) {
        alert('最低價不能大於最高價');
        return;
        }
        
        const searchCriteria = {
            series: searchForm.series,
            starLevel: searchForm.starLevel,
            keyword: searchForm.cardName,
            minPrice: minPrice,
            maxPrice: maxPrice
        };
        
        // 檢查是否有任何搜尋條件
        const hasSearchCriteria = Object.values(searchCriteria).some(value => 
            value !== null && value !== undefined && value !== '' && value !== 0
        );
        
        if (hasSearchCriteria) {
            await searchByMultipleCriteria(searchCriteria);
        }else{
            alert('請至少填寫一個搜尋條件');
            return;
        }
    };

    // 重置搜尋
    const resetSearch = () => {
        setSearchForm({ series: '', starLevel: '', cardName: '' });
        setMinPrice('');
        setMaxPrice('');
        setCards([]); // 清空卡匣列表
        setHasSearched(false); // 重置搜尋狀態
    };

    // 購物車-------------------------------------------------

    // 加入購物車
    const addToCart = async (cardId) => {
        if (!isLoggedIn) {
            alert('請先登入');
            openModal();
            return;
        }

        try {
            const res = await fetch('http://localhost:8888/rest/cart', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId: cardId,
                    quantity: 1
                })
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('已加入購物車');
            } else {
                // 如果嘗試加自己的商品，就會跳錯誤訊息(後端ㄉ錯誤訊息)
                alert(resData.message);
            }
        } catch (err) {
            alert('加入購物車錯誤: ' + err.message);
        }
    };

    // 讀取使用者的購物車(GET)
    const handleLoadCartItems = async () => {
        try {
            const res = await fetch('http://localhost:8888/rest/cart', {
                method: 'GET',
                credentials: 'include'
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                setCartItems(resData.data);
            } else {
                console.error('載入購物車失敗:', resData.message);
            }
        } catch (err) {
            console.error('載入購物車錯誤:', err);
        }
    }

    // 使用者更新購物車數量(POST)
    const handleUpdateCartItem = async (cartId, quantity) => {
        if (!isLoggedIn) {
            alert('請先登入');
            openModal();
            return;
        }

        try {
            const res = await fetch(`http://localhost:8888/rest/cart/${cartId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('購物車更新成功');
                // 重新載入購物車
                handleLoadCartItems();
            } else {
                alert('更新失敗：' + resData.message);
            }
        } catch (err) {
            alert('更新購物車錯誤: ' + err.message);
        }
    }

    // 使用者刪除購物車項目(DELETE)
    const handleDeleteCartItem = async (cartId) => {
        if (!isLoggedIn) {
            alert('請先登入');
            openModal();
            return;
        }

        try {
            const res = await fetch(`http://localhost:8888/rest/cart/${cartId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('購物車項目已刪除');
                // 重新載入購物車
                handleLoadCartItems();
            } else {
                alert('刪除失敗：' + resData.message);
            }
        } catch (err) {
            alert('刪除購物車項目錯誤: ' + err.message);
        }
    }

    // 使用者清空購物車(DELETE)
    const handleClearCart = async () => {
        if (!isLoggedIn) {
            alert('請先登入');
            openModal();
            return;
        }

        try {
            const res = await fetch('http://localhost:8888/rest/cart/clear', {
                method: 'DELETE',
                credentials: 'include'
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('購物車已清空');
                // 重新載入購物車
                handleLoadCartItems();
            } else {
                alert('清空購物車失敗：' + resData.message);
            }
        } catch (err) {
            alert('清空購物車錯誤: ' + err.message);
        }
    }

    // 結帳(並建立訂單)
    const handleCheckout = async () => {
        if (!isLoggedIn) {
            alert('請先登入');
            openModal();
            return;
        }

        try {
            const res = await fetch('http://localhost:8888/rest/orders/checkout', {
                method: 'POST',
                credentials: 'include'
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('結帳成功！');
                // 清空購物車
                handleClearCart();
            } else {
                alert('結帳失敗：' + resData.message);
            }
        } catch (err) {
            alert('結帳錯誤: ' + err.message);
        }
    }

    // 賣卡匣--------------------------------------------------
    // 販賣表單資料變更
    const handleSellFormChange = (e) => {
        const { name, value } = e.target;
        setSellForm(prev => ({ ...prev, [name]: value }));
    };

    // 提交販賣卡匣
    const handleSellSubmit = async (e) => {
        e.preventDefault();
        
        // 表單驗證
        if (!sellForm.cardName || !sellForm.series || !sellForm.starLevel || !sellForm.price || !sellForm.quantity) {
            alert('請填寫所有欄位');
            return;
        }
        
        if (parseInt(sellForm.price) <= 0) {
            alert('價格必須大於 0');
            return;
        }

        if(parseInt(sellForm.quantity) <= 0) {
            alert('數量必須大於 0');
            return;
        }
        
        try {
            const res = await fetch('http://localhost:8888/rest/cards', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardName: sellForm.cardName,
                    series: sellForm.series,
                    starLevel: sellForm.starLevel,
                    price: parseInt(sellForm.price),
                    quantity: parseInt(sellForm.quantity)
                })
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('卡匣上架成功！');
                closeSellModal();
                // 重置表單
                setSellForm({
                    cardName: '',
                    series: '',
                    starLevel: '',
                    price: '',
                    quantity: ''
                });
                // 重新載入卡匣列表
                loadAvailableCards();
            } else {
                alert('上架失敗：' + resData.message);
            }
        } catch (err) {
            alert('上架錯誤: ' + err.message);
        }
    };

    // 使用者販賣的卡匣資訊--------------------
    // 我的卡匣相關方法
    const handleLoadMyCards = async () => {
        if (!isLoggedIn) return;

        try {
            const res = await fetch('http://localhost:8888/rest/cards/myCards', {
                method: 'GET',
                credentials: 'include'
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                setMyCards(resData.data || []);
            } else {
                console.error('載入我的卡匣失敗:', resData.message);
                setMyCards([]);
            }
        } catch (err) {
            console.error('載入我的卡匣錯誤:', err);
            setMyCards([]);
        }
    };

    const handleMyCardsModal = () => {
        if (isLoggedIn) {
            handleLoadMyCards();
            openMyCardsModal();
        } else {
            alert('請先登入');
            openModal();
        }
    };

    const handleEditCard = (card) => {
        setEditingCard(card);
        setEditForm({
            cardName: card.cardName,
            series: card.series,
            starLevel: card.starLevel,
            price: card.price,
            quantity: card.availableQuantity || card.quantity 
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateCard = async (e) => {
        e.preventDefault();
        
        if (!editingCard) return;
        
        if (!editForm.cardName || !editForm.series || !editForm.starLevel || !editForm.price || !editForm.quantity) {
            alert('請填寫所有欄位');
            return;
        }
        
        if (parseInt(editForm.price) <= 0) {
            alert('價格必須大於 0');
            return;
        }

        if (parseInt(editForm.quantity) <= 0) {
            alert('數量必須大於 0');
            return;
        }
        
        try {
            const res = await fetch(`http://localhost:8888/rest/cards/${editingCard.cardId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardName: editForm.cardName,
                    series: editForm.series,
                    starLevel: editForm.starLevel,
                    price: parseInt(editForm.price),
                    quantity: parseInt(editForm.quantity),
                    availableQuantity: parseInt(editForm.quantity)
                })
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('卡匣更新成功！');
                setEditingCard(null);
                setEditForm({
                    cardName: '',
                    series: '',
                    starLevel: '',
                    price: '',
                    quantity: ''
                });
                // 重新載入我的卡匣
                handleLoadMyCards();
                
                // 如果有搜尋結果，也重新搜尋以更新顯示
                if (hasSearched) {
                    const searchCriteria = {
                        series: searchForm.series,
                        starLevel: searchForm.starLevel,
                        keyword: searchForm.cardName,
                        minPrice: minPrice,
                        maxPrice: maxPrice
                    };
                    
                    // 檢查是否有搜尋條件，如果有就重新搜尋
                    const hasSearchCriteria = Object.values(searchCriteria).some(value => 
                        value !== null && value !== undefined && value !== '' && value !== 0
                    );
                    
                    if (hasSearchCriteria) {
                        await searchByMultipleCriteria(searchCriteria);
                    }
                }
            } else {
                alert('更新失敗：' + resData.message);
            }
        } catch (err) {
            alert('更新錯誤: ' + err.message);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('確定要刪除這張卡匣嗎？')) {
            return;
        }
        
        try {
            const res = await fetch(`http://localhost:8888/rest/cards/${cardId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const resData = await res.json();
            if (res.ok && resData.status === 200) {
                alert('卡匣刪除成功！');
                // 重新載入我的卡匣
                handleLoadMyCards();
            } else {
                alert('刪除失敗：' + resData.message);
            }
        } catch (err) {
            alert('刪除錯誤: ' + err.message);
        }
    };

    // 訂單--------------------------------------------------
    // 買家訂單
    const handleBuyerOrders = async () => {
        if(!isLoggedIn) return;

        try {
            const res = await fetch('http://localhost:8888/rest/orders/buyer',{
                method: 'GET',
                credentials: 'include'
            });

            const resData = await res.json();
            if(res.ok && resData.status === 200){
                setBuyerOrder(resData.data || []);
            } else{
                alert('獲取買家訂單資料失敗:'+resData.message);
                setBuyerOrder([]);
            }
        } catch(err){
            alert('獲取買家訂單資料錯誤:'+err)
            setBuyerOrder([]);
        }
    } 

    // 賣家訂單
    const handleSellerOrders = async () =>{
        if(!isLoggedIn) return;

        try{
            let url = 'http://localhost:8888/rest/orders/seller';
            if(selectedStatus !== 'all'){
                url = `http://localhost:8888/rest/orders/seller/status/${selectedStatus}`;
            }

            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });

            const resData = await res.json();
            if(res.ok && resData.status === 200){
                setSellerOrder(resData.data || []);
            } else{
                alert('獲取賣家訂單資料失敗:'+resData.message);
                setSellerOrder([]);
            }
        } catch{
            alert('獲取賣家訂單資料錯誤:'+err)
            setSellerOrder([]);
        }
    }


    const value = {
        // 登入/註冊狀態
        isLoggedIn,
        setIsLoggedIn,
        loginForm,
        setLoginForm,
        registerForm,
        setRegisterForm,

        // 漢堡狀態
        isMenuOpen,
        setIsMenuOpen,

        // 使用者名稱狀態(顯示使用者名稱用ㄉ)
        currentUser,
        setCurrentUser,

        // 搜尋狀態
        hasSearched,
        setHasSearched,

        // Modal狀態
        modalIsOpen,
        setModalIsOpen,
        registermodalIsOpen,
        setRegisterModalIsOpen,
        sellmodalIsOpen,
        setSellModalIsOpen,

        // 購物車狀態
        cartItems,
        setCartItems,

        // 訂單狀態
        buyerOrder,
        setBuyerOrder,
        sellerOrder,
        setSellerOrder,
        activeTab,
        setActiveTab,
        selectedStatus,
        setSelectedStatus,

        // 賣家的卡匣資訊
        myCardsmodalIsOpen,
        setMyCardsModalIsOpen,
        myCards,
        setMyCards,
        editingCard,
        setEditingCard,
        editForm,
        setEditForm,

        // Modal方法
        openModal,
        closeModal,
        openRegisterModal,
        closeRegisterModal,
        openSellModal,
        closeSellModal,
        handleRegisterModalOpen,
        handleLoginModalOpen,
        handleSellModal,
        handleCheckLogin,

        // 卡匣資料
        cards,
        setCards,
        searchForm,
        setSearchForm,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        sellForm,
        setSellForm,

        // 卡匣方法
        loadAvailableCards,
        handleSearchChange,
        searchByMultipleCriteria,
        handleSearch,
        resetSearch,
        handleSellFormChange,
        handleSellSubmit,
        
        // 購物車方法
        addToCart,
        handleLoadCartItems,
        handleUpdateCartItem,
        handleDeleteCartItem,
        handleClearCart,
        // 購物車結帳(建立訂單)
        handleCheckout,

        // 登入(出)/註冊方法
        checkLoginStatus,
        handleLoginChange,
        handleLoginSubmit,
        handleRegisterChange,
        handleRegisterSubmit,
        handleLogout,

        // 訂單方法
        handleBuyerOrders,
        handleSellerOrders,

        // 賣家卡匣方法
        openMyCardsModal,
        closeMyCardsModal,
        handleLoadMyCards,
        handleMyCardsModal,
        handleEditCard,
        handleEditFormChange,
        handleUpdateCard,
        handleDeleteCard,


    };

    return (
        <ContextAPI.Provider value={value}>
            {children}
        </ContextAPI.Provider>
    );
}



