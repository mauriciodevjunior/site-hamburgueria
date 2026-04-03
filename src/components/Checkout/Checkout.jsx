import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import "./Checkout.css";

export default function Checkout() {
    const {
        items,
        orderType,
        paymentMethod,
        customer,
        isCheckoutMode,
        setOrderType,
        setPaymentMethod,
        updateCustomer,
        getTotals,
        getWhatsAppUrl,
        isValidForCheckout,
        toggleCheckout,
        ORDER_TYPES,
        PAYMENT_METHODS,
    } = useCart();

    const [errors, setErrors] = useState({});

    if (!isCheckoutMode) return null;

    const totals = getTotals();
    const whatsappUrl = getWhatsAppUrl();

    const handleOrderTypeChange = (type) => {
        setOrderType(type);
        setErrors((prev) => ({ ...prev, orderType: null }));
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        setErrors((prev) => ({ ...prev, paymentMethod: null }));
    };

    const handleCustomerChange = (field, value) => {
        updateCustomer({ [field]: value });
        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!orderType) newErrors.orderType = "Selecione o tipo de pedido";
        if (!paymentMethod)
            newErrors.paymentMethod = "Selecione a forma de pagamento";
        if (!customer.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!customer.phone.trim()) newErrors.phone = "Telefone é obrigatório";
        if (orderType === "entrega" && !customer.address.trim()) {
            newErrors.address = "Endereço é obrigatório para entrega";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (whatsappUrl) {
            window.open(whatsappUrl, "_blank");
            toggleCheckout();
            // Aqui você poderia limpar o carrinho ou redirecionar
        }
    };

    return (
        <div className="checkout-overlay" onClick={toggleCheckout}>
            <div className="checkout" onClick={(e) => e.stopPropagation()}>
                <div className="checkout-header">
                    <h2>🍔 Finalizar Pedido</h2>
                    <button className="checkout-close" onClick={toggleCheckout}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    {/* Tipo de Pedido */}
                    <div className="checkout-section">
                        <h3>📍 Tipo de Pedido</h3>
                        <div className="order-types">
                            {Object.entries(ORDER_TYPES).map(([key, config]) => (
                                <label
                                    key={key}
                                    className={`order-type ${orderType === key ? "active" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="orderType"
                                        value={key}
                                        checked={orderType === key}
                                        onChange={(e) => handleOrderTypeChange(e.target.value)}
                                    />
                                    <div className="order-type-content">
                                        <strong>{config.label}</strong>
                                        {config.fee > 0 && (
                                            <span className="fee">
                                                + R$ {config.fee.toFixed(2).replace(".", ",")} taxa
                                            </span>
                                        )}
                                        {config.discount > 0 && (
                                            <span className="discount">
                                                {config.discount * 100}% desconto
                                            </span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.orderType && (
                            <span className="error">{errors.orderType}</span>
                        )}
                    </div>

                    {/* Forma de Pagamento */}
                    {orderType && (
                        <div className="checkout-section">
                            <h3>💳 Forma de Pagamento</h3>
                            <div className="payment-methods">
                                {ORDER_TYPES[orderType].paymentMethods.map((method) => (
                                    <label
                                        key={method}
                                        className={`payment-method ${paymentMethod === method ? "active" : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={(e) =>
                                                handlePaymentMethodChange(e.target.value)
                                            }
                                        />
                                        <span>{PAYMENT_METHODS[method]}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.paymentMethod && (
                                <span className="error">{errors.paymentMethod}</span>
                            )}
                        </div>
                    )}

                    {/* Dados do Cliente */}
                    <div className="checkout-section">
                        <h3>👤 Seus Dados</h3>
                        <div className="customer-fields">
                            <div className="field">
                                <label>Nome Completo *</label>
                                <input
                                    type="text"
                                    value={customer.name}
                                    onChange={(e) => handleCustomerChange("name", e.target.value)}
                                    placeholder="Digite seu nome completo"
                                    required
                                />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>

                            <div className="field">
                                <label>Telefone *</label>
                                <input
                                    type="tel"
                                    value={customer.phone}
                                    onChange={(e) =>
                                        handleCustomerChange("phone", e.target.value)
                                    }
                                    placeholder="(55) 51999-99999"
                                    required
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>

                            {orderType === "entrega" && (
                                <div className="field">
                                    <label>Endereço Completo *</label>
                                    <textarea
                                        value={customer.address}
                                        onChange={(e) =>
                                            handleCustomerChange("address", e.target.value)
                                        }
                                        placeholder="Rua, número, bairro, complemento"
                                        rows={3}
                                        required
                                    />
                                    {errors.address && (
                                        <span className="error">{errors.address}</span>
                                    )}
                                </div>
                            )}

                            <div className="field">
                                <label>Observações (opcional)</label>
                                <textarea
                                    value={customer.notes}
                                    onChange={(e) =>
                                        handleCustomerChange("notes", e.target.value)
                                    }
                                    placeholder="Ex: Sem cebola, bem passado, etc."
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="checkout-section">
                        <h3>📋 Resumo do Pedido</h3>
                        <div className="order-summary">
                            {items.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <span>
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span>
                                        R${" "}
                                        {(parseFloat(item.price.replace(",", ".")) * item.quantity)
                                            .toFixed(2)
                                            .replace(".", ",")}
                                    </span>
                                </div>
                            ))}

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>R$ {totals.subtotal.replace(".", ",")}</span>
                                </div>
                                {parseFloat(totals.discount) > 0 && (
                                    <div className="summary-row discount">
                                        <span>Desconto PIX:</span>
                                        <span>- R$ {totals.discount.replace(".", ",")}</span>
                                    </div>
                                )}
                                {parseFloat(totals.fee) > 0 && (
                                    <div className="summary-row">
                                        <span>Taxa de entrega:</span>
                                        <span>R$ {totals.fee.replace(".", ",")}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <strong>Total:</strong>
                                    <strong>R$ {totals.total.replace(".", ",")}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="checkout-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={toggleCheckout}
                        >
                            Voltar ao Carrinho
                        </button>
                        <button
                            type="submit"
                            className="btn"
                            disabled={!isValidForCheckout()}
                        >
                            📱 Enviar Pedido pelo WhatsApp
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
