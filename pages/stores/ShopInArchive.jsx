import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import StoreButton from '../../components/General/StoreButton'
import styles from './shopInArchive.module.scss'


const ShopInArchive = (props) => {

    const shopData = props?.shopData; 
    const [category, setCategory] = useState();

    // const { category } = await getCategoryById(shopData?.categoryId)
    // const { products } = await getProductsByStoreId(shopData.id)

    // const categoryName = category.name;

    useEffect(() => {
        axios.get(`/api/categories/${shopData?.categoryId}`).then((res) => {
            setCategory(res.data.category)
        })
    },[])




    return (
        <>
            {shopData?.storeDesign?.shop && <div className={`${styles.shop}`}>
                <div className={`${styles.phone}`} style={{backgroundColor:shopData?.storeDesign?.shop?.phone?.bgColor ,borderColor:shopData?.storeDesign?.shop?.phone?.borderColor}}>
                    <div className={`${styles.pergula}`}>
                        <div className={`${styles.pergula_up}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}>
                            <div className={`${styles.wineRed}`} ></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} ></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} ></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} ></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} ></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} ></div>
                        </div>
                        <div className={`${styles.pergula_down}`}>
                            <div className={`${styles.wineRed}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}></div>
                            <div className={`${styles.offWhite}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorTwo}}></div>
                            <div className={`${styles.wineRed}`} style={{backgroundColor:shopData.storeDesign.shop.pergulaColors.colorOne}}></div>
                        </div>
                    </div>
                    <div className={`${styles.shopData}`} style={{color:shopData.storeDesign.shop.phone.textColor}}>
                        {shopData?.coverImage &&<Image width={300} height={150} src={shopData?.coverImage} alt='shop cover image' />}
                        <h2>{shopData?.name}</h2>
                        <div className='shopData_category'>קטגוריה:{category?.name} </div>
                        <div className='shopData_productsCount'>מוצרים בחנות: {shopData?.productsIdsArray?.length}</div>
                        <p>היי, אני מתן ואני מעצב תכשיטים בעבודת יד</p>
                    </div>
                    <div className={`${styles.storeButton}`} >
                        <Link href={`/stores/${shopData?.slug}`}><StoreButton shopData={shopData}/></Link>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default ShopInArchive