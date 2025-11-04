import styles from './requireTelegram.module.css'

function RequireTelegram(){
    return (
      <div className={styles.telegram__container}>
        <div className={styles.telegram__error_icon}>📱</div>
        <h2>Приложение доступно только в Telegram</h2>
        <p>Это приложение работает только внутри Telegram. Пожалуйста, откройте его через Telegram бота.</p>
        <div className={styles.telegram__instructions}>
          <p><strong>Как открыть:</strong></p>
          <ol>
            <li>Откройте Telegram</li>
            <li>Найдите нашего бота @YourBotName</li>
            <li>Нажмите на кнопку "Открыть магазин"</li>
          </ol>
        </div>
        <button 
          onClick={() => window.open('https://t.me/testshop12121_bot', '_blank')}
          className={styles.telegram__redirect_btn}
        >
          Открыть в Telegram
        </button>
      </div>
    );
}

export default RequireTelegram