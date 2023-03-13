import React, { useEffect } from 'react'

function MyAccountMain(props) {


  return (
    <div style={{textAlign:'center'}}>
      <h1>{props.title}</h1>
      <p style={{textAlign:'center'}}>
        היי {props.userData?.firstname}, ברוכים הבאים לעמוד החשבון שלך. 
        <br />
        כאן תוכל לשנות את פרטי החשבון,
        <br />
        לבדוק את מצב ההזמנות שלך {props.userData?.hasStore ? 'ולנהל את החנות שלך' : null}
      </p>
    </div>
  )
}

export default MyAccountMain
