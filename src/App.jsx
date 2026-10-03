import { useState } from "react"
import client from "./client"

function App() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [selectedQuantities, setSelectedQuantities] = useState({})

  const getSelectedQuantity = (id) => {
    return selectedQuantities[id] || 1
  }

  const changeSelectedQuantity = (id, amount) => {
    setSelectedQuantities((previous) => ({
      ...previous,
      [id]: Math.max(1, (previous[id] || 1) + amount),
    }))
  }

  const addToCart = (product) => {
    const quantity = getSelectedQuantity(product.id)

    const existing = cart.find(
      (item) => item.id === product.id
    )

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity,
        },
      ])
    }

    setShowCart(true)
  }

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const totalKg = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const createOrderLines = () => {
    return cart
      .map((item) => {
        const itemTotal = item.price * item.quantity

        return `${item.emoji} ${item.name}: ${item.quantity} kg × K${item.price}/kg = K${itemTotal}`
      })
      .join("\n")
  }

  const createOrderMessage = () => {
    return (
      `Hello ${client.businessName}, I would like to place an order:\n\n` +
      `${createOrderLines()}\n\n` +
      `TOTAL: K${total}\n\n` +
      `Please confirm my order, delivery location, delivery fee, and expected delivery time.`
    )
  }

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return

    const message = createOrderMessage()

    const whatsappUrl =
      `https://wa.me/${client.whatsapp}?text=` +
      encodeURIComponent(message)

    window.location.href = whatsappUrl
  }

  const sendEmailOrder = () => {
    if (cart.length === 0) return

    const message = createOrderMessage()

    const subject =
      `New Order - ${client.businessName}`

    const emailUrl =
      `mailto:${client.email}?subject=` +
      encodeURIComponent(subject) +
      `&body=` +
      encodeURIComponent(message)

    window.location.href = emailUrl
  }

  return (
    <div>
      <header>
        <div>
          <h1>{client.businessName}</h1>

          <p>
            Fresh Farm Products • Sold By Kilogram
          </p>
        </div>

        <button onClick={() => setShowCart(true)}>
          🛒 Cart (
          {cart.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}
          )
        </button>
      </header>

      <section className="hero">
        <h2>
          Fresh Farm Produce You Can Trust
        </h2>

        <p>
          Quality farm products carefully weighed
          and sold by the kilogram.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("products")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          Shop Fresh Produce
        </button>
      </section>

      <section id="products">
        <h2>Shop Fresh Produce</h2>

        <div className="products">
          {client.products.map((product) => {
            const quantity =
              getSelectedQuantity(product.id)

            const subtotal =
              product.price * quantity

            return (
              <div
                className="product-card"
                key={product.id}
              >
                {product.name === "Tomatoes" ? (
                  <img
                    src="/Tomato_je.jpg"
                    alt="Fresh tomatoes"
                    className="product-image"
                  />
                ) : (
                  <div className="product-emoji">
                    {product.emoji}
                  </div>
                )}

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <strong>
                  K{product.price} / kg
                </strong>

                <div className="quantity-box">
                  <button
                    onClick={() =>
                      changeSelectedQuantity(
                        product.id,
                        -1
                      )
                    }
                  >
                    −
                  </button>

                  <span>{quantity} kg</span>

                  <button
                    onClick={() =>
                      changeSelectedQuantity(
                        product.id,
                        1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <p className="subtotal">
                  Subtotal:{" "}
                  <strong>
                    K{subtotal}
                  </strong>
                </p>

                <button
                  className="add-button"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  🛒 Add {quantity} kg to Cart
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="help">
        <h2>How To Order</h2>

        <p>1. Select your product.</p>
        <p>2. Choose the number of kilograms.</p>
        <p>3. Add it to your cart.</p>
        <p>4. Review your order.</p>
        <p>
          5. Send your order through WhatsApp
          or Email.
        </p>
      </section>

      <section className="contact">
        <h2>
          Contact {client.businessName}
        </h2>

        <p>
          📱 WhatsApp:{" "}
          <a
            href={`https://wa.me/${client.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
        </p>

        <p>
          📧 Email:{" "}
          <a href={`mailto:${client.email}`}>
            {client.email}
          </a>
        </p>

        <p>
          📘 Facebook:{" "}
          <a
            href={client.facebook}
            target="_blank"
            rel="noreferrer"
          >
            Visit Facebook
          </a>
        </p>

        <p>
          💬 Messenger:{" "}
          <a
            href="https://m.me/bruno.audreyphiri"
            target="_blank"
            rel="noreferrer"
          >
            Message Us on Messenger
          </a>
        </p>
      </section>

      <footer>
        <p>
          © 2026 {client.businessName}.
          All rights reserved.
        </p>
      </footer>

      {showCart && (
        <div className="cart-overlay">
          <div className="cart">
            <button
              onClick={() => setShowCart(false)}
            >
              ✕ Close
            </button>

            <h2>Your Order</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    className="cart-item"
                    key={item.id}
                  >
                    <div>
                      <strong>
                        {item.emoji}{" "}
                        {item.name}
                      </strong>

                      <p>
                        K{item.price} / kg
                      </p>
                    </div>

                    <div className="cart-controls">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity} kg
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <strong>
                      K
                      {item.price *
                        item.quantity}
                    </strong>
                  </div>
                ))}

                <div className="cart-summary">
                  <p>
                    Total quantity:{" "}
                    <strong>
                      {totalKg} kg
                    </strong>
                  </p>

                  <h3>
                    TOTAL: K{total}
                  </h3>
                </div>

                <button
                  className="whatsapp-button"
                  onClick={
                    sendWhatsAppOrder
                  }
                >
                  📱 Order on WhatsApp
                </button>

                <button
                  className="email-button"
                  onClick={
                    sendEmailOrder
                  }
                >
                  📧 Order by Email
                </button>

                <a
                  className="messenger-button"
                  href="https://m.me/bruno.audreyphiri"
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Message on Messenger
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
