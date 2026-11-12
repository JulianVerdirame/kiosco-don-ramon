# Project Context — Kiosco Don Ramón

## 1. Descripción general

**Kiosco Don Ramón** es una aplicación web frontend para la gestión de un kiosco o almacén de barrio.

El objetivo es desarrollar un sistema sencillo que permita administrar los productos y recursos del comercio, además de registrar ventas mediante una interfaz de punto de venta.

La aplicación se desarrolla como trabajo práctico universitario utilizando React y JavaScript.

### Alcance técnico

- Aplicación frontend, sin backend.
- Sin conexión a bases de datos externas.
- Datos iniciales definidos mediante archivos JSON.
- Persistencia de modificaciones utilizando `localStorage`.
- Autenticación y permisos simulados en el frontend.

---

## 2. Roles y permisos

El sistema contempla dos roles: administrador y empleado.

### Administrador

Es responsable de la gestión general del comercio.

Tiene acceso a las siguientes funcionalidades:

- **Productos:** consultar, crear, modificar y eliminar productos.
- **Categorías:** consultar, crear, modificar y eliminar categorías.
- **Proveedores:** consultar, crear, modificar y eliminar proveedores.
- **Usuarios:** administrar las cuentas de los empleados.
- **Consultar stock:** visualizar las existencias disponibles.

**Pantalla inicial:** al iniciar sesión, el administrador es redirigido directamente a la sección de Productos.

### Empleado

Es responsable de registrar las ventas y consultar las existencias.

Tiene acceso a:

- **Nueva venta:** registrar ventas mediante el punto de venta.
- **Consultar stock:** visualizar los productos y sus existencias.

**Pantalla inicial:** al iniciar sesión, el empleado es redirigido directamente a la sección Nueva venta.

### Matriz de permisos

| Funcionalidad | Administrador | Empleado |
|---|:---:|:---:|
| Nueva venta | No | Sí |
| Productos | Sí | No |
| Categorías | Sí | No |
| Proveedores | Sí | No |
| Usuarios | Sí | No |
| Consultar stock | Sí | Sí |

Los permisos deben controlarse mediante la lógica de navegación y protección de rutas, además de ocultar las opciones del menú que no correspondan al rol.

---

## 3. Navegación y estructura visual

La aplicación contará con una estructura general compartida para las pantallas internas.

### Layout principal

El layout estará compuesto por:

- **Sidebar:** menú lateral con las opciones disponibles según el rol.
- **Navbar:** barra superior con información del usuario y opción para cerrar sesión.
- **Contenido principal:** área donde se renderizan las diferentes páginas.

### Menú del administrador

1. Productos.
2. Categorías.
3. Proveedores.
4. Usuarios.
5. Consultar stock.

### Menú del empleado

1. Nueva venta.
2. Consultar stock.

### Diseño visual

La interfaz seguirá una estética moderna, sencilla y funcional.

Paleta de colores principal:

- Azul marino para el menú lateral y elementos principales.
- Azul para botones, acciones y elementos seleccionados.
- Blanco y tonos claros para fondos y superficies.
- Gris para bordes, separadores y textos secundarios.

Se priorizará una interfaz clara, consistente y fácil de utilizar.

---

## 4. Modelos de datos

Los siguientes modelos representan la estructura inicial propuesta para los datos del sistema.

Los nombres de propiedades pueden ajustarse durante la implementación, pero se debe mantener la coherencia entre los diferentes módulos.

### Usuario

Representa las cuentas que pueden acceder al sistema.

| Propiedad | Descripción |
|---|---|
| id | Identificador único. |
| username | Nombre de usuario para iniciar sesión. |
| password | Contraseña utilizada en la autenticación simulada. |
| name | Nombre del usuario. |
| role | Rol: `admin` o `employee`. |
| active | Indica si la cuenta está activa. |

### Producto

Representa los artículos comercializados por el kiosco.

