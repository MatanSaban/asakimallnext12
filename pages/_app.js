import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import { getCookie, setCookie } from 'cookies-next';
import { checkIfLoggedIn, userIdFromToken } from '../pages/api/functions'
import { useRouter } from 'next/router';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(0)
  const [storeData, setStoreData] = useState();
  const userToken = getCookie('userToken')
  const loggedIn = getCookie('loggedIn')
  const userCartCookie = getCookie('userCart');
  const [userCart, setUserCart] = useState([]);
  const [popup, setPopup] = useState(false);

  
  useEffect(() => {
    if (userToken && loggedIn && (!isLoggedIn || isLoggedIn == undefined) ) {
      console.log('hereeeeeeeeeeeeeeeee')
      try {
        userIdFromToken(userToken).then((res) => {
          console.log('res 1 from app')
          console.log(res)
          if (res.status === 200) {
            setLoading(false)
            setIsLoggedIn(true);
            if (userCartCookie) {
              const freshUserData = res.data;
              freshUserData.cart = JSON.parse(userCartCookie)
              setUserCart(JSON.parse(userCartCookie))
              setUserData(freshUserData);
            } else {
              setCookie('userCart', JSON.stringify([]))
            }
            
          }
        })
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    } else {
      if (userCartCookie) {
        setUserCart(JSON.parse(userCartCookie))
      } else {
        setCookie('userCart', userCartCookie)
      }
      setLoading(false)
    }
    if (!loggedIn) {
      if (router.route.includes('/my-account') || router.route.includes('/register/seller')) {
        router.push('/')
      }
    } else {
      if (!userData?.hasStore) {
        if (router.route.includes('/store-management') || router.route == '/register') {
          router.push('/my-account')
        } else if (router.route == '/register/completed') {
          setTimeout(() => {
            router.push('/my-account')
          }, 5000);
        }
      } else if (userData?.hasStore) {
        if (router.route.includes('/register/')) {
          router.push('/my-account/store-management')
        }
        axios.get(`/api/sellers/${userData.sellerId}`).then((res) => {
          if (res.status === 200) {
            const storeId = res.data.seller.storeId;
            if (storeId) {
              axios.get(`/api/stores/${storeId}`).then((res) => {
                if (res.status === 200) {
                  const newStoreData = res.data.store
                  // newStoreData.products = [];
                  setStoreData(newStoreData)
                }
              })
            }
          }
        })
      }
    }
   
  },[refreshData, userData])


  useEffect(() => {
    if (userToken && loggedIn && userData && !userData?.hasStore) {
      axios.get(`/api/users/${userData.id}`).then((res) => {
        if (res.status === 200) {
          setUserData(res.data.user)
        }
      })
    }
    if (userCartCookie) {
      setUserCart(JSON.parse(userCartCookie))
      setUserData({...userData, cart: JSON.parse(userCartCookie)})
    } else {
      setCookie('userCart', userCartCookie)
    }
  },[refreshData])

  useEffect(() => {
    if (userToken && loggedIn && userData && storeData) {
      axios.get(`/api/stores/${storeData.id}`).then((res) => {
        if (res.status === 200) {
          const store = res.data.store;
          setStoreData(store)
          axios.post(`/api/products/${store.id}`).then((res) => {
            if (res.status === 200) {
              const productsIdsArray = [];
              const products = res.data.data;
              if (products.length > 0) {
                products.forEach((product) => {
                  productsIdsArray.push(product.id)
                })
                setStoreData({...storeData, products: products});
                axios.put(`/api/stores/${store.id}`, {
                  productsIdsArray : productsIdsArray
                }).then((res) => {
                  if (res.status === 200) {
                    setStoreData(res.data.data);
                  }
                })
              }
            }
          })
        }
      })
    }
  },[refreshData])

  const setUserDataCB = (data) => {
    setUserData(data)
    if (data?.cart) {
      setUserCart(data?.cart)
    }
  }

  const handleLoggedInState = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  const refreshDataCB = () => {
    setRefreshData(refreshData + 1)
  }

  function addToCartCB(storeObject) {
    console.log('storeObject')
    console.log(storeObject)
    let existingStore = false;
    if (userCart?.length > 0) {
      existingStore = userCart.find((store) => store.storeId === storeObject.storeId);
    }
  
    if (existingStore) {
      const existingProduct = existingStore.products.find((product) => product.productId === storeObject.product.productId);
  
      if (existingProduct) {
        existingProduct.count += storeObject.product.count;
      } else {
        existingStore.products.push(storeObject.product);
      }
    } else {
      userCart?.push({
        storeId: storeObject.storeId,
        storeName: storeObject.storeName,
        storeDesign: storeObject.storeDesign,
        products: [storeObject.product]
      });
    }
    setCookie("userCart", userCart)
    setUserCart(userCart);
    setUserData({...userData, cart : userCart});
  }
  
  const [cartIcon, setCartIcon] = useState();

  const getCartIconRef = (cartIconRef) => {
    return setCartIcon(cartIconRef);
  }
  

  return (
    <>
    {loading ? '' : <Header setPopup={setPopup} storeData={storeData} getCartIconRef={getCartIconRef} refreshDataCB={refreshDataCB} userData={userData} setUserDataCB={setUserDataCB} handleLoggedInState={handleLoggedInState} isLoggedIn={isLoggedIn}/>}
      {popup && popup}
      { loading ? 'Loading' : 
        React.cloneElement(<Component {...pageProps} />, {
          setUserDataCB,
          handleLoggedInState,
          refreshDataCB,
          addToCartCB,
          setPopup,
          setStoreData,
          cartIcon,
          storeData,
          userData,
          isLoggedIn,
          ...pageProps
        })
      }  
      {loading ? '' : <Footer/>}
      
    </>
    
  )
}

export default MyApp
