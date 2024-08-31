// Importamos las clases necesariass pra poder utilizar er las funciones

import { CarritoDeCompras } from './CarritoDeCompras.js';
import { Producto } from './Producto.js';

//Instanciamos clase CarritoDeCompras
const carrito = new CarritoDeCompras();

//Agregar producots al carrito, ademas de invocar 

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.agregar-al-carrito').forEach(boton => {
        boton.addEventListener('click', function () {
            const nombre = this.getAttribute('data-name'); 
            const precio = parseFloat(this.getAttribute('data-price'));
            const imagen = this.getAttribute('data-image');

            const producto = new Producto(nombre, precio, imagen);
            carrito.agregarProducto(producto);
            actualizarCarritoUI();
        });
    });

    document.getElementById('icono-carrito').addEventListener('click', function () {
        mostrarCarrito();
    });

    document.getElementById('cerrar-carrito').addEventListener('click', function () {
        ocultarCarrito();
    });

    document.getElementById('generar-factura').addEventListener('click', function () {
        if (carrito.carrito.length === 0) {
            alert('No hay productos en el carrito para generar una factura.');
            return;
        }
        const factura = carrito.generarFactura();
        mostrarFactura(factura);
    });

    manejarBotonesCarrito(); // Inicializa los manejadores de eventos para los botones de la UI
});

// Permite actualizar valores previamente agregados al carrito
function actualizarCarritoUI() {
    const elementosCarrito = document.querySelector('.elementos-carrito');
    const elementoTotal = document.querySelector('.total');
    const elementoCantidadCarrito = document.getElementById('contador-carrito');

    if (!elementosCarrito) {
        console.error('No se encontró ningun producto en el carrito.');
        return;
    }

    // Limpia el contenido actual del carrito en la UI
    elementosCarrito.innerHTML = ''; 

    // Recorre los productos en el carrito y los agrega a la UI
    carrito.carrito.forEach((producto, indice) => {
        const elemento = document.createElement('li');
        elemento.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="contenido-item">
                ${producto.nombre} x${producto.cantidad} - $${producto.obtenerPrecioTotal().toFixed(2)}
                <div class="controles-item">
                    <button class="disminuir" data-indice="${indice}">-</button>
                    <button class="aumentar" data-indice="${indice}">+</button>
                    <button class="eliminar" data-indice="${indice}">x</button>
                </div>
            </div>
        `;
        elementosCarrito.appendChild(elemento);
    });

    // Actualiza el total y la cantidad de productos en el carrito
    if (elementoTotal) {
        elementoTotal.textContent = carrito.obtenerTotal();
    }

    if (elementoCantidadCarrito) {
        elementoCantidadCarrito.textContent = carrito.carrito.reduce((suma, item) => suma + item.cantidad, 0);
    }
}

// Muestra el carrito en la pantalla
function mostrarCarrito() {
    const overlayCarrito = document.getElementById('superposicion-carrito');
    overlayCarrito.style.display = 'flex'; 
}

// Oculta el carrito de la pantalla
function ocultarCarrito() {
    const overlayCarrito = document.getElementById('superposicion-carrito');
    overlayCarrito.style.display = 'none'; 
}

// Permite aumentar, disminuir o eliminar los productos ya ingresados al carrito
function manejarBotonesCarrito() {
    const elementosCarrito = document.querySelector('.elementos-carrito');

    elementosCarrito.addEventListener('click', function (e) {
        const indice = e.target.getAttribute('data-indice');

        if (e.target.classList.contains('aumentar')) {
            carrito.carrito[indice].aumentarCantidad();
        } else if (e.target.classList.contains('disminuir')) {
            carrito.carrito[indice].disminuirCantidad();
            if (carrito.carrito[indice].cantidad === 0) {
                carrito.eliminarProducto(carrito.carrito[indice].nombre);
            }
        } else if (e.target.classList.contains('eliminar')) {
            carrito.eliminarProducto(carrito.carrito[indice].nombre);
        }

        actualizarCarritoUI();
    });
}

// Muestra la factura la seleccionar genera Factura

function mostrarFactura(factura) {
    if (!factura || !Array.isArray(factura.items)) {
        console.error('Formato de factura inválido:', factura);
        return;
    }

    let ventanaFactura = window.open('', 'Factura', 'width=800,height=600');
    ventanaFactura.document.write(`
        <html>
        <head>
            <title>Factura Electrónica</title>
            <style>
                h2 {
                    text-align: center;
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid #ddd;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .total {
                    text-align: right;
                    font-size: 18px;
                    font-weight: bold;
                }
                .boton-volver {
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    display: inline-block;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="encabezado-factura">
                <h1>Detalles de tu compra</h1>
            </div>
            <table>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
    `);
    
    factura.items.forEach(item => {
        ventanaFactura.document.write(`
            <tr>
                <td>${item.nombre}</td>
                <td>${item.precio}$</td>
                <td>${item.cantidad}</td>
                <td>${item.total}$</td>
            </tr>
        `);
    });

    ventanaFactura.document.write(`
            </table>
            <div class="total">Subtotal: ${factura.subtotal}$</div>
            <div class="total">IVA (16%): ${factura.iva}$</div>
            <div class="total">Total: ${factura.total}$</div>
            <a href="#" class="boton-volver" onclick="window.close();">Volver a la tienda</a>
        </body>
        </html>
    `);
    
    ventanaFactura.document.close();
    ventanaFactura.print();
}

