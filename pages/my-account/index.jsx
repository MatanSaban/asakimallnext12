import Link from 'next/link'
import React, { useState } from 'react'
import MyAccountMain from '../../components/MyAccount/MyAccountMain.jsx'
import MyProfile from '../../components/MyAccount/MyProfile.jsx'
import MyOrders from '../../components/MyAccount/MyOrders/MyOrders.jsx'
import ActiveOrders from '../../components/MyAccount/MyOrders/ActiveOrders.jsx'
import CompletedOrders from '../../components/MyAccount/MyOrders/CompletedOrders.jsx'
import Loader from '../../components/MainLoader/Loader.jsx'
import styles from './myAccount.module.scss'

const MyAccount = (props) => {

    const [loading, setLoading] = useState(false);
    const [childPage, setChildPage] = useState(<MyAccountMain userData={props?.userData} title={'החשבון שלי'}/>);

    const setChildCB = (childComponent) => {
        props.refreshDataCB()
        setChildPage(childComponent); 
    }

  return (
    <div className={styles.MyAccountLayout}>
        {loading ? <Loader/> :
            <>
                <aside>
                    <h3>תפריט החשבון שלי</h3>
                    <ul>
                        <li>
                            <button onClick={() => setChildPage(<MyAccountMain userData={props?.userData} title={'החשבון שלי'}/>)}>ראשי</button>
                        </li>
                        <li>
                            <button onClick={() => setChildPage(<MyProfile setUserDataCB={props.setUserDataCB} setChildCB={setChildCB} userData={props?.userData} title={'הפרופיל שלי'}/>)}>הפרופיל שלי</button>
                        </li>
                        {props?.userData?.hasStore && 
                            <li>
                                <Link className="MyStoreManagement" href={'/my-account/store-management'}><button>ניהול החנות שלי</button></Link>
                            </li>
                        }
                        <li>
                            <button onClick={() => setChildPage(<MyOrders title={'ההזמנות שלי'}/>)}>ההזמנות שלי</button>
                                <ul>
                                    <li>
                                        <button onClick={() => setChildPage(<ActiveOrders title={'הזמנות פעילות'}/>)}>הזמנות פעילות</button>
                                    </li>
                                    <li>
                                        <button onClick={() => setChildPage(<CompletedOrders title={'הזמנות שהושלמו'}/>)}>הזמנות שהושלמו</button>
                                    </li>
                                </ul>
                        </li>
                    </ul>
                </aside>
                <main>
                    {childPage}
                </main>
            </>
        }
</div>
  )
}

export default MyAccount
