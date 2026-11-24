import { useState } from 'react';
import { Card, Table, Badge, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { getSales } from '../../services/salesService';
import { getUserById } from '../../services/userService';
import { History, Receipt, Search } from 'lucide-react';
import { TitleCard } from '../../components/common/TitleCard';

const getEmployeeName = (sale) =>
  getUserById(sale.employeeId)?.name || 'Empleado';

export default function SalesHistory() {
  const [sales] = useState(() => getSales());
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredSales = sales.filter(sale => {
    const matchesEmployee = getEmployeeName(sale)
      .toLowerCase()
      .includes(filterEmployee.toLowerCase());

    let matchesDate = true;
    if (filterDate) {
      const saleDateOnly = new Date(sale.date).toISOString().split('T')[0];
      matchesDate = saleDateOnly === filterDate;
    }

    return matchesEmployee && matchesDate;
  });

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">

      <TitleCard
        title="Historial de Ventas"
        subtitle="Registro de todas las transacciones realizadas"
        icon={History}
      />

      {/* Filtros de búsqueda */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">Filtrar por empleado</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-white text-muted">
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del empleado..."
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-muted">Filtrar por fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-secondary">
              <tr>
                <th className="py-3 ps-3"># ID Venta</th>
                <th className="py-3">Fecha y Hora</th>
                <th className="py-3">Productos / Detalle</th>
                <th className="py-3">Empleado</th>
                <th className="py-3 text-end pe-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-5">
                    <Receipt size={48} className="mb-2 opacity-25" />
                    <p className="mb-0">No se encontraron ventas con los filtros aplicados</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => {
                  const formattedDate = new Date(sale.date).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  });

                  return (
                    <tr key={sale.id}>
                      <td className="ps-3 fw-bold text-primary">#{sale.id}</td>
                      <td className="text-muted small">{formattedDate}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {sale.items.map((item) => (
                            <li key={`${sale.id}-${item.productId}`} className="small text-dark">
                              - {item.quantity}x {item.productName} (${item.unitPrice} c/u)
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {getEmployeeName(sale)}
                        </Badge>
                      </td>
                      <td className="text-end pe-3 fw-bold text-success fs-6">
                        ${sale.total}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}