| Propiedad | Descripción |
|---|---|
| id | Identificador único. |
| name | Nombre del producto. |
| description | Descripción del producto. |
| price | Precio de venta. |
| stock | Cantidad disponible. |
| minStock | Cantidad mínima de stock deseada. |
| categoryId | Referencia a la categoría. |
| providerId | Referencia al proveedor. |
| active | Indica si el producto está activo. |

### Categoría

Permite clasificar los productos.

| Propiedad | Descripción |
|---|---|
| id | Identificador único. |
| name | Nombre de la categoría. |
| description | Descripción de la categoría. |

### Proveedor

Representa a los proveedores del comercio.

| Propiedad | Descripción |
|---|---|
| id | Identificador único. |
| name | Nombre del proveedor. |
| phone | Teléfono de contacto. |
| email | Correo electrónico. |

### Venta

Representa una operación de venta realizada por un empleado.

| Propiedad | Descripción |
|---|---|
| id | Identificador único. |
| employeeId | Identificador del empleado que realizó la venta. |
| date | Fecha y hora de la operación. |
| items | Detalle de los productos vendidos. |
| total | Importe total de la venta. |

Cada elemento de `items` debe contener:

- `productId`: identificador del producto.
- `productName`: nombre del producto al momento de la venta.
- `quantity`: cantidad vendida.
- `unitPrice`: precio unitario al momento de la venta.
- `subtotal`: importe correspondiente a esa línea.

Se deben conservar el nombre y el precio histórico de los productos dentro del detalle de la venta, para evitar que futuras modificaciones del catálogo alteren la información de operaciones anteriores.

---

## 5. Reglas de negocio

### Gestión de productos

- El precio y el stock deben ser valores válidos.
- Cada producto debe estar asociado a una categoría.
- El proveedor puede asociarse al producto según corresponda.
- Los productos inactivos no deben ofrecerse para nuevas ventas.
- El stock no puede ser negativo.
- Se debe contemplar el nivel mínimo de stock (`minStock`) para identificar productos que necesitan reposición.

### Gestión de ventas

El proceso de venta debe seguir este flujo:

1. El empleado accede a Nueva venta.
2. Busca y selecciona productos disponibles.
3. Agrega productos al carrito.
4. Puede modificar las cantidades o quitar productos.
5. El sistema calcula los subtotales y el total.
6. Al confirmar la operación, se valida nuevamente la disponibilidad de stock.
7. Si la operación es válida, se registra la venta.
8. Se actualiza el stock de los productos involucrados.
9. Se limpia el carrito para permitir una nueva operación.

**Importante:** el stock solamente debe descontarse al confirmar la venta, nunca al agregar productos al carrito.

La validación debe impedir que se vendan cantidades superiores al stock disponible.

### Gestión de usuarios

- El administrador puede crear y modificar cuentas de empleados.
- Los usuarios pueden tener rol administrador o empleado.
- Las cuentas inactivas no deben permitir iniciar sesión.
- No se debe permitir que un empleado acceda a funcionalidades exclusivas del administrador.

---

## 6. Persistencia y manejo de datos

La aplicación no cuenta con backend ni base de datos.

### Datos iniciales

Los datos iniciales se encontrarán en archivos JSON dentro de `src/data/`.

Archivos previstos:

- `users.json`
- `products.json`
- `categories.json`
- `providers.json`
- `sales.json`

### LocalStorage

Las modificaciones realizadas durante el uso de la aplicación deben persistirse mediante `localStorage`.

Consideraciones:

- Los datos JSON funcionan como información inicial.
- Al iniciar la aplicación, se debe verificar si existen datos guardados en `localStorage`.
- Si existen, deben utilizarse esos datos.
- Si no existen, se deben cargar los datos iniciales del JSON.
- Las modificaciones posteriores deben actualizar el estado de React y persistirse en `localStorage`.

**Importante:** cada entidad debe tener una fuente de estado coherente. Por ejemplo, el inventario y el punto de venta deben trabajar sobre el mismo estado de productos para evitar inconsistencias en el stock.

---

## 7. Arquitectura y organización del código

La aplicación debe mantener una arquitectura modular, sencilla y fácil de comprender.

