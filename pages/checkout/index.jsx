import Image from "next/image";
import styles from "./checkout.module.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CheckoutForm from "./CheckoutForm";
import CartTable from "./CartTable";
import Popup from "../../components/General/Popup";
import { usernameFromEmail } from "../api/functions";

const CheckOut = (props) => {
    const formRef = useRef(null);
    const router = useRouter();

    const cityDatalistRef = useRef(null);
    const streetDatalistRef = useRef(null);

    const [userFields, setUserFields] = useState({
        firstname: props?.userData?.firstname,
        lastname: props?.userData?.lastname,
        address: {
            city: props?.userData?.address?.city,
            street: props?.userData?.address?.street,
            entrance: props?.userData?.address?.entrance,
            floor: props?.userData?.address?.floor,
            apt: props?.userData?.address?.apt,
        },
        email: props?.userData?.email,
        mobilephone: props?.userData?.mobilephone,
    });
    const [citySearch, setCitySearch] = useState(false);
    const [addressSeardh, setAddressSearch] = useState(false);
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState();

    useEffect(() => {
        if (!props?.userData?.cart?.length) {
            router.push("/");
        }
        let citiesList = [];
        const url = "https://data.gov.il/api/3/action/datastore_search";
        const resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
        const limit = "9999";
        axios.get(`${url}?resource_id=${resource_id}&limit=${limit}`).then((res) => {
            if (res.status === 200) {
                res.data.result.records.forEach((city) => {
                    if (
                        city.שם_ישוב !== "" &&
                        city.שם_ישוב !== "לא רשום "
                    ) {
                        citiesList.push(city);
                    }
                });
                setCities(citiesList);
            }
        });
    }, []);

    useEffect(() => {
        let streets = [];
        const url = "https://data.gov.il/api/3/action/datastore_search";
        const resource_id = "9ad3862c-8391-4b2f-84a4-2d4c68625f4b";
        const limit = "9999";

        {
        userFields?.address?.city && 
        axios.get(`${url}?resource_id=${resource_id}&q=${userFields.address.city}&limit=${limit}`)
            .then((res) => {
                if (res.status === 200) {
                    res?.data?.result?.records?.forEach((street) => {
                        streets.push(street);
                    });
                    setStreets(streets);
                }
            });
        }
    }, [userFields.address.city]);

    

    const handleSelectFields = (e) => {
        const cityDatalist = cityDatalistRef.current;
        const cities = cityDatalist.options;
        const streetDataList = streetDatalistRef.current;
        const streets = streetDataList.options;
        let name;
        if (e.target.name === "city") {
            name = "city";
        } else if (e.target.name === "street") {
            name = "street";
        } else {
            name = e.target.name;
        }

        const selectedValueCheck = Array.from(
            name === "city" ? cities : streets
        ).find((name) => name.value === e.target.value);
        if (selectedValueCheck) {
            // user selected a valid value, submit the form
            return setUserFields({
                ...userFields,
                address: {
                    ...userFields.address,
                    [name]: selectedValueCheck.value,
                },
            });
        } else {
            // user did not select a valid value, display an error message
            setUserFields({
                ...userFields,
                address: { ...userFields.address, [name]: "" },
            });
            return (e.target.value = "");
        }
    };



    const handleSubmit = async (e) => {
        const form = formRef.current;
        const notInvalidFields = Array.from(form.querySelectorAll(":valid"));
        notInvalidFields.forEach((validField) => {
            validField.style.borderColor = "black";
            if (form.querySelector(`p#${validField.name}`)) {
                form.querySelector(`p#${validField.name}`).remove();
            }
        });
        if (form.checkValidity()) {
            // start submitting the form and handle API calls
            // don't forget to empty the cart
            // don't forget to empty the cart
            // don't forget to empty the cart
            // don't forget to empty the cart
            // don't forget to empty the cart
            props.setPopup(<Popup content={'שולח את ההזמנה.'} show={true}/>);
            let user;
            let stores = []

            props?.userData?.cart?.forEach((store) => {
                store.productsIds = [];
                store.products.forEach((product) => {
                    console.log('product')
                    console.log(product)
                        store.productsIds.push({productId: product.productId, count: product.count}) 
                })
                stores.push(store);
            })

            props.setPopup(<Popup content={'מכין את החנויות בהזמנה'} show={true}/>);

            if (props?.isLoggedIn && props?.userData?.id) {
                await props.setPopup(<Popup content={'מעדכן נתוני משתמש'} show={true}/>);
                const updateUserRes = await  axios.put(`/api/users/${props?.userData?.id}`, {...userFields,});
                const updatedUser = await updateUserRes.data.user;
                if (await updatedUser) {
                    props.setPopup(<Popup content={'נתוני משתמש עודכנו'} show={true}/>);
                    console.log('user updated res');
                    console.log(updatedUser);
                    user = await updatedUser

                }
            } else {
                const username = await usernameFromEmail(userFields.email) ;
                if (await username) {
                    props.setPopup(<Popup content={'מכין משתמש חדש'} show={true}/>);
                    axios.post(`/api/users/`, {...userFields, password: username}).then((res) => {
                        if (res.status === 200) {
                            props.setPopup(<Popup content={'משתמש חדש נוצר'} show={true}/>);
                            console.log('user created res');
                            console.log(res);
                            user = res.data.user
                        }
                    });
                }
            }

            console.log('user')
            console.log(user)

            let storeOrdersIds = []; // for fullOrders

            if (Array.isArray(stores)) {
                await Promise.all(stores.map( async (store) => {
    
                    const newStoreRes = await axios.post(`/api/storeOrders`, 
                        {
                            status: 'progress',
                            userId: user.id,
                            storeId: store.storeId,
                            productsIds: [...store.products.map((product) => {
                                return product.productId;
                            })],
                            productsObj: [...store.products.map((product) => {
                                return {productId : product.productId, count: product.count};
                            })]
                        })
                        const newStore = await newStoreRes.data;
                        if (await newStore) {
                            console.log('res of storeOrders')
                            console.log(newStore)
                            storeOrdersIds.push(newStore.id)
                            props.setPopup(<Popup content={'קבלת חנות נוצרה'} show={true}/>);
                        }
                }))
            
            }
            
            const newFullOrderRes = await axios.post(`/api/fullOrders`, {
                storeOrdersIds: storeOrdersIds,
                userId: user.id,
                status: `0/${storeOrdersIds.length}`,
            });
            await props.setPopup(<Popup content={'יוצר קבלה מלאה'} show={true}/>);
            const {fullOrder} = await newFullOrderRes.data;
            
            if (await fullOrder) {
                props.setPopup(<Popup content={'קבלה מלאה נוצרה'} show={true}/>);
                console.log('newFullOrder');
                console.log(fullOrder);
            }

            const updateUserRes = await axios.put(`/api/users/${props?.userData?.id}`, {
                fullOrdersIds: [...user.fullOrdersIds, fullOrder.id]
            })
            const updatedUser = await updateUserRes.data.user;

            if (updatedUser) {
                console.log('updatedUser')
                console.log(updatedUser)
                props.setPopup(<Popup content={'המשתמש עודכן בקבלה המלאה החדשה'} show={true}/>);
                setTimeout(() => {
                    props.setPopup(<Popup content={'המשתמש עודכן בקבלה המלאה החדשה'} show={false}/>);
                }, 1500);
            }

        } else {
            // form is invalid, handle invalid fields and show the error to user.
            const invalidFields = Array.from(form.querySelectorAll(":invalid"));
            invalidFields.forEach((field) => {
                const p = document.createElement("p");
                p.style = "margin:0";
                p.setAttribute("id", field.name);
                let invalidField = form.querySelector(`#${field.name}`);
                if (field.name === "city" || field.name === "street") {
                    invalidField = form.querySelector(`#${field.name}_input`);
                }
                invalidField.style.borderColor = "red";
                p.innerText = `${
                    invalidField.closest("div").querySelector("label").innerText
                } : ${field.validationMessage}`;
                if (!form.querySelector(`p#${field.name}`)) {
                    form.append(p);
                }
            });
        }
    };

    return (
        <div className={`${styles.wrapper} wrapper`}>
            <h1>עמוד תשלום</h1>
            <div className={styles.content}>
                <div className={styles.userDetails}>
                    <h3>פרטי משלוח ותשלום</h3>
                    <CheckoutForm
                        userFields={userFields}
                        setUserFields={setUserFields}
                        userData={props?.userData}
                        formRef={formRef}
                        cityDatalistRef={cityDatalistRef}
                        streetDatalistRef={streetDatalistRef}
                        cities={cities}
                        streets={streets}
                        handleSelectFields={handleSelectFields}
                    />
                </div>
                <div className={styles.cartDetails}>
                    <h3>הפריטים שלי</h3>
                    <div className={styles.cart}>
                        {<CartTable userData={props?.userData} />}
                    </div>
                    <button onClick={(e) => handleSubmit(e)}>הזמנה</button>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
