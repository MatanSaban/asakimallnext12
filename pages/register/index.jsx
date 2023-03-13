import styles from './register.module.scss'
import { useRouter } from 'next/router';
import React, { useState } from "react";
import Form from "./Form";
import axios from 'axios';
import { setCookie } from 'cookies-next';

function UserRegisterPage(props) {
    const router = useRouter();

    const [userRegister, setUserRegister] = useState({
        email: "",
        mobilephone: "",
        firstname: "",
        lastname: "", 
        password: "",
        profileimage: "",
        coverimage: "",
        hasStore: false,
        setToken: true,
        cart: [],
        fullOrdersIds: [],
    });
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [fieldError, setFieldError] = useState(false);
    const [canSend, setCanSend] = useState(true);
    const [loading, setLoading] = useState(false)

    const handleField = (e) => {
        // console.log(e)
        const target = e.target;
        const fieldName = target.name;
        const fieldInput = target.value;

        // password confirmation
        if (fieldName == "password") {
            if (fieldInput === passwordConfirm && fieldInput.length > 0) {
                setUserRegister({ ...userRegister, [fieldName]: fieldInput });
                setFieldError(false);
                setCanSend(true);
            } else {
                setUserRegister({ ...userRegister, [fieldName]: fieldInput });
                setFieldError(true);
                setCanSend(false);
            }
        } else if (fieldName == "passwordConfirmation") {
            if (fieldInput === userRegister.password && fieldInput.length > 0) {
                setPasswordConfirm(fieldInput);
                setUserRegister({ ...userRegister, password: fieldInput });
                setCanSend(true);
                setFieldError(false);
            } else {
                setPasswordConfirm(fieldInput);
                setFieldError(true);
                setCanSend(false);
            }
        } else {
            setUserRegister({ ...userRegister, [fieldName]: fieldInput });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        let userId = ''
        let sellerId = ''
        canSend && axios.post(`/api/users`,userRegister).then((res) => {
            console.log('res from register')
            console.log(res)
                if (res.status === 200) {
                    console.log('res 2')
                    console.log(res)
                    userId = res.data.data.id;
                    sellerId = res.data.id     
                    axios.put(`/api/users/${userId}`, {setToken:true}).then((res) => {
                        if (res.status === 200) {
                            console.log('res 3')
                            console.log(res)
                            setLoading(false);
                            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                            setCookie('userToken', res.data.token, expires);
                            setCookie('loggedIn', true, expires);            
                            props.setUserDataCB(res.data.user);
                            router.push('/my-account');
                        }
                    })                       
                }
            })
    };

    // const loginUser = () => {
    //     const email = userRegister.email;
    //     const password = userRegister.password;
    //     const result = authenticateUser(email, password);
    //     return result;
    // };

    return (
        <main className={styles.registerPage}> 
            <h1>הרשמה לעסקימול</h1> 
            <p>
                בעמוד זה תוכל/י להירשם כלקוח/ה לאתר עסקימול ולהינות מהטבות השמורות
                ללקוחות האתר בלבד!
                <br />
                במידה וברצונך להירשם כמוכר/ת ולפתוח חנות באתר, יש להירשם תחילה
                כלקוח/ה ולאחר מכן תיפתח האפשרות.
            </p>
            <div className={styles.formWrapper}>
                <Form
                    handleSubmit={handleSubmit}
                    handleField={handleField}
                    fieldError={fieldError}
                />
            </div>
            {loading && <span>רושמים אותך...</span>}
        </main>
    );
}

export default UserRegisterPage;
