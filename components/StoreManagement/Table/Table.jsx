import Image from 'next/image';
import React, { useEffect } from 'react'
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from 'react-icons/ai'
import styles from './table.module.scss'

const Table = (props) => {


	useEffect(() => {
		console.log('use effect in table')
	},[props?.products])

  return (
    <div className={styles.tableWrapper}>
					<table cellSpacing={0}>
						<thead >
							<tr>
								<th><input id="checkbox" onClick={(e) => props.handleSelectionAll(e)} style={{display:'none'}} type='checkbox'/><button onClick={(e) => props.handleSelectionAll(e)}>סימון הכל</button></th>
								{/* <th>מזהה</th> */}
								<th>תמונה ראשית</th>
								<th>שם המוצר</th> 
								<th>מחיר <small>(לפני מע&quot;מ)</small></th>
								<th>במבצע?</th>
								<th>מחיר מבצע <br /><small>(לפני מע&quot;מ)</small></th>
								<th>פורסם?</th>
								<th>מכירות</th>
								<th>תיאור קצר</th>
								<th>תיאור מלא</th>
								<th>גלרייה</th>
								<th>פעולות</th>
							</tr>
						</thead>
						<tbody> 
						{props?.products.map((product) => {
							return (
								<tr id={product.id} key={product.id}>
									<td style={{margin:'0 0 0 20px'}} className={styles.checkbox}><input onClick={(e) => props.handleCell(e)} type="checkbox" name="select" id={product.id} /></td> 
									{/* <td style={{textAlign:'center'}} className="identifier">{product.productIdentifier}</td> */}
									<td id='mainImage' style={{padding:'0'}} className={`${styles.mainImage} mainImage`}><div style={{justifyContent:'center'}}>{product.mainImage ? <><Image src={product.mainImage} width={100} height={100} alt={product.name + ' Main Image'}/><span className={`${styles.icons} icons`}><i onClick={(e) => props.handleCell(e)} className={styles.watchIcon} title="צפייה">{<AiOutlineEye/>}</i></span></> : 'אין תמונה ראשית'}</div></td>
									<td id='title' className={`${styles.title} title` }>{product.name}</td>
									<td id='price' className={`${styles.price} price` }>{product.price} ₪</td>
									<td id='onsaleq' className={`${styles.onsaleq} onsaleq` }>{product.onsale ? <i className={`${styles.checkIcon} checkIcon`}><AiFillCheckCircle/></i> : <i className={styles.closeIcon}><AiFillCloseCircle/></i> }</td>
									<td id='saleprice' style={{textAlign:'center'}} className={`${styles.saleprice} saleprice` }><span style={{textAlign:'right', width:'100%'}}>{product.saleprice} ₪</span></td>
									<td id='publishq' className={`${styles.publishq} publishq` }>{product.publishState ? <i className={`${styles.checkIcon} checkIcon`}><AiFillCheckCircle/></i> : <i className={styles.closeIcon}><AiFillCloseCircle/></i> }</td>
									<td id='salesq' className={`${styles.salesq} salesq` }>{"{salecount}"}</td>
									<td id='shortDesc' className={`${styles.shortDesc} shortDesc` }><div>{product.shortdescription ? <><span className={styles.shortDesc}>{props.trimString(product.shortdescription, 20)}</span> <span className={styles.icons}><i onClick={(e) => props.handleCell(e)} className={styles.watchIcon} title="צפייה">{<AiOutlineEye/>}</i></span></> : 'אין תיאור קצר'}</div></td>
									<td id='longDesc' className={`${styles.longDesc} longDesc` }><div>{product.description ? <><span className={styles.longDesc}>{props.trimString(product.description, 20)}</span> <span className={styles.icons}><i onClick={(e) => props.handleCell(e)} className={styles.watchIcon} title="צפייה">{<AiOutlineEye/>}</i></span></> : 'אין תיאור מלא'}</div></td>
									<td id='gallery' className={`${styles.gallery} gallery` }>{product.gallery.length > 0 ? <span className={styles.icons} style={{justifyContent:'center'}}><i onClick={(e) => props.handleCell(e)} className={styles.watchIcon} title="צפייה">{<AiOutlineEye/>}</i></span> : 'גלרייה ריקה'}</td>
									<td id='actions' className={`${styles.actions} actions` }>
                                        <span className={`${styles.icons} icons` }>
                                            <i onClick={(e) => props.handleCell(e)} name="edit" className={`${styles.editIcon} editIcon` } title="עריכה">{<AiOutlineEdit/>}</i>
                                            <i onClick={(e) => props.handleCell(e)} name="delete" className={`${styles.deleteIcon} deleteIcon` } title='מחיקה' >{<AiOutlineDelete/>}</i>
                                        </span>
                                    </td>
								</tr>
							)
						})}
						</tbody>
					</table>
				</div>
  )
}

export default Table
