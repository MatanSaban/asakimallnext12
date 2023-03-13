import React, { useEffect, useState } from 'react'

const StoreButton = (props) => {

  const [styles, setStyles] = useState({
    backgroundColor:props?.shopData.storeDesign.shop.phone.buttonBgColor,
    color:props?.shopData.storeDesign.shop.phone.buttonTextColor,
  })

        let style = {
            backgroundColor:props?.shopData.storeDesign.shop.phone.buttonBgColor,
            color:props?.shopData.storeDesign.shop.phone.buttonTextColor,
        }

        let hoverStyle = {
            backgroundColor:props?.shopData.storeDesign.shop.phone.buttonBgColorHover,
            color:props?.shopData.storeDesign.shop.phone.buttonTextColorHover,
        }

        useEffect(() => {
          let newStyles = {
            backgroundColor: props.shopData.storeDesign.shop.phone.buttonBgColor,
            color: props.shopData.storeDesign.shop.phone.buttonTextColor,
          }
          setStyles(newStyles)
        },[props])

  return (
    <button style={styles} 
    onMouseEnter={() => {
      setStyles(hoverStyle)
    }}
    onMouseLeave={() => {
      setStyles(style)
    }}
    
    >כניסה לחנות</button>
  )
}

export default StoreButton
