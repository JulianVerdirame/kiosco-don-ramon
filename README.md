
# Kiosco Don Ramón

Aplicación web para la gestión de un kiosco o almacén de barrio. Permite administrar productos, categorías, proveedores y usuarios, además de registrar ventas y consultar el stock disponible.

El proyecto se desarrolla como trabajo práctico universitario, utilizando React y JavaScript.

## Objetivo del proyecto

Desarrollar una aplicación frontend que facilite las tareas cotidianas de un comercio, diferenciando las funcionalidades disponibles según el rol del usuario.

## Funcionalidades

### Administrador

El administrador tiene acceso a las funcionalidades de gestión del sistema:

- **Productos:** alta, consulta, modificación y eliminación de productos.
- **Categorías:** gestión de las categorías de productos.
- **Proveedores:** gestión de los proveedores del comercio.
- **Usuarios:** administración de las cuentas de empleados y sus permisos.
- **Consulta de stock:** visualización de las existencias disponibles.

Al iniciar sesión, el administrador accede directamente a la sección de **Productos**.

### Empleado

El empleado cuenta con las funcionalidades necesarias para operar en el comercio:

- **Nueva venta:** registro de ventas mediante una interfaz de punto de venta.
- **Carrito:** selección de productos, modificación de cantidades y cálculo del total.
- **Consulta de stock:** visualización de las existencias disponibles.

Al iniciar sesión, el empleado accede directamente a la sección de **Nueva venta**.

## Tecnologías

- **React:** desarrollo de la interfaz de usuario.
- **JavaScript:** lenguaje de programación.
- **Vite:** entorno de desarrollo y herramienta de construcción.
- **React Router DOM:** navegación entre páginas.
- **Context API:** gestión del estado global y autenticación.
- **LocalStorage:** persistencia local de los datos en el navegador.
- **CSS:** estilos y diseño de la interfaz.

## Datos y persistencia

La aplicación no cuenta con un backend ni una base de datos externa.

Los datos iniciales se encuentran definidos en archivos JSON dentro del proyecto. Las modificaciones realizadas durante el uso de la aplicación se almacenan en `localStorage`, permitiendo conservar los cambios entre recargas del navegador.

## Funcionamiento de las ventas

El proceso de venta contempla los siguientes pasos:

1. El empleado busca y selecciona los productos.
2. Agrega los productos al carrito e indica las cantidades.
3. El sistema calcula los subtotales y el importe total.
4. Al confirmar la venta, se valida la disponibilidad de stock.
5. Se descuenta del inventario la cantidad de productos vendidos.

## Estructura general del proyecto

La aplicación organiza sus archivos por responsabilidad y funcionalidad:

```text
src/
├── components/
│   └── common/
├── context/
│   └── AuthContext.jsx
├── data/
│   ├── users.json
│   ├── products.json
│   ├── categories.json
│   ├── providers.json
│   └── sales.json
├── hooks/
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Login.jsx
│   ├── products/
│   ├── categories/
│   ├── providers/
│   ├── users/
│   └── sales/
├── services/
├── App.jsx
└── main.jsx
```

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/JulianVerdirame/kiosco-don-ramon.git
```

Ingresar al directorio del proyecto:

```bash
cd kiosco-don-ramon
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Consideraciones

- La autenticación y los permisos se simulan en el frontend. No representan un mecanismo de seguridad real.
- Los datos se almacenan localmente en el navegador.
- La aplicación está pensada para fines académicos y demostrativos.

---

**Kiosco Don Ramón** — Sistema de gestión para un comercio de barrio.
