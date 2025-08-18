"use strict";
function saludar2() {
    console.log('hola che, user');
}
const botonsito2 = document.getElementById('boton-user');
if (botonsito2 != null) {
    botonsito2.addEventListener('click', saludar2);
}
