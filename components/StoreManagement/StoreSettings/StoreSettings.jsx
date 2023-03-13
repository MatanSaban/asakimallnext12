import { storage } from "../../../pages/api/firebase";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { uuid as v4 } from 'uuidv4'; 
import styles from './storeSettings.module.scss'
import Popup from "../../General/Popup";

const StoreSettings = (props) => {


	const [storeData, setStoreData] = useState({
		name: props?.storeData?.name ? props?.storeData?.name : '',
		slug: props?.storeData?.slug ? props?.storeData?.slug : '',
		coverImage: props?.storeData?.coverImage ? props?.storeData?.coverImage : null
	});

	const [coverImage, setCoverImage] = useState(props?.storeData?.coverImage);
	const [newCoverImage, setNewCoverImage] = useState();
	const [loading, setLoading] = useState(false);
	const [isPublished, setIsPublished] = useState(props?.storeData?.published);
	const [popup, setPopup] = useState(false);

	const checkFields = (e) => {
        let currVal = e.target.value;
        const newVal = currVal.trim()
        if (e.target.name === 'slug') {
            let newString = e.target.value.replaceAll(/ /g, "")
            e.target.value = newString.toLowerCase();
        } else {
            e.target.value = newVal;
        }

        setStoreData({...storeData, [e.target.name] : e.target.value})
    }

	const uploadImages = async () => {
		const path = `images/users/userId_${props.userData.id}/storeId_${props.storeData.id}/${v4()+'_'+storeData.coverImage.name}`
		const imageRef = ref(storage, path);
		const mainImageUploadTask = uploadBytes(imageRef, storeData.coverImage);
		const mainImageUploadTaskSnapshot = await mainImageUploadTask;
		const mainImageUrl = await getDownloadURL(mainImageUploadTaskSnapshot.ref);
		const theNewCoverImage = mainImageUrl;
		console.log('new cover image url : ' + theNewCoverImage)
		const newStoreData = storeData;
		newStoreData.coverImage = theNewCoverImage
		return newStoreData;
	  }
	  
	  const handleForm = async (e) => {
		e.preventDefault();
		let newStoreData = null;
		setLoading(true)
		if (newCoverImage) { // means there is a new cover image
		  newStoreData = await uploadImages();
		}
		console.log('storeData')
		console.log(storeData)
		await axios.put(`/api/stores/${props?.storeData?.id}`,newStoreData ? {...newStoreData} :{
		  ...storeData
		}).then((res) => {
		  if (res.status === 200) {
				setPopup(<Popup content={'השינויים נשמרו בהצלחה'} style={{backgroundColor:'white', color:'black'}} show={true}/>);
				const newDataStore = res.data.data;
				setStoreData({name: newDataStore.name, slug: newDataStore.slug, coverImage: newDataStore.coverImage})
				setIsPublished(newDataStore.published)
				setLoading(false)
				setTimeout(() => {
					setPopup(<Popup content={'השינויים נשמרו בהצלחה'} style={{backgroundColor:'white', color:'black'}} show={false}/>);
				}, 1000);
				setTimeout(() => {
					props.refreshDataCB()
					props.setChild('StoreMain'); 
				}, 1500);
		  }
		})
	  }

	const handlePublishState = () => {
		setLoading('publishState')
		axios.put(`/api/stores/${props?.storeData?.id}`,{
			published: !isPublished
		}).then((res) => {
			setIsPublished(res.data.data.published)
			setLoading(false)
		})
	}

	const cancelNewCoverImage = () => {
		setNewCoverImage(null)
	}

	const popupStructure = (type, contentElm) => {
		return (<div className="popupWrapper"><div className={`popup ${type}`}><i onClick={() => setPopup(false)} className="closePopup"><AiOutlineClose/></i>{contentElm}</div></div>)
	}			
	

	const deleteStore = () => {
		axios.delete(`/api/stores/${props.storeData.id}`).then((res) => {
			console.log('res of store delete')
			axios.delete(`/api/sellers/${props.storeData.sellersId}`).then((res) => {
				console.log('res of seller delete')
				console.log(res)
				axios.put(`/api/users/${props.userData.id}`,{
					role : 'USER',
					hasStore: false,
				}).then((res) => {
					console.log('res of user update')
					console.log(res)

					if (res.statusText === 'OK') {
						const popup = 
						<>
							<h2>החנות שלך וכל תוכנה נמחקו בהצלחה</h2>
							<p>הינך מועבר לעמוד החשבון שלי</p>
						</>
						setPopup(false);
						setTimeout(() => {
							setPopup(popupStructure('',popup))
						}, 1000);
					}
				})
			})
		})
	}
	
	const deleteStorePopup = () => {
		const popup = 
		<>
			<h2>את/ה עומד/ת למחוק את החנות שלך</h2>
			<p>בטוח שזה מה שאת/ה רוצה לעשות?</p>
			<div>
				<button onClick={() => deleteStore()}>כן</button>
				<button onClick={() => setPopup(false)}>לא</button>
			</div>
		</>
		setPopup(popupStructure('',popup));
	}

    return (
        <div className={styles.pageWrapper}>
            <h1>{props.title}</h1>
			{popup}
            <div className={styles.pageContent}>
				<div className={styles.formWrapper}>
					<form onSubmit={(e) => handleForm(e)}>
						<div style={{justifyContent: 'center'}}>
							<div>
								<label htmlFor="name">שם החנות</label>
								<input type="text" name="name" id="name" required onBlur={(e) => checkFields(e)}  defaultValue={props?.storeData?.name}/>
							</div>
						</div>
						<div style={{justifyContent: 'center'}}>
							<div>
								<label htmlFor="slug">כתובת</label>
								<input dir="ltr" type="text" name="slug" id="slug" required onBlur={(e) => checkFields(e)}  defaultValue={props?.storeData?.slug}/>
							</div>
						</div>
						<div style={{justifyContent: 'center'}}>
							<div style={{flexDirection:'column'}} className={`${styles.section} section`}>
								<label htmlFor="coverImage">תמונת קאבר</label>
								<input id='singleImage' style={{display:'none'}} type="file" name="coverImage" onChange={(e) => {setNewCoverImage(URL.createObjectURL(e.target.files[0])); setStoreData({...storeData, [e.target.name] : e.target.files[0]}) }}/>
								<button style={{height:'fit-content'}} htmlFor="singleImage" name="single" onClick={(e) => {e.preventDefault(); e.target.closest('.section').querySelector('input#singleImage').click()} }>העלאת תמונה</button>
								{!newCoverImage && storeData.coverImage && 
								<div style={{width:'100%', margin:'0'}}>
									<Image alt='uploaded cover image' style={{width:'100%', height:'min-content', border:'2px solid black',borderTop:'none' , borderRadius:'10px', margin:'0 auto'}} src={props.storeData.coverImage} height={500} width={500} />
								</div>
								}
								{newCoverImage && 
								<div style={{width:'100%', margin:'0'}}>
									<Image alt='uploaded cover image' style={{width:'100%', height:'min-content', border:'2px solid black',borderTop:'none' , borderRadius:'10px', margin:'0 auto'}} src={newCoverImage} height={500} width={500} />
									<i style={{position:'absolute', top:'20px', left:'20px', color:'red', fontSize:'2rem', fontStyle:'normal', fontWeight:'bold', cursor:'pointer'}} onClick={(e) => cancelNewCoverImage(e)}>X</i>
								</div>
								}
							</div>
						</div>
						<button>{loading ? 'שומר את השינויים...' : 'שמירה'}</button>
					</form>
				</div>
				<div className={styles.storeImportantSettings}>
					<div className={styles.publishStore}>
						<h2>פרסום החנות</h2>
						<p>כאשר החנות על מצב פירסום היא תופיע לכולם בעמוד החנויות וכך גם המוצרים שלך.</p>
						<button style={!isPublished ? {backgroundColor:'green'} : {backgroundColor:'red'}} onClick={(e) => handlePublishState(e)}>{!isPublished ? 'פרסום החנות' : 'ביטול פרסום החנות'}</button>
						<br />
						{loading === 'publishState' && !isPublished && 'מפרסם את החנות'}
						{loading === 'publishState' && isPublished && 'מוציא את החנות מפרסום'}
					</div>
					<div className={styles.dangerZone}>
						<h2>מחיקת החנות</h2>
						<p>
							שים/י לב! 
							<br />
							לאחר מחיקת החנות לא תהיה אפשרות להחזירה והיא תימחק לאלתר.
						</p>
						<button onClick={(e) => deleteStorePopup(e)} style={{background:'red'}}>
							מחיקת החנות
						</button>
					</div>
				</div>
			</div>
        </div>
    );
};

export default StoreSettings;
