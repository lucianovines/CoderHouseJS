const JSONProductos = "productos.json";
let datosObtenidos;
//Funcion encargada de cargar los productos en la pagina princial. utilizando como referencia el JSON.
//Esta funcion es dinamica, es decir, si se agregan mas productos en el JSON, se mostraran automaticamente en la pagina.
function cargaProductos(){
    $.get(JSONProductos, function(respuesta, estado) {
        if(estado=="success"){
                datosObtenidos = respuesta;
                for (const datos of datosObtenidos){
                    $(".productos").append(`
                    <div class="col-4 justify-content-md-center row">
                    <div class="wrapper">
                        <div class="container">
                          <div class="top" style="background:url(assets/img/producto${datos.id}.jpg) no-repeat center center; background-size: 100%;"></div>
                          <div class="bottom boton${datos.id}">
                            <div class="left">
                              <div class="details">
                                <h1>${datos.nombre}</h1>
                                <p>$${datos.precio}</p>
                              </div>
                              <div class="buy agregaCarrito carrito${datos.id}"><i class="material-icons">add_shopping_cart</i></div>
                            </div>
                            <div class="right">
                              <div class="done"><i class="material-icons">done</i></div>
                              <div class="details">
                                <h1>${datos.nombre}</h1>
                                <p>Producto Agregado</p>
                              </div>
                              <div class="remove borra${datos.id}"><i class="material-icons">clear</i></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                    `)
                   
                }
        }  
        //se crean los eventos de click de cada  producto para agregarlo al carrito y para efecto.
        let carritos = $(".agregaCarrito");
        let borrarItem = $(".remove");
        console.log(carritos);
        let nombreBoton ;
        let borraBoton ;
        for (let i=0;i < carritos.length; i++){
           carritos[i].addEventListener('click', () => {
                nombreBoton = ".boton"+[i];                                 
                console.log(nombreBoton);
                $(nombreBoton).addClass("clicked");
                itemsCarrito(datosObtenidos[i]);
                precioTotal(datosObtenidos[i]);
             })
        }
    //se crean los eventos de click de cada  producto para eliminarlo del carrito y para efecto.
        for (let i=0;i < borrarItem.length; i++){
            borrarItem[i].addEventListener('click', () => {
                borraBoton = ".borra"+[i];  
                nombreBoton = ".boton"+[i];  
                eliminarItem(datosObtenidos[i]);  
                console.log("borrado: " + nombreBoton);
                $(nombreBoton).removeClass("clicked");   
            })
        }

    })
}

//Se llama a todas las funciones necesarias para inicializar la pagina.
cargaProductos();
cargaCarrito();
borraTodo()
muestraCarrito();
confirmaCompra()




//Funcion para mostrar la cantidad de articulos en el carrito en el navbar
function cargaCarrito(){
    let cantidadProductos = localStorage.getItem('itemsCarrito');
    if (cantidadProductos){
        $('#carritoItems').text(cantidadProductos);
    }
}

//funcion para controlar las cantidades de items en el carrito (sumar o restar)
// si le llega una accion, resta, en caso contrario suma
function itemsCarrito(producto , accion){
    let cantidadProductos = localStorage.getItem('itemsCarrito');
    cantidadProductos = parseInt(cantidadProductos);

    let itemsEnCarrito = localStorage.getItem("productosEnCarrito");
    itemsEnCarrito = JSON.parse(itemsEnCarrito);

    if (accion){
        localStorage.setItem("itemsCarrito", cantidadProductos -1);
        $("#carritoItems").text(cantidadProductos -1);
    }else if (cantidadProductos){
        localStorage.setItem('itemsCarrito', cantidadProductos +1);
        $('#carritoItems').text(cantidadProductos +1);        
    }else {
        localStorage.setItem('itemsCarrito', 1)
        $('.itemsCarrito').text(1);
        $('#carritoItems').text(1);
    }
    cargarItems(producto)
}

