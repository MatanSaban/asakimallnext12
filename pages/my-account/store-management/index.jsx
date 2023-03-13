import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import StoreDesign from '../../../components/StoreManagement/StoreDesign/StoreDesign';
import StoreMain from '../../../components/StoreManagement/StoreMain/StoreMain';
import StoreProducts from '../../../components/StoreManagement/StoreProducts/StoreProducts';
import StoreSettings from '../../../components/StoreManagement/StoreSettings/StoreSettings';
import NewProduct from '../../../components/StoreManagement/NewProduct/NewProduct';
import axios from 'axios';
import { storage } from "../../../pages/api/firebase";
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import { uuid as v4 } from 'uuidv4';
import styles from './StoreManagement.module.scss'
 
function StoreManagment(props) {
  const [userData, setUserData] = useState(props?.userData);
  const [loading, setLoading] = useState(false);
  const [reRender, setRerender] = useState(0);
  const reRenderData = () => {
      setRerender(reRender + 1)
  }
  const [childPage, setChildPage] = useState();
  const [storeProducts, setStoreProducts] = useState([]);



  useEffect(() => {
      setLoading(true);
      // setUserData(props?.userData);
      if (props?.userData) {
        if (props?.storeData) {
          console.log('current childPage')
          console.log(childPage)
          let products = [];
          if (props.storeData.productsIdsArray.length > 0) {
            props.storeData.productsIdsArray.forEach((id) => {
              axios.get(`/api/products/${id}`).then((res) => {
                if (res.status === 200) {
                  products.push(res.data);
                }
              })
            })
            setStoreProducts(products)
          }
          setChildPage(<StoreMain userData={props?.userData} storeData={props?.storeData} title={'ניהול החנות שלי'} />)
          setLoading(false)
        }
      }
  },[props])

  const handleUploads = async (array, productId) => {
    let mainImage;
    let galleryImages = [];

    if (typeof array[0] === 'object') {
      // If main image exists, upload it
      console.log('there is main image')
      const path = `images/users/userId_${userData.id}/storeId_${props.storeData.id}/productId_${productId}/${array[0].name+'_'+v4()}`
      console.log('path')
      console.log(path)
      const imageRef = ref(storage, path);
      const mainImageUploadTask = await uploadBytes(imageRef, array[0]);
      const mainImageUploadTaskSnapshot = await mainImageUploadTask;
      const mainImageUrl = await getDownloadURL(mainImageUploadTaskSnapshot.ref);
      mainImage = mainImageUrl;
      console.log('mainImage')
      console.log(mainImage)
    }
  
    if (array[1].length > 0) {
      // If gallery images exist, upload them and save their URLs
      const galleryUploadPromises = array[1].map((file) => {
        const path = `images/users/userId_${userData.id}/storeId_${storeDataProp.id}/productId_${productId}/${file.name+'_'+v4()}`
        const imageRef = ref(storage, path);
        return uploadBytes(imageRef, file).then((response) => {
          return getDownloadURL(response.ref);
        });
      });
      const galleryUrls = await Promise.all(galleryUploadPromises);
      galleryImages = galleryUrls;
    }
  
    return [mainImage, galleryImages];
  }

  async function outerFunction(array, productId) {
    console.log('outerFunction start')
    const [mainImageUrl, galleryImageUrls] = await handleUploads(array, productId)
    console.log('mainImageUrl')
    console.log(mainImageUrl)
    console.log('outerFunction end')
    return [mainImageUrl, galleryImageUrls];
  }
  
  
  const handleSubmit = async (e, object, toDo) => {
    e.preventDefault();
    try {
      
      switch (toDo) {
        case 'newProduct':
          let objectWithoutImages
          let images 
          let product
          let productId 
          let updatedData;
          if (object.mainImage !== '' || object.gallery.length > 0) { // there are any images
            console.log('here 1')
            // 1 - separate the images from object and make a new clean of images object
            images = [object.mainImage, [...object.gallery]]
            object.mainImage = '';
            object.gallery = [];
            objectWithoutImages = object;
            
            // 2 - send api to get a product id 
            const makeProduct = await axios.post('/api/products', objectWithoutImages);
            product = await makeProduct.data.data
            productId = await product.id;
            console.log('here 2')
            // console.log(product)
            // props.setStoreData({...props?.storeData,productsIdsArray: [...productsIdsArray, productId] }); 
            // 3 - upload the files and get the urls for main image and gallery.
            const uploads = await outerFunction(images, productId);
            console.log('here 3')
            console.log(uploads[0] ? true : false)
          
          if (uploads) {
            if (uploads[0]) { // there is a main image
              console.log('here 4')
              console.log(uploads[0])
              object.mainImage = uploads[0];
            }
            if (uploads[1]) { // there is a gallrey
              object.gallery = uploads[1];
            }
          }
              
              console.log('here 5')
              console.log(object)
              axios.put(`/api/products/${productId}`, object).then((res) => {
                product = res.data.data
                // const updatedProducts = [...props?.storeData.products, product];

                // console.log('here 6')
                // console.log(updatedProducts)
                
                axios.put(`/api/stores/${props?.storeData?.id}`, {
                  productsIdsArray: [...props?.storeData?.productsIdsArray, product.id]
                }).then((res) => {
                  if (res.status === 200) {
                    console.log('here 7')
                    props.setStoreData(res.data.data); 
                  }
                })

              })

          } else { // there are no images at all
            let newProduct; 
            let newProductsArray;
              axios.post('/api/products', object).then((res) => {
                if (res.status === 200) {
                  console.log('res from new product in store management')
                  console.log(res)
                  newProduct = res.data;
                  props.refreshDataCB();

                }
              })
            }
        case 'editProducts':
          
          break;
          case 'deleteProducts':
            const idsToDelete = [];
            let updatedStoreData = { ...props?.storeData };
            const table = document.querySelector('table');
            object.forEach((row) => {
              idsToDelete.push(row.id)
            });
            
            const deletePromises = idsToDelete.map(async (productId) => {
              try {
                await axios.delete(`/api/products/${productId}`);
                console.log(`Product ${productId} deleted successfully.`);
              } catch (error) {
                console.error(`Error deleting product ${productId}: ${error}`);
              }
            });
            
            Promise.all(deletePromises).then(() => {
              idsToDelete.forEach((productId) => {
                const tableRow = table.querySelector(`tr#${CSS.escape(productId)}`);
                if (tableRow) {
                  tableRow.style.backgroundColor = 'red';
                  setTimeout(() => {
                    updatedStoreData.products = updatedStoreData.products.filter((product) => product.id !== productId);
                    props.setStoreData(updatedStoreData);
                  }, 1000);
                }
              });
              return true;
            });
            
            break;
                    default:
            break;
        }
      } catch (error) {
      }
      
      return true;
    }

    const setChild = (childName) => {

      switch (childName) {
        case 'StoreMain':
          setChildPage(<StoreMain setChild={setChild} userData={props.userData} storeData={props.storeData} title={'ניהול החנות שלי'} />)
          break;
        case 'StoreSettings':
          setChildPage(<StoreSettings reRenderData={reRenderData} refreshDataCB={props.refreshDataCB} userData={props.userData} storeData={props.storeData}  title={'הגדרות החנות'}/>)
          break;
        case 'StoreDesign':
          setChildPage(<StoreDesign storeProducts={storeProducts} reRenderData={reRenderData} userData={props.userData} storeData={props.storeData} title={'עיצוב החנות'}/>)
          break;
        case 'StoreProducts':
          setChildPage(<StoreProducts reRenderData={reRenderData} refreshDataCB={props.refreshDataCB} userData={props.userData} storeData={props.storeData} handleSubmit={handleSubmit} title={'ניהול מוצרים'}/>)
          break;
        case 'NewProduct':
          setChildPage(<NewProduct reRenderData={reRenderData} userData={props.userData} storeData={props.storeData} handleSubmit={handleSubmit} title={'הוספת מוצר חדש'}/>)
          break;
      
        default:
          break;
      }

    }
    

  return (
    <div className={styles.storeManagmentPage}>
        <>
            <aside>
                <h3>תפריט החנות שלי</h3>
                <ul>
                    <li>
                        <button onClick={() => setChildPage(<StoreMain setChild={setChild} userData={props.userData} storeData={props.storeData} title={'ניהול החנות שלי'} />)}>ראשי</button>
                    </li>
                    <li>
                        <button onClick={() => setChildPage(<StoreSettings setChild={setChild} reRenderData={reRenderData} refreshDataCB={props.refreshDataCB} userData={props.userData} storeData={props.storeData}  title={'הגדרות החנות'}/>)}>הגדרות החנות</button>
                    </li>
                    <li>
                        <button onClick={() => setChildPage(<StoreDesign setChild={setChild} storeProducts={storeProducts} reRenderData={reRenderData} userData={props.userData} storeData={props.storeData} title={'עיצוב החנות'}/>)}>עיצוב החנות</button>
                    </li>
                    <li>
                        <button onClick={() => setChildPage(<StoreProducts setChild={setChild} reRenderData={reRenderData} refreshDataCB={props.refreshDataCB} userData={props.userData} storeData={props.storeData} handleSubmit={handleSubmit} title={'ניהול מוצרים'}/>)}>ניהול מוצרים</button>
                    </li>
                    <li>
                        <button onClick={() => setChildPage(<NewProduct setChild={setChild} reRenderData={reRenderData} userData={props.userData} storeData={props.storeData} handleSubmit={handleSubmit} title={'הוספת מוצר חדש'}/>)}>הוספת מוצר חדש</button>
                    </li>
                </ul>
            </aside>
            <main>
                {childPage}
            </main>
        </>
</div>
  )
}

export default StoreManagment
