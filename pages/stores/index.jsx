import ShopInArchive from './ShopInArchive'
import styles from './storesIndex.module.scss'



export const getStaticProps = async () => {
    const resp = await fetch(`http://localhost:3000/api/stores`);
    return {
        props : await resp.json() ,
    };
  }

const StoresIndexPage = ({stores}) => {

    return (
        <main className={`${styles.index} ${styles.storesPage}`} >
            <h1>החנויות באתר</h1>
            <div className={`${styles.archive}`}>
                {
                    stores?.map((shop) => {
                        return (
                            <ShopInArchive key={shop?.id} shopData={shop} />
                        )
                    })
                }
            </div>
        </main>
    )
}

export default StoresIndexPage