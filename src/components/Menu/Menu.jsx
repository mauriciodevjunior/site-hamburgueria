import { useCart } from "../../contexts/CartContext";
import "./Menu.css";

export default function Menu() {
    const { addItem } = useCart();

    const items = [
        {
            id: 1,
            name: "Burger Clássico",
            image:
                "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
            description:
                "Pão brioche, 180g de carne, queijo cheddar, alface, tomate e molho especial",
            price: "28,90",
            badge: "Mais Vendido",
            badgeClass: "",
        },
        {
            id: 2,
            name: "Burger Bacon",
            image:
                "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
            description:
                "Pão brioche, 180g de carne, bacon crocante, queijo, cebola caramelizada",
            price: "34,90",
            badge: null,
        },
        {
            id: 3,
            name: "Burger Duplo",
            image:
                "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
            description:
                "Pão brioche, 2x 180g de carne, dobro de queijo, bacon e molho barbecue",
            price: "42,90",
            badge: "Novidade",
            badgeClass: "hot",
        },
        {
            id: 4,
            name: "Burger Veggie",
            image:
                "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
            description:
                "Pão integral, hambúrguer de grão de bico, queijo, rúcula e maionese verde",
            price: "32,90",
            badge: null,
        },
        {
            id: 5,
            name: "Batata Frita",
            image:
                "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop",
            description:
                "Porção generosa de batatas fritas crocantes com sal e temperos especiais",
            price: "18,90",
            badge: null,
        },
        {
            id: 6,
            name: "Milk Shake",
            image:
                "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop",
            description:
                "Milk shake cremoso nos sabores chocolate, morango ou ovomaltine (400ml)",
            price: "16,90",
            badge: null,
        },
    ];

    return (
        <section id="cardapio" className="cardapio">
            <h2>Nosso Cardápio</h2>
            <p>Escolha seu favorito e faça seu pedido pelo WhatsApp</p>

            <ul className="menu-grid">
                {items.map((item) => (
                    <li key={item.id}>
                        <img src={item.image} alt={item.name} />
                        {item.badge && (
                            <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
                        )}
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <strong>R$ {item.price}</strong>
                        <div className="menu-item-actions">
                            <button className="btn" onClick={() => addItem(item)}>
                                Adicionar ao Carrinho
                            </button>
                            <a
                                href={`https://wa.me/5511999999999?text=Olá! Gostaria de pedir um ${item.name}`} target="_blank"
                                className="btn btn-outline"
                            >
                                Pedir Agora
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
