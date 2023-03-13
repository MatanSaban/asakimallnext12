import Image from "next/image";
import styles from "./checkout.module.scss";

const cartTable = (props) => {
    let sum = 0;

    const trs = props?.userData?.cart?.map((store) => {
        return store?.products?.map?.((product) => {
            sum += product.price * product.count;
            return (
                <tr key={store.storeId} className={styles.store}>
                    <td>{store.storeName}</td>
                    <td className={styles.image}>
                        {product.image ? (
                            <Image
                                src={product.image}
                                height={25}
                                width={25}
                                alt={"product Image"}
                            />
                        ) : null}
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.count}</td>
                    <td>₪{product.price.toLocaleString("en-US")}</td>
                    <td>
                        ₪
                        {(product.price * product.count).toLocaleString(
                            "en-US"
                        )}
                    </td>
                </tr>
            );
        });
    });
    return (
        <table style={{ borderCollapse: "collapse" }}>
            <thead>
                <tr>
                    <th>חנות</th>
                    <th>תמונה</th>
                    <th>שם המוצר</th>
                    <th>כמות</th>
                    <th>מחיר</th>
                    <th>סה&quot;כ</th>
                </tr>
            </thead>
            <tbody>
                {trs}
                <tr>
                    <td style={{ fontWeight: "bold" }}>סכום ביניים</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>₪{sum.toLocaleString("en-US")}</td>
                </tr>
                <tr>
                    <td style={{ fontWeight: "bold" }}>מע&quot;מ</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>₪{(sum * 0.17).toLocaleString("en-US")}</td>
                </tr>
                <tr>
                    <td style={{ fontWeight: "bold" }}>סה&quot;כ לתשלום</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>₪{(sum * 1.17).toLocaleString("en-US")}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default cartTable; 