import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styles from './storeDesign.module.scss'
import LOGO from '../../../public/static/media/Logo.svg'
import ShopInArchive from '../../../pages/stores/ShopInArchive'
import Link from 'next/link';
import axios from 'axios';
import StoreButton from '../../General/StoreButton';
import Popup from '../../General/Popup';

const StoreDesign = (props) => {

	const [storeDesign, setStoreDesign] = useState({
		...props?.storeData?.storeDesign
	});

	const [popup, setShowPopup] = useState();
	const [loading, setLoading] = useState(false);


  const handleColorSelector = (e) => { 
    const color = e.target.value;
	const fieldName = e.target.name
	const section = e.target.closest('.section').getAttribute("name");
	const storeDesignObj = storeDesign;
	if (section === 'shop') {
		const property = e.target.getAttribute('settingGroup')
		if (property === 'products') {
			storeDesignObj[section][property][fieldName] = e.target.value;
			setStoreDesign({...storeDesignObj});
		} else {
			storeDesignObj[section][property][fieldName] = color;
			setStoreDesign({...storeDesignObj});
		}
	} else {
		storeDesignObj[section][fieldName] = color;
		setStoreDesign({...storeDesignObj});
	}
  }

  const handleSubmit = () => {
	setLoading(true)
	axios.put(`/api/stores/${props.storeData.id}`, {	
		storeDesign: storeDesign
	}).then((res) => {
		if (res.status === 200) {
			setLoading(false)
			setShowPopup(<Popup content={'השינויים נשמרו בהצלחה'} styles={{color:'black', backgroundColor:'white'}} show={true}/>);
			setTimeout(() => {
				setShowPopup(<Popup content={'השינויים נשמרו בהצלחה'} styles={{color:'black', backgroundColor:'white'}} show={false}/>)
			}, 1000);
			setTimeout(() => {
				props.setChild('StoreMain')
			}, 1500);

		}
	})
  }

  useEffect(() => {
	console.log('use effect happned')
  },[storeDesign])

  return (
    <div>
		{popup}
		<h1>{props.title}</h1>
		<div className={styles.pageContent}>
			<div className={`${styles.section} section`} name="cartColors">
				<h2>צבעי החנות בעגלה</h2>
				<div>
					<div>
					<h3>צבע הרקע</h3>
					<div className={styles.input}>
						<label htmlFor="cartStoreBgColor">בחירת צבע</label>
						<input defaultValue={props?.storeData?.storeDesign.cartColors.cartStoreBgColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartStoreBgColor" id="cartStoreBgColor" />
					</div>
					</div>
				<div>
					<h3>צבע הטקסט</h3>
					<div className={styles.input}>
						<label htmlFor="cartTextColor">בחירת צבע</label>
						<input defaultValue={props?.storeData?.storeDesign.cartColors.cartTextColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartTextColor" id="cartTextColor" />
					</div>
				</div>
				<div>
					<h3>צבע רקע מוצר</h3>
					<div className={styles.input}>
						<label htmlFor="cartProductsBgColor">בחירת צבע</label>
						<input defaultValue={props?.storeData?.storeDesign.cartColors.cartProductsBgColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartProductsBgColor" id="cartProductsBgColor" />
					</div>
				</div>
				<div>
					<h3>צבע טקסט מוצר</h3>
					<div className={styles.input}> 
						<label htmlFor="cartProductTextColor">בחירת צבע</label>
						<input defaultValue={props?.storeData?.storeDesign.cartColors.cartProductTextColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartProductTextColor" id="cartProductTextColor" />
					</div>
				</div>
			</div>
			<div className={`${styles.preview} ${styles.cartPreview}`}>
				<h3>תצוגה מקדימה</h3>
				<div style={{
				backgroundColor:props?.storeData?.storeDesign.cartColors.cartStoreBgColor,
				color:props?.storeData?.storeDesign.cartColors.cartTextColor,
				}} className={styles.store}>
					<h4>שם החנות: {props?.storeData?.name}</h4>
					<p>סה&quot;כ מחיר השקית: 2,200₪</p>
					<div style={{ 
						backgroundColor:props?.storeData?.storeDesign.cartColors.cartProductsBgColor,
						color:props?.storeData?.storeDesign.cartColors.cartProductTextColor
						}} className={styles.product}>
						<button className={styles.removeProduct}>X</button>
						<div className={styles.productImageAndName}>
							<Image src={LOGO} width={100} height={100} alt={`${''} תמונת מוצר`} />
						</div>
						<div className={styles.productPriceAndAmount}>
						<h4>{'שם המוצר'}</h4>
							<p>מחיר יח&apos;: {'1,100'} ₪</p>
							<p>כמות: 2</p>
							<p>סה&quot;כ: {'2,200'} ₪</p>
						</div>
					</div>
				</div>
			</div>
			</div>
			<div className={`${styles.section} section`} name='shop'>
			<h2>צבעי החנות באינדקס</h2>
			<div>
				<div className={styles.combinedInputs}>
					<h3>צבעי הפרגולה</h3>
					<div>
						<div>
							<div className={styles.input}>
								<label htmlFor="colorOne">צבע 1</label>
								<input defaultValue={props?.storeData?.storeDesign.shop.pergulaColors.colorOne} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='pergulaColors' name="colorOne" id="colorOne" />
							</div>
						</div>
						<div>
							<div className={styles.input}> 
								<label htmlFor="colorTwo">צבע 2</label>
								<input defaultValue={props?.storeData?.storeDesign.shop.pergulaColors.colorTwo} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='pergulaColors' name="colorTwo" id="colorTwo" />
							</div>
						</div>
					</div>
				</div>
				<div>
				<h3>צבע מסגרת פלאפון</h3>
					<div className={styles.input}> 
						<label htmlFor="phoneBorder">בחירת צבע</label>
						<input defaultValue={props?.storeData?.storeDesign.shop.phone.borderColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="borderColor" id="borderColor" />
					</div>
				</div>
				<div className={`${styles.combinedInputs}`}>
					<h3>כללי</h3>
					<div>
						<div className={styles.input}> 
							<label htmlFor="colorTwo">צבע רקע</label>
							<input defaultValue={props?.storeData?.storeDesign.shop.phone.bgColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="bgColor" id="bgColor" />
						</div>
						<div className={styles.input}> 
							<label htmlFor="colorTwo">צבע טקסט</label>
							<input defaultValue={props?.storeData?.storeDesign.shop.phone.textColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="textColor" id="textColor" />
						</div>
					</div>
				</div>
				<div className={`${styles.combinedInputs}`}>
					<h3>צבעי כפתור</h3>
					<div>
						<div className={styles.input}> 
							<label htmlFor="buttonBgColor">רקע כפתור</label>
							<input defaultValue={props?.storeData?.storeDesign.shop.phone.buttonBgColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="buttonBgColor" id="buttonBgColor" />
						</div>
						<div className={styles.input}> 
							<label htmlFor="buttonTextColor">טקסט כפתור</label>
							<input defaultValue={props?.storeData?.storeDesign.shop.phone.buttonTextColor} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="buttonTextColor" id="buttonTextColor" />
						</div>
					</div>
					<div>
						<div className={styles.input}> 
							<label htmlFor="buttonBgColorHover">במעבר</label>
							<input defaultValue={props?.storeData?.storeDesign.shop.phone.buttonBgColorHover} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="buttonBgColorHover" id="buttonBgColorHover" />
						</div>
						<div className={styles.input}> 
							<label htmlFor="buttonTextColorHover">במעבר</label>
							<input defaultValue={props?.storeData?.storeDesign.shop.phone.buttonTextColorHover} onChange={(e) => handleColorSelector(e)} type="color" settingGroup='phone' name="buttonTextColorHover" id="buttonTextColorHover" />
						</div>
					</div>
				</div>
			</div>
			<div className={`${styles.preview} ${styles.storePreview}`}>
				<h3>תצוגה מקדימה</h3>
				<div className={`${styles.shop}`}>
					<div className={`${styles.phone}`} style={{borderColor:storeDesign.shop.phone.borderColor, backgroundColor:storeDesign.shop.phone.bgColor}}>
						<div className={`${styles.pergula}`}>
							<div className={`${styles.pergula_up}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}>
								<div className={`${styles.wineRed}`}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`}></div>
							</div>
							<div className={`${styles.pergula_down}`}>
								<div className={`${styles.wineRed}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}></div> 
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div> 
								<div className={`${styles.wineRed}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div>
								<div className={`${styles.wineRed}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}></div>
								<div className={`${styles.offWhite}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorTwo}}></div> 
								<div className={`${styles.wineRed}`} style={{backgroundColor:storeDesign.shop.pergulaColors.colorOne}}></div>
							</div>
						</div>
						<div className={`${styles.shopData}`} style={{backgroundColor:storeDesign.shop.phone.bgColor, color:storeDesign.shop.phone.textColor}}>
							<Image width={300} height={150} src={props?.storeData?.coverImage ? props?.storeData?.coverImage : LOGO} alt='shop cover image' />
							<h2>{props?.storeData?.name}</h2>
							<div className='shopData_category'>קטגוריית החנות </div>
							<div className='shopData_productsCount'>מוצרים בחנות: {props?.storeData?.productsIdsArray?.length}</div>
							<p>היי, אני מתן ואני מעצב תכשיטים בעבודת יד</p>
						</div>
						<div className={`${styles.storeButton}`}>
							<Link href={``}><StoreButton shopData={{storeDesign}}/></Link>
						</div>
					</div>
				</div>
			</div>
			</div>
			<div className={`${styles.section} section`}>
			<h2>תבנית הצגת המוצרים בחנות</h2>
			<div>
				<div>
				<p>asd</p>
					<div className={styles.input}> 
						<label htmlFor="cartProductTextColor">בחירת צבע</label>
						<input defaultValue="#000000" onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartProductTextColor" id="cartProductTextColor" />
					</div>
				</div>
				<div>
				<p>asd</p>
					<div className={styles.input}> 
						<label htmlFor="cartProductTextColor">בחירת צבע</label>
						<input defaultValue="#000000" onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartProductTextColor" id="cartProductTextColor" />
					</div>
				</div>
			</div>
			<div className={styles.preview}>preview</div>
			</div>
			<div className={`${styles.section} section`}>
			<h2>תבנית עמוד מוצר</h2>
			<div>
				<div>
				<p>asd</p>
					<div className={styles.input}> 
						<label htmlFor="cartProductTextColor">בחירת צבע</label>
						<input defaultValue="#000000" onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartProductTextColor" id="cartProductTextColor" />
					</div>
				</div>
				<div>
				<p>asd</p>
					<div className={styles.input}> 
						<label htmlFor="cartProductTextColor">בחירת צבע</label>
						<input defaultValue="#000000" onChange={(e) => handleColorSelector(e)} type="color" settingGroup='cartColors' name="cartProductTextColor" id="cartProductTextColor" />
					</div>
				</div>
			</div>
			<div className={styles.preview}>preview</div> 
			</div>
		<button disabled={loading ? true : false} onClick={() => {loading ? null : handleSubmit()}}>{loading ? 'שומר את השינויים...' : 'שמירת השינויים'}</button>
		</div>
    </div>
  )
}

export default StoreDesign
