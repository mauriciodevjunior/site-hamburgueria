/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from "react";

// Constantes das regras de negócio
export const ORDER_TYPES = {
    retirada: {
        label: "Retirada no Balcão",
        paymentMethods: ["dinheiro", "pix", "cartao"],
        fee: 0,
        discount: 0,
        requiresAddress: false,
    },
    entrega: {
        label: "Entrega em Casa",
        paymentMethods: ["dinheiro", "pix", "cartao"],
        fee: 5.0,
        discount: 0,
        requiresAddress: true,
    },
    pix_antecipado: {
        label: "PIX Antecipado (5% desconto)",
        paymentMethods: ["pix"],
        fee: 0,
        discount: 0.05,
        requiresAddress: false, // pode escolher depois
    },
};

export const ORDER_STATUS = {
    pendente_pagamento: "Aguardando comprovante PIX",
    confirmado: "Pedido confirmado",
    em_producao: "Em produção",
    pronto_retirada: "Pronto para retirada",
    em_rota: "Saiu para entrega",
    entregue: "Pedido entregue",
    cancelado: "Pedido cancelado",
};

export const PAYMENT_METHODS = {
    dinheiro: "Dinheiro",
    pix: "PIX",
    cartao: "Cartão de Crédito/Débito",
};

// Estado inicial expandido
const initialState = {
    // Carrinho
    items: [],
    total: 0,

    // Tipo de pedido
    orderType: null, // 'retirada' | 'entrega' | 'pix_antecipado'
    paymentMethod: null, // 'dinheiro' | 'pix' | 'cartao'

    // Dados do cliente
    customer: {
        name: "",
        phone: "",
        address: "",
        notes: "",
    },

    // Status e controle
    status: null, // status do pedido
    isOpen: false,
    isCheckoutMode: false,
};

// Funções auxiliares
function calculateItemTotal(price, quantity) {
    const numericPrice = parseFloat(price.replace(",", "."));
    return numericPrice * quantity;
}

function calculateCartTotal(items, orderType) {
    const subtotal = items.reduce((total, item) => {
        return total + calculateItemTotal(item.price, item.quantity);
    }, 0);

    const discount =
        orderType === "pix_antecipado"
            ? subtotal * ORDER_TYPES.pix_antecipado.discount
            : 0;
    const fee = orderType === "entrega" ? ORDER_TYPES.entrega.fee : 0;

    return {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        fee: fee.toFixed(2),
        total: (subtotal - discount + fee).toFixed(2),
    };
}

