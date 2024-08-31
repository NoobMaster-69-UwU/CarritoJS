export class CarritoDeCompras {
    constructor() {
        this.carrito = [];
    }

    agregarProducto(producto) {
        const productoExistente = this.carrito.find(item => item.nombre === producto.nombre);
        if (productoExistente) {
            productoExistente.aumentarCantidad();
        } else {
            this.carrito.push(producto);
        }
    }

    eliminarProducto(nombreProducto) {
        this.carrito = this.carrito.filter(item => item.nombre !== nombreProducto);
    }


    obtenerTotal() {
        return parseFloat(this.carrito.reduce((suma, producto) => suma + producto.obtenerPrecioTotal(), 0));
    }

    obtenerSubtotal() {
        return this.obtenerTotal() / 1.16; // Aplicando IVA
    }

    obtenerIVA() {
        return this.obtenerTotal() - this.obtenerSubtotal();
    }

    generarFactura() {
        if (this.carrito.length === 0) {
            alert("El carrito está vacío. No se puede generar la factura.");
            return null;
        }
    
        const subtotal = this.obtenerSubtotal().toFixed(2);
        const iva = this.obtenerIVA().toFixed(2);
        const total = this.obtenerTotal().toFixed(2);
    
        const invoiceItems = this.carrito.map(product => ({
            nombre: product.nombre,
            precio: product.precio.toFixed(2),
            cantidad: product.cantidad,
            total: product.obtenerPrecioTotal().toFixed(2)
        }));
    
        return {
            items: invoiceItems,
            subtotal: subtotal,
            iva: iva,
            total: total
        };
    }
    
}
