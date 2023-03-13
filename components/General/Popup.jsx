import React, { useEffect, useState } from 'react'
import styles from './popup.module.scss'

const Popup = (props) => {

    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        setShowPopup(props.show)
    },[props])

  return (
    <>
        {
        <div className={showPopup ? styles.popupWrapper : `${styles.popupWrapper} ${styles.closePopupWrapper}`}>
            <div className={showPopup ? `${styles.popup}` : `${styles.popup} ${styles.closePopup}`} style={props?.styles}>
                {props?.content}
            </div>
        </div>
        }
    </>
  )
}

export default Popup
