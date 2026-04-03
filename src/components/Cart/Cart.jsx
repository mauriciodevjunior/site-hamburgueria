import { useCart } from "../../contexts/CartContext";
import "./Cart.css";

export default function Cart() {
  const {
    items,
    total,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCheckout,
    getTotals,
  } = useCart();

  if (!isOpen) return null;

  const totals = getTotals();

  return (
    <div className="cart-overlay" onClick={toggleCart}>
      <div className="cart" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>🛒 Seu Carrinho</h3>
          <button className="cart-close" onClick={toggleCart}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Seu carrinho está vazio</p>
            <button className="btn" onClick={toggleCart}>
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>R$ {item.price}</p>
                    <div className="cart-item-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary">
                <div className="cart-total">
                  <strong>
                    Total: R$ {total.toFixed(2).replace(".", ",")}
                  </strong>
                </div>
                {totals.discount && parseFloat(totals.discount) > 0 && (
                  <div className="cart-discount">
                    <small>
                      💰 Até R$ {totals.discount.replace(".", ",")} de desconto
                      no PIX!
                    </small>
                  </div>
                )}
              </div>
              <div className="cart-actions">
                <button className="btn btn-outline" onClick={clearCart}>
                  Limpar
                </button>
                <button className="btn" onClick={toggleCheckout}>
                  Finalizar Pedido
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
