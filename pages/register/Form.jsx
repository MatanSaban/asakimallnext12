import React from 'react'

function Form(props) {
    return (
            <form onSubmit={props?.handleSubmit}>
                <h3>טופס הרשמת לקוחות</h3>
                <div>
                    <div>
                        <label htmlFor="firstname">שם פרטי</label>
                        <input type="text" name='firstname' id='firstname' required onChange={(e) => props?.handleField(e)} />
                    </div>
                    <div>
                        <label htmlFor="lastname">שם משפחה</label>
                        <input type="text" name='lastname' id='lastname' required onChange={(e) => props?.handleField(e)} />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="email">כתובת דואר אלקטרוני</label>
                        <input type='email' name='email' id='email' required onChange={(e) => props?.handleField(e)} />
                    </div>
                    <div>
                        <label htmlFor="mobilephone">טלפון נייד</label>
                        <input type="number" name='mobilephone' id='mobilephone' required onChange={(e) => props?.handleField(e)} />
                    </div>
                </div> 
                <div>
                    <div>
                        <label htmlFor="password">סיסמא</label>
                        <input style={props?.fieldError ? { borderColor: "red" } : {}} type='password' name='password' id='password' required onChange={(e) => props?.handleField(e)} />
                    </div>
                    <div>
                        <label htmlFor="passwordConfirmation">אימות סיסמא</label>
                        <input style={props?.fieldError ? { borderColor: "red" } : {}} type="password" name='passwordConfirmation' id='passwordConfirmation' required onChange={(e) => props?.handleField(e)} />
                    </div>
                </div>
                <button type="submit">הרשמה</button>
            </form>

    )
}

export default Form