//Funcion para ir cargando los items en el carrito
function cargarItems(producto){
    let itemsCarrito = localStorage.getItem("productosEnCarrito");
    itemsCarrito = JSON.parse(itemsCarrito);

    if (itemsCarrito != null){

        if (itemsCarrito[producto.id] == undefined){
            itemsCarrito={
                ...itemsCarrito,
                [producto.id]: producto
            }
        }
        itemsCarrito[producto.id].enCarrito += 1;
    } else{
        producto.enCarrito = 1;
        itemsCarrito = {
            [producto.id] : producto
        };
    }
    localStorage.setItem("productosEnCarrito", JSON.stringify(itemsCarrito));
}

//Funcion que calcula el coste total de los productos en el carrito.
function precioTotal (producto, accion){
    let totalCarrito = localStorage.getItem("precioTotal");

    if (accion){
        totalCarrito = parseInt(totalCarrito);
        localStorage.setItem("precioTotal", totalCarrito - producto.precio);
    }else if (totalCarrito != null){
        totalCarrito = parseInt(totalCarrito);
        localStorage.setItem("precioTotal", totalCarrito + producto.precio);
    }else{
        localStorage.setItem("precioTotal", producto.precio);
    }   
}



//Funcion para armar la estructura html del carrito y mostrar los articulos cargados.
function muestraCarrito(){
    let ProductosCarrito= localStorage.getItem("productosEnCarrito");
    let totalCarrito = localStorage.getItem("precioTotal");
    ProductosCarrito = JSON.parse(ProductosCarrito);
    let contenedorCarrito = document.querySelector(".productosCarrito");
    if(ProductosCarrito && contenedorCarrito){
        contenedorCarrito.innerHTML="";
        Object.values(ProductosCarrito).map( item =>{
            contenedorCarrito.innerHTML += `
            <div class="productoCarrito col-6 row align-items-center">
                <div class="col-4 eliminaProducto"><i class="fas fa-trash"></i></div>
                <div class="col-4"><img src="assets/img/producto${item.id}.jpg" class="img-fluid" width="90%"></div>
                <div class="col-4"><span>${item.nombre}</span></div>
            </div>

            <div class="precioProducto col-2 align-middle">
            <span>$${item.precio}</span>
            </div>

            <div class="cantidadProducto col-2">
            <i class="fas fa-minus-circle restaProducto"></i>
            <span>${item.enCarrito}</span>
            <i class="fas fa-plus-circle sumaProducto"></i>
            </div>

            <div class="totalproducto col-2">
            <span>$${item.enCarrito * item.precio}</span>
            </div>
            `

        });

        contenedorCarrito.innerHTML += `
        <div class="totalCarritoContenedor"> 
            <h4 class="totalCarritoTitulo">
                 Total: 
            </h4>
            <h4 class="totalCarritoMonto">
                 $${totalCarrito},00
            </h4>
        </div>
        `

        actualizaCantidades();
        botonBorrar();
    }
}

//funcion para limpiar el LocalStorage
function borraTodo(){
    $(".btnBorrar").click(function(){ 
        localStorage.clear();
        location.reload();
    })
};
//Funcion para simular la confirmacion de la compra y limpiar el LS.
function confirmaCompra(){
    $(".btnConfirma").click(function(){ 
        alert("Gracias por su compra");
        localStorage.clear();
        location.reload();
    })
};


//animacion del boton de carrito del navbar.
$(".botonCarrito").hover(function() {
    $(".botonCarrito").animate({fontSize: '1.2em'}, "slow");
    $(".iconoCarrito").addClass('rotation');
}, function(){
    $(".botonCarrito").animate({fontSize: '1em'}, "slow");
    $(".iconoCarrito").removeClass('rotation');
})

