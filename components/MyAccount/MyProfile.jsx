import { emailOrPhoneExistCheck, updateUser } from '../../pages/api/functions';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from './myProfile.module.scss'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useRouter } from 'next/router';
import MyAccountMain from './MyAccountMain';
import { setCookie } from 'cookies-next';


function MyProfile(props) {

  const router = useRouter();

  const [userProperties, setUserProperties] = useState({
    firstname: props?.userData?.firstname ? props?.userData?.firstname : '',
    lastname: props?.userData?.lastname ? props?.userData?.lastname : '',
    email: props?.userData?.email ? props?.userData?.email : '',
    mobilephone: props?.userData?.mobilephone ? props?.userData?.mobilephone : '',
  });
  const [error, setError] = useState(["",""]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [passwordsMatch, setPasswordsMatch] = useState();
  const [canSend, setCanSend] = useState(false);
  const [showPass, setShowPass] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)

  useEffect(() => {
    if (userProperties.firstname !== '' && userProperties.lastname !== '' && userProperties.email !== '' && userProperties.mobilephone !== '') {
      setCanSend(true)
    } else {
      setCanSend(false)
    }
    if (changePassword) {
      if (userProperties?.password === passwordConfirm && passwordConfirm !== '') {
        setPasswordsMatch(true)
        setCanSend(true)
      } else {
        setPasswordsMatch(false)
        setCanSend(false)
      }
    }
  },[changePassword, passwordConfirm, passwordsMatch, canSend, userProperties?.password ,userProperties?.firstname ,userProperties?.lastname ,userProperties?.email ,userProperties?.mobilephone ])

  const handleFields = (e) => {
    console.log(e)
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    
    setUserProperties({ ...userProperties, [fieldName]: fieldValue });
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (userProperties.email !== props.userData.email || userProperties.mobilephone !== props.userData.mobilephone) {
      const res = await emailOrPhoneExistCheck(userProperties.email,userProperties.mobilephone)
      const existQuery = res;
      // check if email or phone exist, server response
      if (existQuery && existQuery.length) {
        setLoading(false)
        existQuery.forEach((err) => {
          if (err === 'email') {
            if (userProperties.email !== props.userData.email) {
              setError([error[0] = "כתובת האימייל שהזנת קיימת במערכת", error[1] = error[1]])
            }
          } 
          if (err === 'phone') {
            if (userProperties.mobilephone !== props.userData.mobilephone) {
              setError([error[1] = "מספר הטלפון שהזנת קיים במערכת", error[0] = error[0]])
            }
          }
        })
        setSuccess(false)
      } else { // reset the States
        setError(["",""]);
      }

    }
    setError(["",""]);
    // all good here
    
    const update = await updateUser(props.userData.id,{...userProperties, setToken: true});
    const isSuccess = await update.data
    const token = await update.token
    const user = await update.user
    if (isSuccess === 'SUCCESS') {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setCookie('userToken', token, expires);
      setLoading(false)
      setSuccess(true)
      props.setUserDataCB(user)
      setTimeout(() => {
        props.setChildCB(<MyAccountMain userData={props?.userData} title={'החשבון שלי'}/>)
      }, 1000);
    } else {
      setLoading(false)
      setSuccess(false)
      setError(["שגיאת שרת",""]);
    }
  }

  const handleChangePassword = (e) => {
    e.preventDefault();
    setChangePassword(!changePassword)
    if (!changePassword) {
      console.log('now true')
    } else {
      console.log('now false')
      if (userProperties.firstname !== '' && userProperties.lastname !== '' && userProperties.email !== '' && userProperties.mobilephone !== '') {
        setCanSend(true)
      }
      let newProperties = userProperties;
      Object.keys(newProperties).forEach((property) => {
        if (property == 'password') {
          delete(newProperties[property])
        }
      })
      console.log(newProperties)
      
      setUserProperties(newProperties);
    }
  }

  return (
    <div className={styles.MyProfile}>
      <h1>{props?.title}</h1> 
      <div className={styles.formWrapper}>
        <form onSubmit={(e) => canSend && handleSubmit(e)}>
          <div className='section'>
            <div>
              <label htmlFor="firstname">שם פרטי</label>
              <input type="text" name="firstname" id="firstname" defaultValue={props?.userData?.firstname} onChange={(e) => {handleFields(e)}}/>
            </div>
            <div>
              <label htmlFor="lastname">שם משפחה</label>
              <input type="text" name="lastname" id="lastname" defaultValue={props?.userData?.lastname} onChange={(e) => {handleFields(e)}}/>
            </div>
          </div>
          <div className='section'>
            <div>
              <label htmlFor="email">אימייל</label>
              <input type="email" name="email" id="email" defaultValue={props?.userData?.email} onChange={(e) => {handleFields(e)}}/>
            </div>
            <div>
              <label htmlFor="mobilephone">טלפון נייד</label>
              <input type="number" name="mobilephone" id="mobilephone" defaultValue={props?.userData?.mobilephone} onChange={(e) => {handleFields(e)}}/>
            </div>
          </div>
          <div className={`${styles.changePassQuery} section`}>
            <div style={{width:'100%'}}>
              <label htmlFor="">שינוי סיסמא</label>
              <button onClick={(e) => {setUserProperties({...userProperties, password:''}),handleChangePassword(e)}}>שינוי סיסמא</button>
            </div>
          </div>
          {changePassword && 
            <div className={styles.section}>
              <div>
                <label htmlFor="password">סיסמא חדשה</label>
                <input style={passwordsMatch ? {} : {border:'2px solid red', outline:'red'}} name="password" type={showPass ? 'text' : 'password'} onChange={(e) => setUserProperties({...userProperties, [e.target.name] : e.target.value})} />
                {!showPass ? <i onClick={() => setShowPass(true)}><AiOutlineEye/></i> : <i onClick={() => setShowPass(false)}><AiOutlineEyeInvisible/></i>}
              </div>
              <div>
                <label htmlFor="passwordConfirm">אימות סיסמא חדשה</label>
                <input style={passwordsMatch ? {} : {border:'2px solid red', outline:'red'}} name='passwordConfirm' type={showPassConfirm ? 'text' : 'password'} onChange={(e) => setPasswordConfirm(e.target.value)} />
                {!showPassConfirm ? <i onClick={() => setShowPassConfirm(true)}><AiOutlineEye/></i> : <i onClick={() => setShowPassConfirm(false)}><AiOutlineEyeInvisible/></i>}
              </div>
            </div>
          }
          {canSend ? <button type="submit">שמירה</button> : <button style={{background:'red'}} disabled type="submit">שמירה</button>}
        </form>
        {loading && <p className='loadingP'>טוען...</p>}
        {!loading && success && <p className='successP'>השינויים נשמרו בהצלחה! <br /> הינך מועבר/ת לעמוד החשבון הראשי</p>}
        {!loading && error && error.length > 0 && 
        error.map((errorText, index) => {
          return (
            <p key={index} className='errorP'>{errorText}</p>
          )
        })
        }
      </div>
    </div>
  )
}

export default MyProfile
