import { useCart } from "../../context/CartContext";
import styles from './cartPage.module.css'

function CartPage() {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Ваша корзина пуста 🛒</p>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h2 className={styles.title}>Ваша корзина</h2>
      <div className={styles.list}>
        {cart.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
            <div className={styles.info}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.brand}>{item.brand}</p>
              <p className={styles.price}>${item.price.toFixed(2)}</p>
              <div className={styles.controls}>
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>
            <button className={styles.remove} onClick={() => removeItem(item.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className={styles.totalBox}>
        <p>
          <strong>Итого:</strong> ${total}
        </p>
        <button className={styles.checkoutBtn}>Оформить заказ</button>
      </div>
    </div>
  );
}

export default CartPage;