Estructura general propuesta:

```text
src/
├── components/
│   └── common/
├── context/
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
├── data/
│   ├── users.json
│   ├── products.json
│   ├── categories.json
│   ├── providers.json
│   └── sales.json
├── hooks/
│   ├── useAuth.js
│   └── useData.js
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
│   ├── storageService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── providerService.js
│   ├── userService.js
│   └── salesService.js
├── App.jsx
└── main.jsx
```

### Responsabilidades de las carpetas

- `components/`: componentes visuales reutilizables.
- `context/`: contextos globales de React, como autenticación.
- `data/`: archivos JSON con datos iniciales.
- `hooks/`: hooks personalizados.
- `layouts/`: estructuras generales de las páginas.
- `pages/`: páginas y módulos funcionales.
- `services/`: funciones para consultar y modificar los datos.

`DataContext` es la fuente compartida de usuarios, productos, categorías, proveedores y ventas. `AuthContext` depende de `DataContext` para autenticar usuarios y mantener una sesión asociada a un usuario activo. La persistencia y carga inicial se centralizan en `storageService.js`. Las operaciones de venta validan el stock y guardan el descuento de inventario junto con el registro histórico en una única actualización.

### Convenciones

- Utilizar `.jsx` para componentes que contienen JSX.
- Utilizar `.js` para servicios, funciones auxiliares y lógica JavaScript.
- Mantener separados los componentes visuales y la lógica de negocio.
- Evitar duplicación de código.
- Priorizar componentes reutilizables cuando tenga sentido.

---

## 8. Autenticación y rutas

La autenticación se implementará utilizando Context API.

Se prevé un `AuthContext` que permita:

- Consultar el usuario autenticado.
- Iniciar sesión.
- Cerrar sesión.
- Consultar si existe una sesión activa.
- Identificar el rol del usuario.

La navegación se implementará mediante React Router DOM.

Se utilizarán rutas protegidas para impedir el acceso a páginas que no correspondan al rol autenticado.

Al cerrar sesión, el usuario debe regresar a la pantalla de Login.

La autenticación es exclusivamente demostrativa: no representa un sistema de seguridad real, ya que no existe un backend que valide credenciales ni permisos.

---

## 9. Tecnologías y restricciones

### Tecnologías definidas

- React.
- JavaScript.
- Vite.
- React Router DOM.
- Context API.
- Hooks de React.
- Bootstrap
- CSS.
- JSON.
- LocalStorage.

### Restricciones

Para mantener el proyecto dentro del alcance académico:

- No utilizar TypeScript.
- No utilizar Redux.
- No implementar backend.
- No utilizar bases de datos externas.
- No incorporar librerías adicionales sin evaluar previamente su necesidad.
- Evitar soluciones excesivamente complejas.
- Priorizar las herramientas y conceptos trabajados durante la cursada.

---

## 10. Funcionalidades fuera del alcance inicial

Para mantener un alcance controlado, inicialmente no se contempla implementar:

- Dashboard con estadísticas.
- Historial de ventas como módulo independiente.
- Reportes de ventas.
- Integración con sistemas de pago.
- Gestión de compras y reposición de mercadería.
- Integración con servicios externos.

Cualquier ampliación de alcance debe evaluarse antes de implementarse.

---

## 11. Criterios generales de desarrollo

Todo el código nuevo debe respetar los siguientes criterios:

1. Mantener la arquitectura y organización establecidas.
2. Priorizar soluciones simples y fáciles de mantener.
3. Reutilizar componentes y funciones cuando corresponda.
4. Evitar duplicar lógica entre módulos.
5. Mantener consistencia en nombres, estilos y convenciones.
6. Validar los datos antes de realizar operaciones.
7. Mantener sincronizados los estados compartidos.
8. No modificar funcionalidades existentes sin una razón justificada.
9. Consultar antes de introducir cambios importantes en la arquitectura o el alcance.

**Este documento representa el contexto funcional y técnico inicial del proyecto. Puede actualizarse a medida que avance el desarrollo y se definan nuevas decisiones.**