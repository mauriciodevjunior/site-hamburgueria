import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import "./Header.css";

export default function Header() {
    const { items, toggleCart } = useCart();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header>
            <a href="#" className="logo">
                🍔 DevBurger
            </a>

            <button
                className={`menu-toggle ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menu"
            >
                ☰
            </button>

            <nav className={menuOpen ? "open" : ""}>
                <a href="#" onClick={() => setMenuOpen(false)}>Início</a>
                <a href="#cardapio" onClick={() => setMenuOpen(false)}>Cardápio</a>
                <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
                <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
            </nav>

            <div className="header-actions">
                <button className="cart-btn" onClick={toggleCart}>
                    🛒 {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                </button>

                <a
                    href="https://wa.me/5551995010567?text=Olá!%20Quero%20fazer%20um%20pedido"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                >
                    Peça Agora
                </a>
            </div>
        </header>
    );
}