function saludar() {
	console.log('hola che')
}

const botonsito = document.getElementById('boton')
if (botonsito != null) {
	botonsito.addEventListener('click', saludar)
}
