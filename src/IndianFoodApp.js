import React, { useState } from "react";
import "./styles.css";

export default function IndianFoodApp() {
  const [order, setOrder] = useState(null);
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState(false);
  const [showError, setShowError] = useState(false);

  const deliveryFee = 49;

  const menu = [
    {
      name: "Chicken Tikka Masala",
      price: 139,
      image: "/chicken.png",
      alt: "Bilde av retten Chicken Tikka Masala",
      title: "Chicken Tikka Masala",
    },
    {
      name: "Palak Paneer",
      price: 129,
      image: "/palak.png",
      alt: "Bilde av retten Palak Paneer",
      title: "Palak Paneer",
    },
    {
      name: "Lamb Vindaloo",
      price: 149,
      image: "/vindaloo.png",
      alt: "Bilde av retten Lamb Vindaloo",
      title: "Lamb Vindaloo",
    },
    {
      name: "Vegetar Thali",
      price: 119,
      image: "/vegetar.png",
      alt: "Bilde av retten Vegetar Thali",
      title: "Vegetar Thali",
    },
  ];

  const handleOrder = (dish) => {
    const existing = cart.find((item) => item.name === dish.name);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
    setOrder(dish);
  };

  const handleRemove = (dishName) => {
    const updatedCart = cart
      .map((item) =>
        item.name === dishName ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
  };

  const totalPrice =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    (delivery ? deliveryFee : 0);

  const handlePaymentClick = () => {
    setShowError(true);
  };

  return (
    <main className="trainfood-container dyslexia-friendly">
      <div className="header">
        <h1 className="tagline">Bestill indisk take-away</h1>
        <img
          src="/restaurantlogo.png"
          alt="Logo for indisk take-away"
          className="logo"
        />
      </div>

      <p>Velg dine favorittretter og hent maten selv eller få den levert.</p>

      <ul className="menu-list">
        {menu.map((dish, index) => (
          <li key={index} className="menu-item">
            <img
              src={dish.image}
              alt={dish.alt}
              title={dish.title}
              className="dish-image"
            />
            <span className="dish-name">{dish.name}</span>
            <span className="dish-price">{dish.price} kr</span>
            <button
              className="order-button"
              onClick={() => handleOrder(dish)}
              aria-label={`Bestill ${dish.name}`}
            >
              Bestill
            </button>
          </li>
        ))}
      </ul>

      {order && (
        <div className="confirmation">
          Du har bestilt <strong>{order.name}</strong>. Takk for bestillingen!
        </div>
      )}

      <div className="cart-info">
        <p>
          🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)} retter i
          handlevognen
        </p>
        {cart.map((dish, i) => (
          <div key={i} className="cart-line">
            <span>
              {dish.quantity}x {dish.name}
            </span>
            <span className="price-right">
              {dish.price * dish.quantity} kr{" "}
              <button
                className="remove-button"
                onClick={() => handleRemove(dish.name)}
                title="Fjern én"
              >
                🗑️
              </button>
            </span>
          </div>
        ))}
        {delivery && (
          <div className="cart-line">
            <span>Frakt</span>
            <span className="price-right">{deliveryFee} kr</span>
          </div>
        )}
        <hr />
        <div className="cart-line total">
          <strong>Totalt</strong>
          <strong className="price-right">{totalPrice} kr</strong>
        </div>

        <div className="delivery-toggle">
          <label>
            <input
              type="checkbox"
              checked={delivery}
              onChange={() => setDelivery(!delivery)}
            />
            <span className="delivery-emoji">🚚</span> Jeg ønsker levering med
            Wolt (+{deliveryFee} kr)
            <img
              src="/woltlogo.png"
              alt="Logo for leveringstjenesten Wolt"
              className="wolt-logo"
            />
          </label>
          {delivery && (
            <div className="volt-info">
              <p className="easy-read">
                Levering skjer via Wolt til din dør. Du vil få beskjed når maten
                er på vei.
              </p>
            </div>
          )}
        </div>

        <p className="easy-read">
          💰 Betaling kun tilgjengelig via Vipps. Trykk her for å bli sendt
          videre til Vipps for betaling.
        </p>

        <button
          className="checkout-button"
          aria-label="Gå til betaling"
          onClick={handlePaymentClick}
        >
          Til betaling
        </button>
      </div>

      <img
        src="/vippslogo.png"
        alt="Vipps-logo for betaling"
        className="vipps-logo"
      />

      {showError && (
        <div className="error-message">
          ⚠️ Dette er en studentoppgave. Ikke prøv å faktisk betale. 😅
        </div>
      )}
    </main>
  );
}
