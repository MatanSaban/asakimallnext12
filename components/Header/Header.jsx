import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import styles from './Header.module.scss'
import LoginPopup from './LoginPopup/LoginPopup'
import SideCart from './SideCart/SideCart'
import Logo from '../../public/static/media/Logo.svg'
import { getCookie, setCookie, deleteCookie  } from 'cookies-next';


const Header = (props) => {

    const onlyForLoggedInUsersArray = [
      '/my-account',
      '/register/seller'
    ]
    const onlyForNotLoggedInUsersArray = [
        '/register'
    ]


    const [showPopup, setShowPopup] = useState(false);
    const [popupOn, setPopupOn] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
    const [cartPopup, setCartPopup] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [userData, setUserData] = useState(props.userData);

    const handleCart = (bool) => {
      if (bool === false) {
          setShowCart(false)
          setTimeout(() => {
              setCartPopup(false)
          }, 600);
      } else {

          if (cartPopup) {
              setShowCart(false)
              setTimeout(() => {
                  setCartPopup(false)
              }, 600);
          } else {
              setCartPopup(true)
              setTimeout(() => {
                  setShowCart(true)
              }, 400);
          }
      }
    }
    const checkLoggedInUser = (bool) => {
        bool ? setIsLoggedIn(true) : setIsLoggedIn(false)
    }
    const handlePopup = (bool) => {
        bool ?
            setTimeout(() => {
                setShowPopup(true);
                setTimeout(() => {
                    setPopupOn(true)
                }, 500);
            }, 0)
            :
            setTimeout(() => {
                setPopupOn(false)
                setTimeout(() => {
                    setShowPopup(false)
                }, 500);
            }, 0);
    }
    const logout = () => {
        deleteCookie('loggedIn')
        deleteCookie('userToken')

        props.handleLoggedInState();
        props.setUserDataCB(null)
        props.refreshDataCB()

    }
    const cartIconRef = useRef();


    useEffect(() => {
        setIsLoggedIn(props.isLoggedIn);
        props.getCartIconRef(cartIconRef.current);
    },[props.isLoggedIn])

    const getProductsCount = () => {
        let count = 0;
        if (props?.userData?.cart?.length > 0) {
            props.userData.cart.forEach((store) => {
                store?.products?.forEach((product) => {
                    // console.log(product)
                    count += product.count; 
                })
            })
        }
        return count
    }

    const updateCart = (newCart) => {
        let newUserData = props.userData;
        newUserData.cart = newCart;
        setUserData(newUserData);
        props.setUserDataCB(newUserData);
    }


  return (
    <div className={styles.headerWrapper}>
            {showPopup && <LoginPopup setUserDataCB={props.setUserDataCB} handlePopup={handlePopup} popupOn={popupOn} checkLoggedInUser={checkLoggedInUser} />}
            {cartPopup && <SideCart handleCart={handleCart} isLoggedIn={props?.isLoggedIn} showCart={showCart} userCart={props?.userData?.cart} updateCart={updateCart}/>}
              <header className={`${styles.header} header`}>
                    <div className={styles.mobileMenu}>
                        <span className={`${styles.line} ${styles.line1}`}></span>
                        <span className={`${styles.line} ${styles.line2}`}></span>
                        <span className={`${styles.line} ${styles.line3}`}></span>
                    </div>
                    <div className={styles.LogoDiv}>
                        <Link onClick={() => handleCart(false)} href="/"><Image src={Logo} alt="logo" /></Link>
                    </div>
                    <nav>
                        <ul>
                            <li onClick={() => handleCart(false)}><Link href="/">ראשי</Link></li>
                            <li onClick={() => handleCart(false)}><Link href="/stores">חנויות</Link></li>
                            <li onClick={() => handleCart(false)}><Link href="/products">מוצרים</Link></li>
                            <li onClick={() => handleCart(false)}><Link href="/floors">קומות הקניון</Link></li>
                        </ul>
                    </nav>
                    <div className={styles.userDiv}>
                        {!isLoggedIn ?
                            <div className={styles.loginAndRegister}>
                                <Link onClick={() => handleCart(false)} href="register"><button>הרשמה</button></Link>
                                <button onClick={() => handlePopup(true)}>התחברות</button>
                            </div>
                            :
                            <div className={styles.loggedinUser}>
                                {!props?.userData?.hasStore ? <Link href='/register/seller'><button className={styles.openStore}>פתיחת חנות</button></Link>
                                :
                                <Link href='/my-account/store-management'><button className={styles.storeManagment}>ניהול החנות</button></Link>
                                }
                                
                                <Link onClick={() => handleCart(false)} href='/my-account'><button>החשבון שלי</button></Link>
                                <button className={styles.logoutButton} onClick={() => logout()}>התנתקות</button>
                            </div>
                        }
                        <button ref={cartIconRef} onClick={() => handleCart()} className={`${styles.cartIcon} cartIcon`}><AiOutlineShoppingCart />
                            <span>{getProductsCount()}</span>
                        </button>
                    </div>
              </header>
        </div>
  )
} 

export default Header
