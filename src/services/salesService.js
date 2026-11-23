import initialSales from '../data/sales.json';
import { decreaseStock } from './productService';

const STORAGE_KEY = 'kiosco-don-ramon:sales';

export function getSales(){
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSales));
        return initialSales;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        return [];
    }
}

export function saveSale(saleData){
    try {
        const sales = getSales();
        const newSale = {
            id: sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1,
            ...saleData,
            date: new Date().toISOString()
        };

        for (const item of saleData.items) {
            decreaseStock(item.id ?? item.productId, item.quantity);
        }

        const updatedSales = [newSale, ...sales];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSales));
        
        return { success: true, sale: newSale };
    } catch (error) {
        console.error("Error al guardar la venta:", error);
        return { success: false, error: error.message };
    }   
}