function generateWhatsAppMessage(state) {
    const { items, orderType, paymentMethod, customer } = state;
    const totals = calculateCartTotal(items, orderType);
    const orderTypeInfo = ORDER_TYPES[orderType];

    let message = `Olá! Gostaria de fazer um pedido:\n\n`;

    // Cabeçalho
    if (orderType === "pix_antecipado") {
        message += `🍔 *PEDIDO PIX ANTECIPADO*\n`;
    } else {
        message += `🍔 *PEDIDO ${orderTypeInfo.label.toUpperCase()}*\n`;
    }

    // Itens
    message += `Itens:\n`;
    items.forEach((item) => {
        const itemTotal = calculateItemTotal(item.price, item.quantity);
        message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal
            .toFixed(2)
            .replace(".", ",")}\n`;
    });

    // Totais
    message += `\n💰 Subtotal: R$ ${totals.subtotal.replace(".", ",")}`;
    if (parseFloat(totals.discount) > 0) {
        message += `\n💰 Desconto PIX: R$ ${totals.discount.replace(".", ",")}`;
    }
    if (parseFloat(totals.fee) > 0) {
        message += `\n🚚 Taxa entrega: R$ ${totals.fee.replace(".", ",")}`;
    }
    message += `\n💰 *Total: R$ ${totals.total.replace(".", ",")}*\n`;

    // Dados do cliente
    message += `\n👤 Nome: ${customer.name}`;
    message += `\n📞 Telefone: ${customer.phone}`;
    if (orderType === "entrega" && customer.address) {
        message += `\n📍 Endereço: ${customer.address}`;
    }
    message += `\n💳 Pagamento: ${PAYMENT_METHODS[paymentMethod]}`;

    if (customer.notes) {
        message += `\n📝 Observações: ${customer.notes}`;
    }

    // Instruções específicas
    if (orderType === "pix_antecipado") {
        message += `\n\n💰 *INSTRUÇÕES DE PAGAMENTO*`;
        message += `\nPIX: [sua-chave-pix-aqui]`;
        message += `\nApós pagamento, envie o comprovante!`;
        message += `\n⏰ Prazo: 30 minutos`;
    } else if (orderType === "entrega") {
        message += `\n\n🚚 Entrega em até 40min ou dinheiro de volta!`;
    } else {
        message += `\n\n🏪 Retire quando chegar na loja!`;
    }

    return encodeURIComponent(message);
}

// Reducer expandido
function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );

            let newItems;
            if (existingItem) {
                // Limitar quantidade máxima
                const newQuantity = Math.min(existingItem.quantity + 1, 10);
                newItems = state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: 1 }];
            }

            const totals = calculateCartTotal(newItems, state.orderType);

            return {
                ...state,
                items: newItems,
                total: parseFloat(totals.total),
            };
        }

        case "REMOVE_ITEM": {
            const newItems = state.items.filter((item) => item.id !== action.payload);
            const totals = calculateCartTotal(newItems, state.orderType);

            return {
                ...state,
                items: newItems,
                total: parseFloat(totals.total),
            };
        }

        case "UPDATE_QUANTITY": {
            const newItems = state.items
                .map((item) =>
                    item.id === action.payload.id
                        ? {
                            ...item,
                            quantity: Math.max(1, Math.min(action.payload.quantity, 10)),
                        }
                        : item
                )
                .filter((item) => item.quantity > 0);

            const totals = calculateCartTotal(newItems, state.orderType);

            return {
                ...state,
                items: newItems,
                total: parseFloat(totals.total),
            };
        }

        case "SET_ORDER_TYPE": {
            const newOrderType = action.payload;
            const totals = calculateCartTotal(state.items, newOrderType);

            // Reset payment method if not compatible
            const compatiblePayments = ORDER_TYPES[newOrderType].paymentMethods;
            const currentPaymentValid =
                state.paymentMethod && compatiblePayments.includes(state.paymentMethod);

            return {
                ...state,
                orderType: newOrderType,
                paymentMethod: currentPaymentValid ? state.paymentMethod : null,
                total: parseFloat(totals.total),
            };
        }

        case "SET_PAYMENT_METHOD": {
            return {
                ...state,
                paymentMethod: action.payload,
            };
        }

        case "UPDATE_CUSTOMER": {
            return {
                ...state,
                customer: { ...state.customer, ...action.payload },
            };
        }

        case "SET_STATUS": {
            return {
                ...state,
                status: action.payload,
            };
        }

        case "TOGGLE_CART": {
            return { ...state, isOpen: !state.isOpen };
        }

        case "TOGGLE_CHECKOUT": {
            return { ...state, isCheckoutMode: !state.isCheckoutMode };
        }

        case "CLEAR_CART":
            return { ...initialState };

        case "LOAD_CART": {
            const loadedState = action.payload;
            const totals = calculateCartTotal(
                loadedState.items || [],
                loadedState.orderType
            );
            return {
                ...loadedState,
                total: parseFloat(totals.total),
                isOpen: false,
                isCheckoutMode: false,
            };
        }

        default:
            return state;
    }
}

// Context
const CartContext = createContext();

// Provider
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Carregar do localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                dispatch({ type: "LOAD_CART", payload: cartData });
            } catch (error) {
                console.error("Erro ao carregar carrinho:", error);
            }
        }
    }, []);

    // Salvar no localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state));
    }, [state]);

    // Funções do carrinho
    const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
    const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
    const updateQuantity = (id, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });
    const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
    const toggleCheckout = () => dispatch({ type: "TOGGLE_CHECKOUT" });

    // Funções de pedido
    const setOrderType = (type) =>
        dispatch({ type: "SET_ORDER_TYPE", payload: type });
    const setPaymentMethod = (method) =>
        dispatch({ type: "SET_PAYMENT_METHOD", payload: method });
    const updateCustomer = (data) =>
        dispatch({ type: "UPDATE_CUSTOMER", payload: data });
    const setStatus = (status) =>
        dispatch({ type: "SET_STATUS", payload: status });

    // Utilitários
    const getTotals = () => calculateCartTotal(state.items, state.orderType);
    const getWhatsAppUrl = () => {
        if (!state.orderType || !state.paymentMethod || state.items.length === 0) {
            return null;
        }
        const message = generateWhatsAppMessage(state);
        return `https://wa.me/5551995010567?text=${message}`;
    };

    // Validações
    const isValidForCheckout = () => {
        const hasItems = state.items.length > 0;
        const hasOrderType = !!state.orderType;
        const hasPaymentMethod = !!state.paymentMethod;
        const hasName = state.customer.name.trim().length > 0;
        const hasPhone = state.customer.phone.trim().length > 0;
        const hasAddress =
            state.orderType === "entrega"
                ? state.customer.address.trim().length > 0
                : true;

        return (
            hasItems &&
            hasOrderType &&
            hasPaymentMethod &&
            hasName &&
            hasPhone &&
            hasAddress
        );
    };

    return (
        <CartContext.Provider
            value={{
                // Estado
                ...state,

                // Ações do carrinho
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                toggleCart,
                toggleCheckout,

                // Ações do pedido
                setOrderType,
                setPaymentMethod,
                updateCustomer,
                setStatus,

                // Utilitários
                getTotals,
                getWhatsAppUrl,
                isValidForCheckout,

                // Constantes
                ORDER_TYPES,
                ORDER_STATUS,
                PAYMENT_METHODS,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook personalizado
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
