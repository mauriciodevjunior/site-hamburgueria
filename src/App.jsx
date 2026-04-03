import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {
  return (
    <CartProvider>
      <Header />
      <Hero />
      <Menu />
      <About />
      <CTA />
      <Footer />
      <Cart />
      <Checkout />
    </CartProvider>
  );
}

export default App;
