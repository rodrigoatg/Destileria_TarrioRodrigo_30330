
/**
 * Constantes
 */
const precioDescuentoA = 5000;
const precioDescuentoB = 10000;
const precioDescuentoC = 30000;
const divisa = "$";

/**
 * Variables
 */
let valorCompra = 0;
let itemCompra = 0;
let productosDestileria = []; //array de productos
let listaCarrito = [];  //array de ItmCarrito
let carrito = [];
let agregarProductoIdx = 0;


//Objetos
class Producto{
    constructor(id, nombre, categoria, precio, stock, imagen){
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }
    calcularDescuento(){
        return getPrecioConDescuento(this.precio);
    }
    actualizarStock(cant){
        this.stock -= cant;
    }
}

/**
 * Funciones
 */

// Toma los datos del json
const obtenerProductos = () => {
    return new Promise((resolve, reject) => {
        fetch("../json/productos.json")
        
            .then(response => response.json())
            .then(resultado => {
                // let datos = JSON.parse(resultado);
                let datos = resultado;

                datos.forEach(product =>{
                    productosDestileria.push(new Producto(product.id, product.nombre, product.categoria, product.precio, product.stock, product.imagen));
                })
                resolve(true);
            })
            .catch(error => {
                console.log(error)
                reject(true);
            })
    })
}


/**
 * DOM
 */
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMtotalConImp = document.querySelector('#totalConImp');
const DOMtotalConDesc = document.querySelector('#totalConDesc');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotonComprar = document.querySelector('#boton-comprar');

// Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
 
function renderizarProductos() {
    productosDestileria.forEach((info) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        miNodoImagen.setAttribute('width', "100");
        miNodoImagen.setAttribute('height', "100");
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton 
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary');
        miNodoBoton.textContent = '+';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', agregarProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}


// Evento para añadir un producto al carrito de la compra
function agregarProductoAlCarrito(evento) {
    // Agregamos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))

    // Actualizamos el carrito 
    renderizarCarrito();

}

const getProductIndexByID = (Id) =>{
    let indice = 0;
    productosDestileria.forEach(prod => {
        if (prod.id === Id){
            return indice
        }
        indice++;
    });
}

// Dibuja todos los productos guardados en el carrito
function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = productosDestileria.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario lo mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    let Total = calcularTotal();
    DOMtotal.textContent = Total;
    Total = getPrecioFull(Total);
    DOMtotalConImp.textContent = Total.toFixed(2);
    Total = getPrecioConDescuento(Total);
    valorCompra = Total;
    DOMtotalConDesc.textContent = Total.toFixed(2);
}


 // Evento para borrar un elemento del carrito
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
}


//Devuelve precio + impuestos, la idea es usarla en cascada
const getPrecioFull = (Precio) =>{
    return (Precio * 1.21);
}

function getPrecioConDescuento(Precio) {
    /*
    Descuentos:
    Precio > DescuentoA: 5%
    Precio > DescuentoB: 10%
    Precio > DescuentoC: 20%
    */
    let precioConDescuento = parseFloat(Precio);

    switch (true) {
        case Precio > precioDescuentoC:
            precioConDescuento = parseFloat(Precio * 0.80);
            break;
        case Precio > precioDescuentoB:
            precioConDescuento = parseFloat(Precio * 0.90);
            break;
        case Precio > precioDescuentoA:
            precioConDescuento = parseFloat(Precio * 0.95);
            break;
        default:
            break;
    }

    return precioConDescuento;
}

 // Calcula el precio total teniendo en cuenta los productos repetidos
function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = productosDestileria.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}


 // Vacia el carrito y vuelve a dibujarlo
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
}

//devuelve un array filtrando los productos con Stock > 0
function productosEnStock(productosDestileria){
        let enStock = [];
        enStock = productosDestileria.filter(productosDestileria.stock > 0);
        return enStock
}

function FinCompra(){
    //Fin shopping
    // alert(`Su compra tendra un costo de ${valorCompra}.`);
    swal.fire(`Su compra tendra un costo de $${valorCompra}.`,'', 'info');
    // swal("Gracias por su compra!", `La misma tendra un costo de $${valorCompra}.`, "success");

    sessionStorage.setItem("ImporteTotal", valorCompra);
    
    //por las dudas guardo mi carrito
    sessionStorage.setItem("Carrito",JSON.stringify(listaCarrito));

    // confirm("¿Desea hacerlo en cuotas?") ? location.replace("../html/cuotas.html") : location.replace("../html/mayor.html")
    swal.fire({
        title: '¿Desea hacerlo en cuotas?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: '¡En cuotas por favor!',
        denyButtonText: 'Al contado',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            location.replace("../html/cuotas.html");
        } else if (result.isDenied) {
            location.replace("../html/carrito.html");
        }
      })
}

/**
 * Eventos
 */
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
DOMbotonComprar.addEventListener('click', FinCompra);

/** 
 * Inicio
*/

//obtengo mis productos por ahora de un json
obtenerProductos().then(()=>{
    renderizarProductos();
    renderizarCarrito();
})



