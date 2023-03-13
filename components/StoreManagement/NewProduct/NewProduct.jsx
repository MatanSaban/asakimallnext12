import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from './newProduct.module.scss'

const NewProduct = ({ title, userData, storeData, updateProducts, handleSubmit, reRenderData }) => {

	const [onSale, setOnSale] = useState(false); 
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [gallery, setGallery] = useState([]);
	const [mainImage, setMainImage] = useState();
	const [productState, setProductState] = useState();
	const highestProductIdentifier = storeData?.products?.length && storeData?.products?.reduce((prev, current) => {
		return (prev.productIdentifier > current.productIdentifier) ? prev : current
	  });

	const [product, setProduct] = useState({
		productIdentifier : highestProductIdentifier?.productIdentifier ? highestProductIdentifier?.productIdentifier + 1 : 1,
		name : '',
		mainImage : '',
		gallery : [],
		price : 0,
		onsale : false,
		saleprice : 0,
		storeId : storeData?.id ? storeData?.id : '',
		storeOrdersIds : [],
		categoriesId : storeData?.categoryId,
		shortdescription : '', 
		publishState : false,
		description : ''
	});

	useEffect(() => {
		console.log('useeffect from newProductss')
	},[loading, success, failure])

	const handleBoolean = (e) => {
		if (e.target.name === 'onsale') {
			setOnSale(e.target.value == 'true' ? true : false)
		} else if (e.target.name === 'publishState') {
			setProductState(e.target.value == 'true' ? true : false)
		}
		setProduct({ ...product, [e.target.name]: e.target.value == 'true' ? true : false });
	}

	const handleField = (e) => {
		let fieldValue = e.target.value;
		const fieldName = e.target.name;

		if (fieldName === 'price' || fieldName === 'saleprice') {
			fieldValue = parseInt(fieldValue)
		} else if (fieldName === 'mainImage') {
			fieldValue = e.target.files[0]
			setMainImage(URL.createObjectURL(e.target.files[0]))
		} else if (fieldName === 'gallery') {
			fieldValue = e.target.files
		}
		setProduct({ ...product, [fieldName]: fieldValue });
	}

	const sendData = async (e) => {
		e.preventDefault();
		setLoading(true)
		setSuccess(false)
		 const isDone = await handleSubmit(e, product, 'newProduct');
		 e.target.reset()
		 setProduct({
			productIdentifier : highestProductIdentifier?.productIdentifier ? highestProductIdentifier?.productIdentifier + 1 : 1,
			name : '',
			mainImage : '',
			gallery : [],
			price : 0,
			onsale : false,
			saleprice : 0,
			storeId : storeData?.id ? storeData?.id : '',
			storeOrdersIds : [],
			categoriesId : storeData?.categoryId,
			shortdescription : '', 
			publishState : false,
			description : ''
		})
		setGallery([])
		setMainImage('')
		setLoading(false)
		setOnSale(false)
		setSuccess(true)
	}

	const handleMultipleFiles = (e) => {
        let filesArr = [];
        const files = e.target.files;
        const filesToPass = []
        const toArray = Array.from(files);
        toArray.forEach((file) => {
            filesArr.push(URL.createObjectURL(file))
            filesToPass.push(file)
        })
        setGallery([...gallery , ...filesArr])
        setProduct({ ...product , gallery: filesToPass })
    }

	function removeFromGallery(item) {
        console.log('item')
        console.log(item)
        const newGallery = []
        const newGalleryToPass = []
        gallery.forEach((image) => {
            if (image != item) {
                newGallery.push(image)
                newGalleryToPass.push(image)
            }
        })
			setGallery(newGallery)
			setProduct({...product, gallery: newGalleryToPass})
      }

	  const handleDeleteSingleImage = () => {
		setProduct({...product, mainImage: ''});
		setMainImage('')
	  }


    return (
        <div className={styles.addProduct}>
            <h1>{title}</h1>
            <div className={styles.formWrapper}>
                <form onSubmit={(e) => sendData(e)}>
					<div className={styles.section}>
						<div>
							<label htmlFor="name">שם המוצר</label>
							<input required onChange={(e) => handleField(e)} type="text" name="name" id="name" />
						</div>
						<div>
							<label htmlFor="price">מחיר</label>
							<input required onChange={(e) => handleField(e)} type="number" name="price" id="price" />
						</div>
					</div>
					<div className={styles.section}>
						<div style={onSale ? {width:'50%'} : {width:'100%'}}>
							<label htmlFor="onsale">המוצר במבצע?</label>
							<select onChange={(e) => handleBoolean(e)} defaultValue={product.onsale} name="onsale" id="onsale">
								<option value='false'>לא</option>
								<option value='true'>כן</option>
							</select>
						</div>
						{onSale && <div style={{width:'50%'}}>
							<label htmlFor="saleprice">מחיר מבצע</label>
							<input required defaultValue={product?.saleprice} onChange={(e) => handleField(e)} type="number" name="saleprice" id="saleprice" />
						</div>}
					</div>
					<div className={styles.section}>
						<div style={{width:'100%'}}>
							<label htmlFor="publishState">סטטוס מוצר</label>
							<select onChange={(e) => handleBoolean(e)} required name="publishState" id="publishState">
								<option disabled selected value='choose'>נא לבחור סטטוס למוצר</option>
								<option value='true'>פרסום המוצר</option>
								<option value='false'>טיוטה</option>
							</select>
						</div>
					</div>
					<div className={`${styles.section} section`}>
							<div className={styles.mainImage} style={{flexDirection:'column'}}>
								<label htmlFor="">תמונה ראשית</label>
								<input type='file' onChange={(e) => handleField(e)}  name='mainImage' style={{display:'none'}} id="singleImage" defaultValue={product.mainImage.name} />
								<button htmlFor="singleImage" name="single" onClick={(e) => {e.preventDefault(); e.target.closest('.section').querySelector('input#singleImage').click()} }>העלאת תמונה</button>
								{mainImage && 
								<div>
									<Image style={{width:'100%', objectFit:'cover', height:'300px'}} src={mainImage} alt="" width={100} height={100} />
									<i style={{color:'red', position:'absolute', top:'10px', left:'10px', fontStyle:'normal', cursor:'pointer'}} className='deleteMainImage' onClick={() => handleDeleteSingleImage()}>x</i>
								</div>
								} 
							</div>
					</div>
					<div className={`${styles.section} section`}>
						<div className={styles.galleryWrapper}>
								<div className={`${styles.gallery} gallery`}>
									<label htmlFor="">גלריית המוצר</label>
									<input id={`${styles.multiple}`} className='multiple' onChange={(e) => handleMultipleFiles(e) } type="file" multiple />
									<div >
										<button name="multiple" onClick={(e) => {e.preventDefault(); e.target.closest('.gallery').querySelector('input.multiple').click()} }>העלאה לגלריה</button>
										{gallery.length > 0 && <div className={styles.imageGallery}>
											{gallery?.map((image) => {
												return (
													<div key={image}>
														<i onClick={() => removeFromGallery(image)}>x</i>
														<Image src={image} width={100} height={100} alt='temporary image in gallery'/>
													</div>
												)
											})}
										</div>}
									</div>
								</div>
							</div>
					</div>
					<div className={styles.section}>
						<div>
							<label htmlFor="description">תיאור מלא</label>
							<textarea onChange={(e) => handleField(e)} cols={2} name="description" id="description" />
						</div>
						<div>
						<label htmlFor="shortdescription">תיאור קצר</label>
							<textarea onChange={(e) => handleField(e)} cols={2} name="shortdescription" id="shortdescription" />
							</div>
					</div>
					<button type="submit">הוספת המוצר לחנות</button>
					{loading && 'שולח את המוצר...'}
					{success && `המוצר הועלה בהצלחה במצב "${productState ? 'פרסום' : 'טיוטה'}"`}
					{failure && 'שגיאה בהעלאת המוצר'}
                </form>
            </div>
        </div>
    );
};

export default NewProduct;
