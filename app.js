// 🔹 IMPORTACIONES (CDN - CORRECTO)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB5LVIckLtru4wIHhrEsju1Pquy_HoLUS0",
  authDomain: "crud-firebase-app-2f659.firebaseapp.com",
  projectId: "crud-firebase-app-2f659",
  storageBucket: "crud-firebase-app-2f659.appspot.com",
  messagingSenderId: "560817060629",
  appId: "1:560817060629:web:d42f2364dc509d38df471c"
};


// 🔹 INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 🔹 VARIABLES
let datos = [];


// ➕ AGREGAR
window.agregar = async function () {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    await addDoc(collection(db, "productos"), {
        nombre: nombre,
        precio: precio
    });

    alert("Producto agregado");

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";

    leer();
};


// 📖 LEER
async function leer() {
    datos = [];

    const querySnapshot = await getDocs(collection(db, "productos"));

    querySnapshot.forEach((docu) => {
        datos.push({
            id: docu.id,
            ...docu.data()
        });
    });

    mostrar(datos);
}


// 🖥️ MOSTRAR
function mostrar(lista) {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    lista.forEach((d) => {
        tabla.innerHTML += `
        <tr>
            <td>${d.nombre}</td>
            <td>${d.precio}</td>
            <td>
                <button onclick="eliminar('${d.id}')">Eliminar</button>
                <button onclick="editar('${d.id}')">Editar</button>
            </td>
        </tr>
        `;
    });
}


// ❌ ELIMINAR
window.eliminar = async function (id) {
    await deleteDoc(doc(db, "productos", id));
    leer();
};


// ✏️ EDITAR
window.editar = async function (id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoPrecio = prompt("Nuevo precio:");

    if (!nuevoNombre || !nuevoPrecio) return;

    await updateDoc(doc(db, "productos", id), {
        nombre: nuevoNombre,
        precio: nuevoPrecio
    });

    leer();
};


// 🔍 FILTRAR
window.filtrar = function () {
    const texto = document.getElementById("buscar").value.toLowerCase();

    const filtrados = datos.filter(d =>
        d.nombre.toLowerCase().includes(texto)
    );

    mostrar(filtrados);
};


// 🔥 INICIAR
leer();