function saludar1() {
	alert("hola si buenas")
}

const botonsito = document.getElementById('boton')
if (botonsito != null) {
	botonsito.addEventListener('click', saludar1)
}
