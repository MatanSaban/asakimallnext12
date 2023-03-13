import React, { useEffect, useState } from 'react'
import SellersForm from './SellersForm'
import axios from 'axios';
import styles from './sellerRegister.module.scss'
import { useRouter } from 'next/router'; 



function SellerRegisterPage(props) {
    const router = useRouter();

    const [categories, setCategories] = useState();
    const [storeFields, setStoreFields] = useState({  
        name: '',
        slug: '',
        categoryId: '',
    });
    const [loading, setLoading] = useState();
    const [redirectUser, setRedirectUser] = useState(false)

    useEffect(() => {
        if (redirectUser) {
            props.refreshDataCB()
            router.push('/my-account/store-management') 
        }
    },[redirectUser])


    const handleField = (e) => {
        const fieldName = e.target.name;
        let fieldInput = e.target.value
        if (fieldName === 'slug') {
            fieldInput = fieldInput.replaceAll(/ /g, "")
        }
        setStoreFields({ ...storeFields, [fieldName]: fieldInput });
    }

    useEffect(() =>{
        const getCategories = async () => {
            const res = await fetch('/api/categories/');
            const {categories} = await res.json();
            setCategories(categories)
        }
        getCategories();
    },[])


    const handleSubmit = (e) => {
        e.preventDefault();
        const userId = props.userData.id
        let sellerId = '';
        let storeId = '';
        
        axios.put(`/api/users/${userId}`, {
            hasStore : true,
            role : 'SELLER' 
        }).then((res) => { 
            if (res.status === 200) {
                console.log('res 0')
                console.log(res)
                setLoading('צובעים את הקירות של החנות החדשה שלך')
                axios.post(`/api/sellers/`, {usersId : userId}).then((res) => {
                    if (res.status === 200) {
                        console.log('res 1')
                        console.log(res)
                        sellerId = res.data.data.id; 
                        setLoading('מנקים את החנות')
                        axios.post(`/api/stores`, {
                            "published":false,
                            "name":storeFields.name,
                            "slug":storeFields.slug,
                            "sellersId":sellerId,
                            "categoryId":storeFields.categoryId,
                            "storeDesign": {
                                "cartColors": {
                                    "cartProductTextColor":"#000000",
                                    "cartProductsBgColor":"#ededed",
                                    "cartStoreBgColor":"#ffffff",
                                    "cartTextColor":"#000000"
                                },
                                "shop": {
                                    "pergulaColors": {
                                        "colorOne": "#c33c3c",
                                        "colorTwo": "#ffffff",
                                    }, 
                                    "phone": {
                                        "bgColor": "#ffffff",
                                        "borderColor": "#000000",
                                        "buttonBgColor": "#fcbd35",
                                        "buttonBgColorHover": "#dea52b",
                                        "buttonTextColor": "#000000",
                                        "buttonTextColorHover": "#ffffff",
                                        "textColor": "#000000",
                                    }
                                }
                            }
                        }).then((res) => {
                            setLoading('תולים את השלט')
                            console.log('res 2')
                            console.log(res)
                            storeId = res.data.data.id;
                            // console.log(res)
                            axios.put(`/api/sellers/${sellerId}`, {storeId : storeId}).then((res) => {
                                if (res.status === 200) {
                                console.log('res 3')
                                console.log(res)
                                setLoading('פותחים את הדלת של החנות')
                                    console.log('res 3')
                                    console.log(res)
                                    axios.put(`/api/users/${userId}`, {sellerId: sellerId}).then((res) => {
                                        console.log('res 4')
                                        console.log(res)
                                        setLoading('החנות שלך מוכנה, מיד מעבירים אותך לעמוד הניהול')   
                                        props.refreshDataCB();     
                                        setTimeout(() => {
                                            setRedirectUser(true)
                                        }, 1500);
                                    // end
                                    // dont forget to check if is not successful, if so, remove setting from previous api calls         
                                    })
                                }
                            })
                        })
                    }
                })
            }
        })


        
    }


    return (
        <main className={styles.SellerRegisterPage}>
            <div>
                <h1>פתיחת חנות בעסקימול</h1>
                <p>
                    ברוך הבא לפתיחת החנות שלך בעסקימול! 
                    <br />
                    מלא/י את הטופס הקצר ולחץ/י על פתיחת חנות 
                    <br />
                    לאחר מכן ייפתחו לך אפשרויות ניהול החנות המלאות הכוללות <br />
                    הוספת וניהול מוצרים, פרסום החנות באתר, ניהול ערכת צבעי החנות ועוד.. <br />
                    אז למה את/ה מחכה? בהצלחה!
                </p>
            </div>
            <div className={styles.formWrapper}>
                <SellersForm handleSubmit={handleSubmit} handleField={handleField} categories={categories}/>
            </div>
            {loading && loading}
        </main>
    )
}

export default SellerRegisterPage 