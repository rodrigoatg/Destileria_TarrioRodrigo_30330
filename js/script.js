//DOM 
const idxBtnContinuar = document.querySelector("#idxBtnContinuar");
const idx_Calendar = document.querySelector("#idxCalendar");

//Funcion que valida la mayoria de edad
//La idea seria tomar la edad del usuario a traves de un calendario
//El index de la web de la destileria seria 
function validarEdad(Fecha){
	let hoy = new Date();
    let fecha = new Date(Fecha);
    if(isNaN(fecha)){
        // alert("Ha ingresado una fecha inválida.")
        Swal.fire({
            icon: 'error',
            title: 'Fecha Invalida',
            text: 'Ha ingresado una fecha inválida.',
            // footer: '<a href="">Why do I have this issue?</a>'
        })
        return false;
    }
    edad = parseInt((hoy - fecha)/365/24/60/60/1000)
    if (edad < 18) {
		return false;
	}else{
	    return true;
    }
}

const DestileriaIni = () =>{
    let fechaAux = Date();
    let fecha = formatearFecha(idx_Calendar.value || fechaAux);
    
    if (validarEdad(fecha)){
        //guardo la edad para luego utilizarla para el formulario de contacto
        sessionStorage.setItem("FechaNacimiento",fecha)
        location.replace("./html/carrito.html");
    }else{
        location.replace("./html/menor.html");
    }
}

const formatearFecha = (argFecha) => {
    fechaAux = new Date(argFecha);
    let anio = fechaAux.getUTCFullYear();
    let mes = fechaAux.getUTCMonth() + 1; //el getMonth viene de (0-11)
    let dia = fechaAux.getUTCDate();
    let fechaFormateada = anio + "/" + mes + "/" + dia;
    return fechaFormateada;
}

idxBtnContinuar.addEventListener("click", DestileriaIni);
