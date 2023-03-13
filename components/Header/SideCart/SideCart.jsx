import cookieCutter from "cookie-cutter";
import styles from './SideCart.module.scss'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import Popup from '../../General/Popup'
import { getCookie, setCookie } from 'cookies-next';
import Link from "next/link";
function SideCart(props) {

    const [popup, setPopup] = useState(false);

    const showCart = props?.showCart;
    const handleCart = () => props?.handleCart();
    const isLoggedIn = props?.isLoggedIn;
    let userCart = null
    if (isLoggedIn) {
        userCart = props?.userCart;
    } else {
        userCart = cookieCutter.get('userCart')
    }

    const getStoreSum = (store) => {
        let sum = 0
        if (store) {
            console.log('store')
            console.log(store)
            store.products.map((product) => {
                return sum += parseInt(product.price) * parseInt(product.count)
            })
        }
        return sum; 
    }

    const getTotalSum = () => {
        let sum = 0;
        props?.userCart.map((store) => {
            sum += parseInt(getStoreSum(store));
        })
        return sum.toLocaleString(undefined, {maximumFractionDigits:2}); 
    }

    const deleteStore = (e, storeId, storeName) => {
        const currentCart = props?.userCart;
        let newCart = []; 
        
        currentCart.forEach((store) => {
            if (store.storeId !== storeId) {
                newCart.push(store)
            }
        })
        setTimeout(() => {
            setCookie("userCart", newCart);
            props.updateCart(newCart);
            setPopup(<Popup content={'הוסר בהצלחה'} show={false}/>);
            
        }, 2000);
        setTimeout(() => {
            setPopup(false); 
        }, 2500);
    }

    const deleteProduct = (storeId, productId) => {
        const currentCart = props?.userCart;
        let newCart = [];
        let newStore;
        currentCart.forEach((store, i) => {
            if (store.storeId !== storeId) {
                newCart.push(store)
            } else {
                if (store.products.length === 1) {
                    setPopup(<Popup content={<p>מסיר את החנות מהעגלה</p>} show={true}/>);
                    deleteStore('', storeId, store.storeName);
                } else {
                    newStore = store;
                    newStore.products.forEach((product,index) => {
                        if (product.productId == productId) {
                            newStore.products.splice(index, 1);
                        }
                    })
                    newCart.push(newStore);
                    setCookie("userCart", newCart);
                    props.updateCart(newCart);        
                }
            }
        })
    }

    const deleteStoreQ = (e, storeId, storeName) => {
        const deleting = <p>מסיר את החנות מהעגלה</p>
        const deleteQ = 
        <>
            <h3>להסיר את כל המוצרים של {storeName}</h3>
            <div>
                <button onClick={() => {
                    deleteStore(e, storeId, storeName);
                    setTimeout(() => {
                        setPopup(<Popup content={deleting} show={false}/>);
                    }, 500);
                    setTimeout(() => {
                        setPopup(<Popup content={deleting} show={true}/>);
                    }, 1000);
                }}>כן</button>
                <button onClick={() => {
                    setPopup(<Popup content={deleteQ} show={false}/>);
                    setTimeout(() => {
                        setPopup(false)
                    }, 500);
                }}>לא</button>
            </div>
        </>
        setPopup(<Popup content={deleteQ} show={true}/>)
    }


    useEffect(() => {

    },[props])

    return (
        <div id={styles.popUpWrapper} className={[`${showCart ? styles.showCart : styles.hideCart}`]}>
            {popup}
            <div onClick={() => handleCart()} className={styles.background}></div>
            <div id={styles.cartPopup} className={`${showCart ? styles.showCart : styles.hideCart}`}>
                <button onClick={() => handleCart()} className={styles.closeButton}>X</button>
                <h3>העגלה שלי</h3>
                <div className={styles.stores}>
                    {
                        props?.userCart?.map((store) => {
                            return (
                                <div key={store.storeId} className={styles.store} style={{backgroundColor:store?.storeDesign?.cartColors?.cartStoreBgColor, color:store?.storeDesign?.cartColors?.cartTextColor}}>
                                    <h4>שם החנות: {store.storeName}</h4>
                                    <p>סה&quot;כ מחיר השקית : {getStoreSum(store).toLocaleString(undefined, {maximumFractionDigits:2})} ₪</p>
                                    <button onClick={(e) => {deleteStoreQ(e, store.storeId, store.storeName)}}>X</button>
                                    {store.products.map((product) => {
                                        return (
                                            <div key={product.productId} className={styles.product} style={{backgroundColor:store.storeDesign.cartColors.cartProductsBgColor, color:store.storeDesign.cartColors.cartProductTextColor}}> 
                                                <button onClick={() => deleteProduct(store.storeId,product.productId)} className={styles.removeProduct}>X</button>
                                                <div className={styles.productImageAndName}>
                                                    {product.image && <Image src={product.image} width={50} height={50} alt={`${product.productName} image`} />}
                                                    <h4>{product.productName}</h4>
                                                </div>
                                                <div className={styles.productPriceAndAmount}>
                                                    <p>מחיר יח&apos;: {product.price.toLocaleString(undefined, {maximumFractionDigits:2})} ₪</p>
                                                    <p>כמות: {product.count}</p>
                                                    <p>סה&quot;כ: {(product.price * product.count).toLocaleString(undefined, {maximumFractionDigits:2})} ₪</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })
                    }
                </div>
                <p>סה&quot;כ מחיר העגלה : {getTotalSum().toLocaleString(undefined, {maximumFractionDigits:2})} ₪</p>
                <Link href={`/checkout`}><button onClick={() => handleCart()} className={styles.toPayment}>מעבר לתשלום</button></Link>
            </div>
        </div>
    )
}

export default SideCart