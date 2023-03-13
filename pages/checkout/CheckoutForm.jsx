import React from 'react';
import styles from './checkout.module.scss'

const CheckoutForm = (props) => {

    const userFields = props?.userFields;
    const setUserFields = props?.setUserFields;
    const formRef = props?.formRef;
    const cityDatalistRef = props?.cityDatalistRef;
    const streetDatalistRef = props?.streetDatalistRef;
    const cities = props?.cities;
    const streets = props?.streets;
    const handleSelectFields = props?.handleSelectFields;

  return (
    <form ref={formRef} className={styles.form}>
                        <div className={styles.section}>
                            <div className={styles.column}>
                                <label htmlFor="firstname">שם פרטי</label>
                                <input
                                    required
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    defaultValue={props?.userData?.firstname}
                                    onChange={(e) =>
                                        setUserFields({
                                            ...userFields,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="lastname">שם משפחה</label>
                                <input
                                    required
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    defaultValue={props?.userData?.lastname}
                                    onChange={(e) =>
                                        setUserFields({
                                            ...userFields,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.column}>
                                <label htmlFor="email">אימייל</label>
                                <input
                                    required
                                    className={styles.email}
                                    type="email"
                                    id="email"
                                    name="email"
                                    defaultValue={props?.userData?.email}
                                    onChange={(e) =>
                                        setUserFields({
                                            ...userFields,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="mobilephone">טלפון</label>
                                <input
                                    required
                                    className={styles.phone}
                                    type="number"
                                    id="mobilephone"
                                    name="mobilephone"
                                    defaultValue={props?.userData?.mobilephone}
                                    onChange={(e) =>
                                        setUserFields({
                                            ...userFields,
                                            [e.target.name]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className={styles.section}>
                            {/* <div className={styles.column}>
                                <label htmlFor="idNumber">תעודת זהות</label>
                                <input
                                    required
                                    className={styles.idNumber}
                                    type="number"
                                    id="idNumber"
                                    name="idNumber"
                                    onChange={(e) => setUserFields({...userFields, [e.target.name] : e.target.value})}
                                />
                            </div> */}
                            <div className={styles.column}>
                                <label htmlFor="city">עיר</label>
                                <input
                                    type="text"
                                    id="city_input"
                                    list="city"
                                    name="city"
                                    required
                                    onBlur={(e) => handleSelectFields(e)}
                                />
                                <datalist
                                    id="city"
                                    required
                                    ref={cityDatalistRef}
                                >
                                    <option selected disabled>
                                        בחירת עיר
                                    </option>
                                    {cities?.map((city) => {
                                        return (
                                            <option
                                                key={`${city?._id} ${city?.שם_ישוב}`}
                                            >
                                                {city?.שם_ישוב}
                                            </option>
                                        );
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="street">רחוב</label>
                                <input
                                    type="text"
                                    id="street_input"
                                    list="street"
                                    name="street"
                                    placeholder="בחירת כתובת (ללא מספר)"
                                    required
                                    onBlur={(e) => handleSelectFields(e)}
                                />
                                <datalist
                                    id="street"
                                    name="street"
                                    ref={streetDatalistRef}
                                >
                                    {streets?.map((street) => {
                                        return (
                                            <option
                                                key={`${street?._id} ${street?.שם_רחוב}`}
                                            >
                                                {street.שם_רחוב}
                                            </option>
                                        );
                                    })}
                                </datalist>
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.column}>
                                <label htmlFor="streetNumber">מספר בית</label>
                                <input
                                    required
                                    type="number"
                                    id="streetNumber"
                                    name="streetNumber"
                                    onChange={(e) =>
                                        setUserFields({...userFields,address: {...userFields.address,[e.target.name]: e.target.value}})
                                    }
                                />
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="entrance">כניסה</label>
                                <input
                                    type="text"
                                    id="entrance"
                                    name="entrance"
                                    onChange={(e) =>
                                        setUserFields({...userFields,address: {...userFields.address,[e.target.name]: e.target.value}})
                                    }
                                />
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="floor">קומה</label>
                                <input
                                    required
                                    type="number"
                                    id="floor"
                                    name="floor"
                                    onChange={(e) =>
                                        setUserFields({...userFields,address: {...userFields.address,[e.target.name]: e.target.value}})
                                    }
                                />
                            </div>
                            <div className={styles.column}>
                                <label htmlFor="apt">דירה</label>
                                <input
                                    required
                                    type="number"
                                    id="apt"
                                    name="apt"
                                    onChange={(e) =>
                                        setUserFields({...userFields,address: {...userFields.address,[e.target.name]: e.target.value}})
                                    }
                                />
                            </div>
                        </div>
                    </form>
  )
}

export default CheckoutForm
