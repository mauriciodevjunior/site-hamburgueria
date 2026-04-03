import "./Hero.css";

export default function Hero() {
    return (
        <section id="home" className="hero-wrapper">
            <article className="hero">
                <div>
                    <h1>O Melhor Hamburguer da Cidade</h1>
                    <p>
                        Ingredientes frescos, receitas especiais e entrega rápida. Peça
                        agora e receba em até 40 minutos!
                    </p>
                    <nav className="hero-buttons">
                        <a href="#cardapio" className="btn">
                            Ver cardápio
                        </a>
                        <a href="https://wa.me/5551995010567" target="_blank" className="btn btn-outline">
                            📲 WhatsApp
                        </a>
                    </nav>
                    <ul className="hero-stats">
                        <li>
                            <strong>+500</strong>
                            Cliente felizes
                        </li>
                        <li>
                            <strong>4.9</strong>
                            Avaliação ⭐
                        </li>
                        <li>
                            <strong>40min</strong>
                            Ou seu dinheiro de volta
                        </li>
                    </ul>
                </div>

                <img
                    alt="hamburger"
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
            </article>
        </section>
    );
}
