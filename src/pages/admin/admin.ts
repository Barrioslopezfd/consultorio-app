function saludar1() {
	console.log('hola che')
}

const botonsito = document.getElementById('boton')
if (botonsito != null) {
	botonsito.addEventListener('click', saludar1)
}