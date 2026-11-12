
// Componente de ejemplo para probar la página de productos
export const Productos = () => {
    return (
    <>
        <h1 className="text-4xl font-bold text-center">Productos</h1>
        <table className="table-auto w-full mt-4">
            <thead>
                <tr>
                    <th className="border px-4 py-2">Nombre</th>
                    <th className="border px-4 py-2">Precio</th>
                    <th className="border px-4 py-2">Stock</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border px-4 py-2">Producto 1</td>
                    <td className="border px-4 py-2">$10.00</td>
                    <td className="border px-4 py-2">100</td>
                </tr>
            </tbody>
        </table>
    </>
)   
}