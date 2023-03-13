import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import styles from './singleStore.module.scss'

export const getStaticPaths = async () => {
    const resp = await fetch(`http://localhost:3000/api/stores`);
    const {stores} = await resp.json();

    return {
        paths: stores.map((store) => ({
            params: {storeSlug: store.slug.toString() },
        })),
        fallback: false,
    };
}


export const getStaticProps = async ({ params }) => {
    try {
      const resp = await fetch(`http://localhost:3000/api/stores/${params.storeSlug}`);
      const { store } = await resp.json();
  
      const products = await Promise.all(store.productsIdsArray.map(async (product) => {
        try {
          const res = await fetch(`http://localhost:3000/api/products/${product}`);
          const data = await res.json();
          if (data) { // check if the product object is valid
            return data;
          }
        } catch (error) {
          console.error(error);
        }
      }));
  
      store.products = products.filter((product) => product); // filter out any undefined products
  
      return {
        props: {
          store,
        },
        revalidate: 100,
      };
    } catch (error) {
      console.error(error);
      return {
        props: {
          store: null,
        },
        revalidate: 100,
      };
    }
  };
  
   


const SingleStore = (props) => {

    const store = props?.store;
    const [cartIconRef, setCartIconRef] = useState(); 

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        const cartObject = {
                storeId : store.id,
                storeName: store?.name,
                storeDesign: store?.storeDesign, 
                product: {
                    productId: product.id,
                    productName: product.name,
                    count: 1,
                    onSale: product.onsale,
                    price: product.onsale && product.saleprice ? product.saleprice : product.price,
                    image: product.mainImage
                }
        };

        const cartIcon = cartIconRef
        let rect = cartIcon?.getBoundingClientRect();
        let rectTop = rect?.top;
        let rectLeft = rect?.left;
        const productEl = e.target.closest(".product")
        const imageWrapper = productEl.querySelector(".productImage")
        const image = imageWrapper.querySelector(".originalImage")
        let imgRect = image?.getBoundingClientRect();
        let imgRectTop = imgRect?.top;
        let imageRectLeft = imgRect?.left;
        const imageClone = image.cloneNode(true);
        imageClone.classList.add(`${styles.imageClone}`);
        imageClone.classList.remove(`originalImage`);
		imageClone.style.top = `0`;
		imageClone.style.left = `0`;
		imageClone.style.transform = `translate(0%, 0%)`;
		imageClone.style.position = `absolute`;
        imageWrapper.append(imageClone)

        setTimeout(() => {
            imageClone.style.width = `100px`;
            imageClone.style.height = `100px`;
            imageClone.style.transform = `scale(0.5) translate(130%, 50%)`;
            imageClone.style.borderRadius = `50%`;
			imageClone.style.zIndex = `999`;
			imageClone.style.transition = `all 1s ease`;
        }, 0);
        setTimeout(() => {
			imageClone.style.top = `${imgRectTop}px`;
			imageClone.style.left = `${imageRectLeft}px`;
            imageClone.style.position = `fixed`;
			imageClone.style.transition = `all 0s ease`;
        }, 1000);
        setTimeout(() => {
			imageClone.style.top = `${rectTop}px`;
            imageClone.style.left = `${rectLeft}px`;
			imageClone.style.width = `0px`;
			imageClone.style.height = `0px`;
			imageClone.style.zIndex = `999`;
			imageClone.style.transform = `translate(50%, 50%)`;
			imageClone.style.transition = `all 1s ease`;
        }, 2000);
        setTimeout(() => {
            cartIcon.style = 'margin-top:20px'
		}, 2800);
        setTimeout(() => {
            cartIcon.style = 'margin-top:0';
			imageClone.remove();
            props.addToCartCB(cartObject)
		}, 3300);
    
        return;
    }

    
    useEffect(() => {
      setCartIconRef(props.cartIcon);
    },[props.cartIcon])



  return (
    <div className={styles.singleStore}>
        <div className={styles.storeWrapper} >
            <div className={styles.pergula}>
                <div className={styles.pergula_up} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>                     
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>                    
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>                    
                </div>
                <div className={styles.pergula_down}>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorTwo}}></div>
                    <div className={styles.stripe} style={{backgroundColor:store.storeDesign.shop.pergulaColors.colorOne}}></div>
                </div>

            </div>
            <h1>{store?.name}</h1>
            <div className={styles.productsIndex} > 
                {
                    store?.products?.map((product) => {
                        return (
							<Link href={`/stores/${store.slug}/${product.id}`} key={product.id}>
								<div className={`${styles.product} product `} >
									{product.onsale && <i className={styles.saleTag}>SALE</i> }
									<div className={`${styles.productImage} productImage`}>
									<Image className='originalImage' src={product.mainImage} width={150} height={150} alt={product.name} />
									</div>
									<h3 className={styles.name}>{product.name}</h3>
									<div className={`${styles.price} ${product.onsale && styles.onsale}`} >
										<span className={styles.regularprice}>{product.price.toLocaleString(undefined, {maximumFractionDigits:2})} ₪</span>
										{product.onsale && 
										<span className={styles.saleprice}>{product.saleprice.toLocaleString(undefined, {maximumFractionDigits:2})} ₪</span>
										}
									</div>
									<div>
										<Link href={`/stores/${store.slug}/${product.id}`}><button>צפייה במוצר</button></Link>
										<button onClick={(e) => handleAddToCart(e, product)}>הוספה לעגלה</button>
									</div>
								</div>
							</Link>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default SingleStore
