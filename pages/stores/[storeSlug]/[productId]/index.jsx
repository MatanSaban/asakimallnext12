import Image from "next/image";
import React, { useEffect, useState } from "react";
import Slideshow from "../../../../components/General/Slideshow";
import styles from "./singleProduct.module.scss";


export async function getStaticPaths() {
    // Fetch store and product data from APIs
    const storesResponse = await fetch("http://localhost:3000/api/stores");
    const { stores } = await storesResponse.json();

    const productsResponse = await fetch("http://localhost:3000/api/products");
    const { products } = await productsResponse.json();

    // Generate paths array from the fetched data
    const paths = stores.flatMap((store) =>
        products.map((product) => ({
            params: {
                storeSlug: store.slug,
                productId: product.id.toString(),
            },
        }))
    );

    return {
        paths,
        fallback: false, // or 'blocking' if you want to use fallback pages
    };
}

export const getStaticProps = async ({ params }) => {
    const resp = await fetch(
        `http://localhost:3000/api/products/${params.productId}`
    );
    const product = await resp.json();
	const storesResponse = await fetch(`http://localhost:3000/api/stores/${product.storeId}`);
    const {store} = await storesResponse.json();
    return {
        props: { product: product, store: store },
        revalidate: 100,
    };
};




const SingleProductPage = (props) => {

	const [cartCount, setCartCount] = useState(1);
	
	const galleryImages = [props?.product?.mainImage];
	props?.product?.gallery?.forEach((image) => {
		galleryImages.push(image)
	})

	const addToCart = (e) => {
		const cartObject = {
			storeId : props?.store.id,
			storeName: props?.store?.name,
			storeDesign: props?.store?.storeDesign, 
			product: {
				productId: props?.product.id,
				productName: props?.product.name,
				count: parseInt(cartCount),
				onSale: props?.product.onsale,
				price: props?.product.onsale && props?.product.saleprice ? props?.product.saleprice : props?.product.price,
				image: props?.product.mainImage
			}
		};
		

		const cartIcon = props.cartIcon;
        let rect = cartIcon?.getBoundingClientRect();
        let rectTop = rect?.top;
        let rectLeft = rect?.left;

        let buttonRect = e.target.getBoundingClientRect();
        let buttonRectTop = buttonRect?.top;
        let buttonRectLeft = buttonRect?.left;

		const newSpan = document.createElement("span");
		newSpan.innerText = `${cartCount}+`;
		newSpan.classList.add(`${styles.spanToCart}`);
		newSpan.style.position = 'fixed';
		newSpan.style.top = `${buttonRectTop}px`;
		newSpan.style.left = `${buttonRectLeft}px`;

		e.target.appendChild(newSpan);

		setTimeout(() => {
			newSpan.style.top = `${rectTop + 20}px`;
			newSpan.style.left = `${rectLeft + 20}px`;
		}, 500);
		setTimeout(() => {
			newSpan.style.width = '0';
			newSpan.style.height = '0';
			newSpan.style.fontSize = '0';
		}, 1500);
		setTimeout(() => {
			cartIcon.style.marginTop = '-10px'
		}, 2300);
		setTimeout(() => {
			cartIcon.style.marginTop = '0px'
			newSpan.remove();
			props.addToCartCB(cartObject)
			setCartCount(1) 
		}, 2500);
	}

	const renderText = (text) => {
		if (text) {
			const lines = text.split('\n');
			return (
				lines.map((line, index) => (
					<p key={index}>
					  {line}
					  {index < lines.length - 1 && <br />}
					</p>
				  ))
			)
		}
	}
	

    return (
        <main className={styles.main}>
            <section>
                <div className={styles.productImages}>
                        <div className={styles.imageGallery}>
							<Slideshow images={galleryImages} intervalTime={5000} /> 
                        </div>
                </div>
                <div className={styles.productDetails}>
                    <h1>{props?.product?.name}</h1>
                    <p>{renderText(props?.product?.description)}</p>
                    <div className={`${styles.price} ${props?.product.onsale && styles.onsale}`} >
						{props?.product.onsale ? 
							<div>
								<span>מחיר: ₪{props?.product.saleprice.toLocaleString(undefined, {maximumFractionDigits:2})} </span>
								<span>במקום: ₪{props?.product.price.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
							</div>
							: 
							<span>מחיר: ₪{props?.product.price.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
						}
					</div>
					<div className={styles.addToCart}>
						<button onClick={(e) => addToCart(e)}>הוספה לסל</button> 
						<input onChange={(e) => setCartCount(parseInt(e.target.value))} type="number" value={cartCount} />
					</div>
                </div>
            </section>
        </main>
    );
};

export default SingleProductPage;
