'use client'
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import React, { useState } from 'react'
import styles from './LoginPopup.module.scss';
import axios from 'axios';
import { getCookie, setCookie, deleteCookie  } from 'cookies-next';



function LoginPopup(props) {


    const [showPassword, setShowPassword] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState('notyet')
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const email = e.target[0].value
        const password = e.target[1].value
        let userData;
        try {
            await axios.post(`/api/signin/${email}`, {
                password: password
            }).then(async(res) => {
                const userId = res.data.id;
                userData = res.data;
                await axios.put(`/api/users/${userId}`, {
                    setToken: true
                }).then((res) => {
                        console.log("res")
                        console.log(res)
                        setLoading(false)
                        setIsLoggedIn(true)
                        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                        setCookie('userToken', res.data.token, expires);
                        setCookie('loggedIn', true, expires);
                        setTimeout(() => {
                            props.handlePopup(false)
                            props.checkLoggedInUser(true)
                            props.setUserDataCB(userData)
                        }, 1500);
                    })
                })
            } catch (error) {
                setLoading(false)
                setIsLoggedIn(false)
        }
    }

    return (
        <div className={`${styles.popupModal} ${styles.loginPopup} ${props.popupOn ? ` ${styles.showPopup}` : `${styles.hidePopup}`}`}>
            <div className={styles.popupBackground} onClick={() => props.handlePopup(false)}></div>
            <div className={`${styles.popupContent} ${props.popupOn ? `${styles.showPopup}` : `${styles.hidePopup}`}`} onClick={() => props.handlePopup(true)}>
                <button className={styles.closePopup} onClick={() => props.handlePopup(false)}>X</button>
                <h3>התחברות</h3>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <div>
                            <label htmlFor="email">אימייל</label>
                            <input type="email" name='email' id='email' />
                        </div>
                        <div>
                            <label htmlFor="password">סיסמא</label>
                            <input type={showPassword ? 'text' : 'password'} name='password' id='password' />
                            <i onClick={() => setShowPassword(!showPassword)}>{showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}</i>
                        </div>
                    </div>
                    <button type='submit'>התחברות</button>
                    {loading && <span>מאמת נתונים..</span>}
                    {isLoggedIn == true && <p>התחברת בהצלחה</p>}
                    {isLoggedIn == false && <p>שם המשתמש או הסיסמא אינם נכונים</p>}
                </form>
            </div>
        </div>
    )
}

export default LoginPopup