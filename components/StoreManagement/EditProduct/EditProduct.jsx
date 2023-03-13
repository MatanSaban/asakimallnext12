import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styles from './editProduct.module.scss'

const EditProduct = (props) => {

    const product = props?.product;

	const [realMainImage, setRealMainImage] = useState(product?.mainImage); 
    const [realGallery, setRealGallery] = useState(product?.gallery ? product?.gallery : [] );
	const [temporarySingleImage, setTemporarySingleImage] = useState(); 
    const [imageToPass, setImageToPass] = useState();
    const [gallery, setGallery] = useState(product?.gallery ? product.gallery : [] ); // should get the current gallery
    const [galleryToPass, setGalleryToPass] = useState(product?.gallery ? product.gallery : [] ); // should get the current gallery
    const [editAllProperties, setEditAllProperties] = useState({});
    const [loading, setLoading] = useState(false);

    const sendEditAllProperties = (obj) => {
        props.getEditAllProperties(obj)
    }

    useEffect(() => {
        sendEditAllProperties(editAllProperties)   
    })

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
        setGalleryToPass([...realGallery , ...filesToPass])
        setEditAllProperties({ ...editAllProperties , gallery: [...realGallery , ...filesToPass] })
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
        setGalleryToPass(newGalleryToPass)
        setRealGallery(newGalleryToPass)
        setEditAllProperties({ ...editAllProperties , gallery: newGalleryToPass })
      }

      const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('מעדכן את המוצר..')
        setTimeout(async () => {
            console.log('galleryToPass');
            console.log(editAllProperties);
            const res = await props.handleSubmit(e, product.id, editAllProperties, true);
            const updatedProduct = await res;
            if (updatedProduct) {
                setLoading(false)
            }
          }, 1500);
        }

      const handleSingleImage = (e) => {
        setImageToPass(e.target.files[0]) ;
        setTemporarySingleImage(URL.createObjectURL(e.target.files[0]));
        setTimeout(() => {
            setEditAllProperties({ ...editAllProperties, mainImage: e.target.files[0] }); 
        }, 1000);
      }

      const handleDeleteSingleImage = (e) => {
        setImageToPass(product.mainImage);
        setTemporarySingleImage();
        setTimeout(() => {
            setEditAllProperties({ ...editAllProperties, mainImage: product.mainImage }); 
            
        }, 1000)
      }


  return (
    <>
			<h3>עריכת המוצר {product.name}</h3>
			<div className={styles.formWrapper}>
					<form onSubmit={(e) => handleSubmit(e)}>
						<div className={`${styles.section} section`}>
							<div className={`${styles.mainImage} mainImage`}>
								<label htmlFor="">תמונה ראשית</label>
								<input type='file' onChange={(e) => setTimeout(() => {setEditAllProperties({ ...editAllProperties, mainImage: e.target.files[0] }) ; handleSingleImage(e)}, 1500)}  name='singleUploader' style={{display:'none'}} id="singleImage" defaultValue={product.mainImage.name} />
								<button htmlFor="singleImage" name="single" onClick={(e) => {e.preventDefault(); e.target.closest('.section').querySelector('input#singleImage').click()} }>העלאת תמונה</button>
								<div>
									{temporarySingleImage && 
                                    <div>
                                        <Image src={temporarySingleImage} alt="" width={100} height={100} />
                                        <i className='deleteMainImage' onClick={() => handleDeleteSingleImage()}>x</i>
                                    </div>
                                    } 
									{!temporarySingleImage && product.mainImage && <Image src={product.mainImage} alt="" width={100} height={100} />}
                                    {!temporarySingleImage && !product.mainImage && 'אין תמונה'}
								</div>
							</div>
							<div>
								<label htmlFor="">שם המוצר</label>
								<input onChange={(e) => setEditAllProperties({ ...editAllProperties, name: e.target.value })} type="text" defaultValue={product.name} />
							</div>
						</div>
						<div className={`${styles.section} section`}>
							<div>
								<label htmlFor="">מחיר</label>
								<input onChange={(e) => setEditAllProperties({ ...editAllProperties, price: parseInt(e.target.value) })} type="text" defaultValue={product.price} />
							</div>
							<div>
								<label htmlFor="">מחיר מבצע</label>
								<input onChange={(e) => setEditAllProperties({ ...editAllProperties, saleprice: parseInt(e.target.value) })} type="text" defaultValue={product.saleprice} />
							</div>
						</div>
						<div className={`${styles.section} section`}>
							<div>
								<label htmlFor="">המוצר במבצע?</label>
								<select onChange={(e) => setEditAllProperties({ ...editAllProperties, onsale: e.target.value == 'true' ? true : false }) } defaultValue={product.onsale === true ? 'true' : 'false'} name="onsaleq" id="onsaleq">
									<option value="true">כן</option>
									<option value="false">לא</option>
								</select>
							</div>
							<div>
								<label htmlFor="">פרסום המוצר?</label>
								<select onChange={(e) => setEditAllProperties({ ...editAllProperties, publishState: e.target.value == 'true' ? true : false }) } defaultValue={product.publishState === true ? 'true' : 'false'} name="onsaleq" id="onsaleq">
									<option value="true">כן</option>
									<option value="false">לא</option>
								</select>
							</div>
						</div>
						<div className={`${styles.section} section`}>
							<div>
								<label htmlFor="">תיאור קצר</label>
								<textarea onChange={(e) => setEditAllProperties({ ...editAllProperties, shortdescription: e.target.value })} defaultValue={product.shortdescription} rows="6" />
							</div>
							<div>
								<label htmlFor="">תיאור ארוך</label>
								<textarea onChange={(e) => setEditAllProperties({ ...editAllProperties, description: e.target.value })} defaultValue={product.description} rows="6" />
							</div>
						</div>
						<div className={`${styles.galleryWrapper} galleryWrapper`}> 
							<div className={`${styles.gallery} gallery`}>
								<label htmlFor="">גלריית המוצר</label>
								<input id={`multiple`} onChange={(e) => handleMultipleFiles(e) } style={{display:'none'}} type="file" multiple />
								<div>
									<button name="multiple" onClick={(e) => {e.preventDefault(); e.target.closest('.gallery').querySelector('input#multiple').click()} }>סידור הגלריה</button>
									<div className={`${styles.imageGallery} imageGallery`}>
                                        {gallery?.map((image) => {
                                            return ( 
                                                <div key={image}>
                                                    <i onClick={() => removeFromGallery(image)}>x</i>
                                                    <Image src={image} width={100} height={100} alt='temporary image in gallery'/>
                                                </div>
                                            )
                                        })}
									</div>
								</div>
							</div>
						</div>
						<button>שמירה</button>
                        {loading}
                        {props?.success}
					</form>
			</div>

		</> 
  )
}

export default EditProduct
