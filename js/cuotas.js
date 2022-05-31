//VARIABLES
let list = document.createElement("p");
let showCuotas = true;
let auxCantCuotas;

//DOM 
const txtCuotasCantidad = document.querySelector("#txtCuotasCantidad");
const cmdCuotasVarias = document.querySelector("#cmdCuotasVarias");
const cmdCuotasUnica = document.querySelector("#cmdCuotasUnica");
const cmdCuotasImprimir = document.querySelector("#cmdCuotasImprimir");

//FUNCIONES

//informa al usuario los valores de las cuotas
function alertValoresCuotas(precio, cantCuotas) {
    let mensaje = "";
    let precioCuota = precio/cantCuotas;
    
    for (let i = 1; i <= cantCuotas; i++) {
        mensaje = mensaje.concat(`Cuota ${i}: $${precioCuota}\n`);
    }
    // alert(mensaje);

    Toastify({
        text: "¡Gracias por su compra!",
        duation: 3000,
        position: "center",
    }).showToast();    

    sessionStorage.removeItem("ImporteTotal");
    
    swal.fire({
        title: '¿Desea seguir comprando?',
        text: mensaje,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '¡Si!',
        denyButtonText: 'No',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
            location.replace("../html/carrito.html");
        } else if (result.isDenied) {
            location.replace("../../index.html");
        }
      })

    // location.replace("../html/mayor.html");

}

function variasCutoas(){
    alertValoresCuotas(getImporteTotal(),parseInt(txtCuotasCantidad.value || 0));
}

function cuotaUnica(){
    alertValoresCuotas(getImporteTotal(), 1);
}

function getImporteTotal(){
    return parseFloat(sessionStorage.getItem("ImporteTotal") || 0);
}

function ImprimirCuotas() {
    let mensaje = "";
    
    if(showCuotas){
        if(txtCuotasCantidad.value != ""){
            let precioCuota = getImporteTotal()/txtCuotasCantidad.value;
            list.innerText = "";
            for (let i = 1; i <= txtCuotasCantidad.value; i++) {
                mensaje = mensaje.concat(`Cuota ${i}: $${precioCuota}\n`);
            }
            document.body.append(list);
            list.innerText = mensaje;
            cmdCuotasImprimir.innerText = "Esconder Cuotas";
        }
    }else{
        cmdCuotasImprimir.innerText = "Previsualizar Cuotas";
        list.innerText = "";
    }
    showCuotas = !showCuotas;
    auxCantCuotas = txtCuotasCantidad.value;    
}

function enterCuotas(e) {
    let tecla = e.keyCode || e.which;
    if(tecla == 13){
        e.preventDefault();
        if(txtCuotasCantidad != ""){
            if(txtCuotasCantidad.value > 1){
                variasCutoas();
            }else{
                cuotaUnica
            }
        }else{
        alert("Por favor ingrese la cantidad de cuotas deseadas.")
        }
    }
}

const changeCuotas = () =>{
    if (auxCantCuotas != txtCuotasCantidad.value){
        showCuotas = true;
        cmdCuotasImprimir.innerText = "Recargar Cuotas";
    }
}

// EVENTOS
cmdCuotasVarias.addEventListener("click", variasCutoas);
cmdCuotasUnica.addEventListener("click", cuotaUnica);
cmdCuotasImprimir.addEventListener("click", ImprimirCuotas);
txtCuotasCantidad.addEventListener('keypress', enterCuotas);
txtCuotasCantidad.addEventListener('change', changeCuotas);

//
document.body.append(list);