// Clase producto con propiedades inicializadas

export class Producto {
    constructor(nombre, precio, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1;
    }

    aumentarCantidad() {
        this.cantidad += 1;
    }

    disminuirCantidad() {
        if (this.cantidad > 1) {
            this.cantidad -= 1;
        }

        
    }

    obtenerPrecioTotal() {
        return this.precio * this.cantidad;
    }
}
