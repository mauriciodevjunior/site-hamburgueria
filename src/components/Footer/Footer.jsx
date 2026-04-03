import "./Footer.css";

export default function Footer() {
    return (
        <footer id="contato">
            <section>
                <h3>🍔 Burger House</h3>
                <p>O melhor hambúrguer artesanal da cidade.</p>
            </section>

            <section>
                <h4>Horário</h4>
                <p>Terça a Domingo 18h às 23h</p>
            </section>

            <section>
                <h4>Contato</h4>
                <p>📱 (51) 99501-0567 📍 Rua dos Hambúrgueres, 123</p>
            </section>

            <section>
                <h4>Redes Sociais</h4>
                <p>Instagram</p>
            </section>

            <div className="copy">
                <p>© 2025 - DevBurger</p>
            </div>
        </footer>
    );
}
