import styles from './Home.module.scss'

export default function Home() {
  return (
    <main className={styles.wrapper}>
      <section>
        <h1>עסקימול - קניון העסקים הגדול</h1>
        <p>
          ברוכים הבאים לעסקימול - קניון העסקים הגדול! 
          <br />
          אצלינו תוכלו לרכוש מוצרים שווים מאנשים אחרים וגם לפתוח חנות ולמכור בעצמכם!
          <br />
        </p>
      </section>
      <section>
        <h2>המוצרים החדשים שלנו</h2>
      </section>
      <section>
        <h2>החנויות החדשות באתר</h2>
      </section>
    </main>
  )
}