//Funcion para los botones de SUMAR Y RESTAR cantidades desde el Carrito.
//Se creo buscando el nombre del producto a traves del arbol del dom.
//Actualiza todos los elementos correspondientes.
function actualizaCantidades(){
    let sumador = $(".sumaProducto");
    let restador = $(".restaProducto");
    let cantidadActual = 0;
    let productoActual ='';
    let idProducto= 0;
    let itemCarrito= localStorage.getItem("productosEnCarrito");
    itemCarrito = JSON.parse(itemCarrito);

    //Funcion para la RESTA
    for (let i=0; i< restador.length; i++){
        restador[i].addEventListener("click", () => {
            cantidadActual = restador[i].parentElement.querySelector('span').textContent;
            productoActual = restador[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent;        
            $.get(JSONProductos, function(respuesta, estado) {
                if(estado=="success"){
                        datosObtenidos = respuesta;
                        let nombreProducto ='';
                        for (const datos of datosObtenidos){
                            if (datos.nombre == productoActual){
                                idProducto= datos.id;
                                idProducto = parseInt(idProducto);
                            }
                        }                    if (itemCarrito[idProducto].enCarrito > 1) {
                            itemCarrito[idProducto].enCarrito = itemCarrito[idProducto].enCarrito - 1;
                            itemsCarrito(itemCarrito[idProducto], "restador");
                            precioTotal(itemCarrito[idProducto], "restador");
                            localStorage.setItem("productosEnCarrito", JSON.stringify(itemCarrito));
                            muestraCarrito()
                        }
                    }
            });     
        })
    //Funcion para la SUMA
        sumador[i].addEventListener("click", () => {
            cantidadActual= sumador[i].parentElement.querySelector('span').textContent;
            productoActual = sumador[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent;
            $.get(JSONProductos, function(respuesta, estado) {
                if(estado=="success"){
                        datosObtenidos = respuesta;
                        let nombreProducto ='';
                        for (const datos of datosObtenidos){
                            if (datos.nombre == productoActual){
                                idProducto= datos.id;
                                idProducto = parseInt(idProducto);
                            }
                        }
                        itemCarrito[idProducto].enCarrito +=1;
                        itemsCarrito(itemCarrito[idProducto]);
                        precioTotal(itemCarrito[idProducto]);
                        localStorage.setItem("productosEnCarrito", JSON.stringify(itemCarrito));
                        muestraCarrito();
                    }
            });
        });
    };
};

//Funcionamiento del Boton encargado de borrar un item del carrito.
//Utiliza la misma logica de la suma o resta.
function botonBorrar(){
    let botonBorrador = $(".eliminaProducto");
    let itemsCarrito = localStorage.getItem("itemsCarrito");
    let precioTotal = localStorage.getItem("precioTotal");
    let productosEnCarrito = localStorage.getItem("productosEnCarrito");
    productosEnCarrito = JSON.parse(productosEnCarrito);
    let nombreProducto;
    let idProducto=0;

    for (let i=0; i < botonBorrador.length; i++){
        botonBorrador[i].addEventListener("click", () =>{
            nombreProducto = botonBorrador[i].nextElementSibling.nextElementSibling.textContent;
            $.get(JSONProductos, function(respuesta, estado) {
                if(estado=="success"){
                        datosObtenidos = respuesta;
                        for (const datos of datosObtenidos){
                            if (datos.nombre == nombreProducto){
                                idProducto= datos.id;
                                idProducto = parseInt(idProducto);
                            }
                        }

                       localStorage.setItem("itemsCarrito", itemsCarrito - productosEnCarrito[idProducto].enCarrito);
                       localStorage.setItem("precioTotal", precioTotal - (productosEnCarrito[idProducto].precio * productosEnCarrito[idProducto].enCarrito));

                       delete productosEnCarrito[idProducto];
                       localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));

                       muestraCarrito();
                       cargaCarrito();
                    }
            });
    });

};
}


//Funcion para eliminar Items desde la pantalla de producto.
//Actualiza el DOM y el JSON.
function eliminarItem(producto){
    let itemsCarrito = localStorage.getItem('itemsCarrito');
    itemsCarrito = parseInt(itemsCarrito);
    let productosEnCarrito = localStorage.getItem("productosEnCarrito");
    productosEnCarrito = JSON.parse(productosEnCarrito);
    let precioTotal = localStorage.getItem("precioTotal");
    localStorage.setItem("itemsCarrito", itemsCarrito - productosEnCarrito[producto.id].enCarrito);
    localStorage.setItem("precioTotal", precioTotal - (productosEnCarrito[producto.id].precio * productosEnCarrito[producto.id].enCarrito));
    $.get(JSONProductos, function(respuesta, estado) {
        if(estado=="success"){
                datosObtenidos = respuesta;
                for (const datos of datosObtenidos){
                    if (datos.id == producto.id){
                        idProducto= datos.id;
                        idProducto = parseInt(idProducto);
                    }
                }
                delete productosEnCarrito[producto.id];
                localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
            }
        });
    muestraCarrito();
    cargaCarrito();
}