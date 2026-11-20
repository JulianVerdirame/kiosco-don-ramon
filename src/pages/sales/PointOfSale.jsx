import { useState } from 'react';
import { Row, Col, Card, Button, Table, Form, Badge, Alert } from 'react-bootstrap';
import { getProducts } from '../../services/productService';
import { saveSale } from '../../services/salesService';
import { ShoppingCart, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function PointOfSale() {
    const { user } = useAuth();
    const [products, setProducts] = useState(() => {
        const loadedProducts = getProducts();
        return loadedProducts.filter(p => p.active !== false);
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [feedback, setFeedback] = useState(null);

    const filteredProducts = products.filter(prod =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        setFeedback(null);

        if (product.stock < 1) {
            setFeedback({ type: 'warning', text: `El producto "${product.name}" no tiene stock disponible.` });
            return;
        }

        const existsInCart = cart.some(item => item.productId === product.id);
        if (existsInCart) {
            const existingItem = cart.find(item => item.productId === product.id);
            if (existingItem && existingItem.quantity + 1 > product.stock) {
                setFeedback({ type: 'warning', text: `No hay más stock disponible para "${product.name}" (máx. ${product.stock}).` });
                return;
            }
        }

        setCart(prevCart => {
            const itemInCart = prevCart.some(item => item.productId === product.id);
            if (itemInCart) {
                return prevCart.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
                        : item
                );
            }

            return [...prevCart, {
                productId: product.id,
                productName: product.name,
                unitPrice: product.price,
                quantity: 1,
                subtotal: product.price,
                maxStock: product.stock
            }];
        });
    };

    const removeFromCart = (productId) => {
        setFeedback(null);
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    };

    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    const handleConfirmSale = () => {
        if (cart.length === 0) return;

        const saleData = {
            employee: user?.name || user?.username, 
            items: cart,
            total: total
        };

        const result = saveSale(saleData);

        if (result.success) {
            setFeedback({ type: 'success', text: '¡Venta confirmada con éxito y stock actualizado!' });
            setCart([]);
            const refreshedProducts = getProducts();
            setProducts(refreshedProducts.filter(p => p.active !== false));
        } else {
            setFeedback({ type: 'danger', text: 'Hubo un error al procesar la venta.' });
        }
    };

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
                <div>
                    <h4 className="fw-bold mb-0 text-dark">
                        <ShoppingCart className="me-2 text-primary" size={24} /> Nueva Venta
                    </h4>
                    <small className="text-muted">Registrá una nueva venta seleccionando los productos</small>
                </div>
            </div>

            {feedback && (
                <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)} className="shadow-sm">
                    {feedback.text}
                </Alert>
            )}

            <Row className="g-4">
                {/* Catalogo de productos */}
                <Col md={8}>
                    <Card className="border-0 shadow-sm mb-3">
                        <Card.Body>
                            <div className="position-relative">
                                <Search className="position-absolute text-muted" style={{ top: '12px', left: '14px' }} size={18} />
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar producto..."
                                    className="ps-5"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Card.Body>
                    </Card>

                    <Row xs={1} md={2} lg={4} className="g-3">
                        {filteredProducts.length === 0 ? (
                            <Col xs={12}>
                                <p className="text-center text-muted py-4">No se encontraron productos.</p>
                            </Col>
                        ) : (
                            filteredProducts.map(prod => (
                                <Col key={prod.id}>
                                    <Card 
                                        className="h-100 border-0 shadow-sm text-center p-2"
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                        onClick={() => addToCart(prod)}
                                    >
                                        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                            <div className="bg-light rounded p-3 mb-2 w-100 text-muted">
                                                <ShoppingCart size={32} className="opacity-50" />
                                            </div>
                                            <Card.Title className="fs-6 fw-bold text-dark mb-1">{prod.name}</Card.Title>
                                            <p className="text-primary fw-bold mb-2">${prod.price}</p>
                                            <Badge bg={prod.stock > prod.minStock ? "light" : "warning"} text="dark" className="border">
                                                Stock: {prod.stock}
                                            </Badge>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Col>

                {/* Carrito de compras */}
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-0 pt-3">
                            <h5 className="fw-bold mb-0 text-dark">Carrito de compras</h5>
                        </Card.Header>

                        <Card.Body>
                            {cart.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <ShoppingCart size={48} className="mb-2 opacity-25" />
                                    <p className="mb-0">No hay productos en el carrito</p>
                                </div>
                            ) : (
                                <Table hover responsive size="sm" className="align-middle">
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.productId}>
                                                <td>
                                                    <span className="fw-bold d-block">{item.productName}</span>
                                                    <small className="text-muted">${item.unitPrice} x {item.quantity}</small>
                                                </td>
                                                <td className="text-end fw-bold">${item.subtotal}</td>
                                                <td className="text-end">
                                                    <Button 
                                                        variant="link" 
                                                        className="text-danger p-0" 
                                                        onClick={() => removeFromCart(item.productId)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}

                            <hr />

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold fs-5">Total:</span>
                                <h3 className="fw-bold text-primary mb-0">${total}</h3>
                            </div>

                            <Button
                                variant="success"
                                className="w-100 py-2 fw-bold bg-success border-0"
                                disabled={cart.length === 0}
                                onClick={handleConfirmSale}
                            >
                                ✓ Confirmar Venta
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}