import Link from 'next/link'
import React from 'react'

function AdminLayout({ children }) {
    return (
        <main className='adminPage'>
            <aside>
                <nav>
                    <ul>
                        <li><Link href="" >עמוד ניהול ראשי</Link></li>
                        <li><Link href="" >ניהול תפריטים</Link></li>
                        <li><Link href="" >הדר ופוטר</Link></li>
                        <li><Link href="" >ניהול צבעים</Link></li>
                        <li><Link href="" >עמודים</Link></li>
                        <li><Link href="" >משתמשים</Link></li>
                        <li><Link href="" >מוכרים</Link></li>
                        <li><Link href="" >חנויות</Link></li>
                        <li><Link href="" >מוצרים</Link></li>
                        <li><Link href="" >הזמנות</Link></li>
                    </ul>
                    <div>
                        <button>התנתקות</button>
                    </div>
                </nav>
            </aside>
            <div>{children}</div>
        </main>
    )
}

export default AdminLayout