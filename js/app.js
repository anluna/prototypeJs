//Constructores
function Seguro (marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//Realiza la cotización con los datos por medio de prototype
Seguro.prototype.cotizarSeguro = function(){
    /* 
        Incrementos del valor por medio de la marca
        Americano 1.15
        Asiatico 1.05
        Europeto 1.35
    */
    console.log(this.marca);
    let cantidad;
    const base = 2000;
    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
        case '2':
            cantidad = base * 1.05;
        case '3':
            cantidad = base * 1.35;
        default:
            break;
    }

    //Leer año
    const diferencia = new Date().getFullYear() - this.year;
    //Cada año la diferencia es mayo, el costo reduce 3%
    cantidad -= ( (diferencia * 3) * cantidad / 100);

    /* El seguro es básico multiplica por 30% más 
       El seguro es completo multiplica por 50% más */

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }

    return cantidad; //Regresa el calculo completo después de evaluar
}

function UI(){} //Constructor para agregar prototype

//llena las opciones de los años
UI.prototype.llenarOpciones = () =>{
    const max = new Date().getFullYear();
        min = max - 20;
    const selectYear = document.querySelector('#year');
    for( let i = max; i > min; i--){
        let option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectYear.appendChild(option);
    }
}

//Muestra alertas UI 
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement('div');

    //Toma los estilos según el caso para pintar el div 
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto')
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //Insertar en HTML dentro de form
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado')); //Insert before, toma el nuevo nodo y el nodo de referencia al insertar

    setTimeout(()=>{
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) =>{
    //EXTRAE información de seguro 
    const { marca, year, tipo } = seguro;
    let textoMarca;
    switch(marca){
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:

        break;
    }
    //Crea resultado a mostrar
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `<p class="header"> Resumen: </p>
    <p class="font-bold">Marca: <span class="font-normal">  ${textoMarca} </span> </p>
    <p class="font-bold">Año: <span class="font-normal">  ${year} </span> </p>
    <p class="font-bold">Tipo de seguro: <span class="font-normal capitalize">  ${tipo} </span> </p>
    <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span> </p>`;

    const resultadoDiv = document.querySelector('#resultado');
    //Mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(()=>{
        spinner.style.display = 'none'; //Elimina spinner y muestra resultado
        resultadoDiv.appendChild(div);
    },3000)
}

//Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () =>{
    ui.llenarOpciones(); //Llena select con los años generados
});

eventListeners();
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    //Leer la marca
    const marca = document.querySelector('#marca').value;
    //Leer el año
    const year = document.querySelector('#year').value;
    //Leet tipo cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    ui.mostrarMensaje('Cotizando...', 'correcto');

    //Ocultar cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if(resultados != null){
        resultados.remove();
    }

    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total =  seguro.cotizarSeguro();

    //Utiliza prototype para seguro
    ui.mostrarResultado(total, seguro)
}