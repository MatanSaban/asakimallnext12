import React, { useState } from 'react'

function Form(props) {
    const categories = props?.categories


    const checkFields = (e) => {
        let currVal = e.target.value;
        const newVal = currVal.trim()
        if (e.target.name === 'slug') {
            let newString = e.target.value.replaceAll(/ /g, "")
            e.target.value = newString.toLowerCase();
        } else {
            e.target.value = newVal;
        }

        props?.handleField(e)
    }
    

    return (
        
            <form onSubmit={props?.handleSubmit}>
                <h3>טופס פתיחת החנות שלך</h3>
                <div>
                    <div>
                        <label htmlFor="name">שם החנות</label>
                        <input type="text" name='name' id='name' placeholder='לדוגמא: החנות של שלומי' required onBlur={(e) => checkFields(e)} />
                    </div>
                    <div>
                        <label htmlFor="slug">כתובת החנות</label>
                        <input dir='ltr' type="text" name='slug' id='slug' placeholder='shlomistore' required onBlur={(e) => checkFields(e)} />
                    </div>
                </div>
                <div>
                    {/* <div>
                        <label htmlFor="coverImage">תמונת קאבר לחנות</label>
                        <button>בחירת תמונה</button>
                        <input type='hidden' name='coverImage' id='coverImage' onChange={(e) => props.handleField(e)} />
                    </div> */}
                    <div style={{width:'100%'}}>
                        <label htmlFor="mobilephone">בחירת קטגורית חנות</label>
                        <select required name="categoryId" id="categoryId" onChange={(e) => props?.handleField(e)}>
                            <option selected disabled value="">בחירת קטגוריה</option>
                        {
                            categories && categories?.map((category) => {
                                return (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                            })
                        }
                        </select>
                    </div>
                </div>
                <button type="submit">פתיחת חנות</button>
            </form>

    )
}

export default Form