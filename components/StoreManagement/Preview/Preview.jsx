import Image from 'next/image'
import React from 'react';
import styles from './preview.module.scss';

const Preview = (props) => {
  return (
    <div>
      {props?.cellName === 'mainImage' && (
        <div className={styles.mainImage_Preview}>
          {<Image src={props.currentProduct.mainImage} width={300} height={300} alt='Product Main Image Big Size'/>}
        </div>
      )}
      {props?.cellName === 'shortDesc' && (
        <div className={styles.shortDesc_Preview}>
          {props.currentProduct.shortdescription}
        </div>
      )}
      {props?.cellName === 'longDesc' && (
        <div className={styles.longDesc_Preview}>
          {props.currentProduct.description}
        </div>
      )}
      {props?.cellName === 'gallery' && (
        <div className={styles.gallery_Preview}>
          {props.currentProduct.gallery?.map((image) => {
            return (
              !image ? 'טוען את התמונה' : <Image loading='eager' key={image} src={image} width={300} height={300} alt='Product Main Image Big Size'/>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Preview
