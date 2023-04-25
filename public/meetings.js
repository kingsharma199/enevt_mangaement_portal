import { getFirestore, collection, doc, addDoc, getDocs, getDoc, where, query, orderBy, setDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAiEXI9oroiID2QnXJGOHMCLe-Y69nJk3I",
    authDomain: "event-management-5bf5c.firebaseapp.com",
    projectId: "event-management-5bf5c",
    storageBucket: "event-management-5bf5c.appspot.com",
    messagingSenderId: "853718735630",
    appId: "1:853718735630:web:d18e408398dc81aa12555f"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

document.addEventListener("DOMContentLoaded", async() => {
    loadUpcoming()
})

async function loadUpcoming() {
    const date = new Date()
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("fulltime", ">=", date), orderBy("fulltime", "desc"));
    const eventSnapshot = await getDocs(q);
    document.getElementById("loading").remove()
    eventSnapshot.forEach((doc) => {
        const eventData = doc.data()
        const eventOutsideBox = document.getElementById("row-grid")
        const codeBlock = `<div class="col-lg-4 templatemo-item-col all soon">
        <div class="meeting-item">
            <div class="thumb">
                <div class="price">
                    <span></span>
                </div>
                <a href="meeting-details.html?id=${doc.id}"><img src="${eventData.image}" alt="Event Image"></a>
            </div>
            <div class="down-content">
                <div class="date">
                    <h6>${eventData.dateMonth}<span>${eventData.dateDate}</span></h6>
                </div>
                <a href="meeting-details.html?id=${doc.id}">
                    <h4>${eventData.name}</h4>
                </a>
                <p>${eventData.description}</p>
            </div>
        </div>
    </div>
</div>
    `
        eventOutsideBox.innerHTML += codeBlock
    })
}

document.getElementById("upcoming").addEventListener("click", async() => {
    document.getElementById("row-grid").innerHTML = `<div class="d-flex justify-content-center" id="loading">
    <div class="spinner-border text-success" style="width: 10rem; height: 10rem;" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>`
    loadUpcoming()
});

document.getElementById("past").addEventListener("click", async() => {
    document.getElementById("row-grid").innerHTML = `<div class="d-flex justify-content-center" id="loading">
    <div class="spinner-border text-success" style="width: 10rem; height: 10rem;" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>`
    const date = new Date()
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("fulltime", "<=", date), orderBy("fulltime", "desc"));
    const eventSnapshot = await getDocs(q);
    document.getElementById("loading").remove()
    eventSnapshot.forEach((doc) => {
        const eventData = doc.data()
        const eventOutsideBox = document.getElementById("row-grid")
        const codeBlock = `<div class="col-lg-4 templatemo-item-col all soon">
        <div class="meeting-item">
            <div class="thumb">
                <div class="price">
                    <span></span>
                </div>
                <a href="meeting-details.html?id=${doc.id}"><img src="${eventData.image}" alt="Event Image"></a>
            </div>
            <div class="down-content">
                <div class="date">
                    <h6>${eventData.dateMonth}<span>${eventData.dateDate}</span></h6>
                </div>
                <a href="meeting-details.html?id=${doc.id}">
                    <h4>${eventData.name}</h4>
                </a>
                <p>${eventData.description}</p>
            </div>
        </div>
    </div>
</div>
    `
        eventOutsideBox.innerHTML += codeBlock
    })
})

document.getElementById("all").addEventListener("click", async() => {
    document.getElementById("row-grid").innerHTML = `<div class="d-flex justify-content-center" id="loading">
    <div class="spinner-border text-success" style="width: 10rem; height: 10rem;" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>`
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("fulltime", "desc"));
    const eventSnapshot = await getDocs(q);
    document.getElementById("loading").remove()
    eventSnapshot.forEach((doc) => {
        const eventData = doc.data()
        const eventOutsideBox = document.getElementById("row-grid")
        const codeBlock = `<div class="col-lg-4 templatemo-item-col all soon">
        <div class="meeting-item">
            <div class="thumb">
                <div class="price">
                    <span></span>
                </div>
                <a href="meeting-details.html?id=${doc.id}"><img src="${eventData.image}" alt="Event Image"></a>
            </div>
            <div class="down-content">
                <div class="date">
                    <h6>${eventData.dateMonth}<span>${eventData.dateDate}</span></h6>
                </div>
                <a href="meeting-details.html?id=${doc.id}">
                    <h4>${eventData.name}</h4>
                </a>
                <p>${eventData.description}</p>
            </div>
        </div>
    </div>
</div>
    `
        eventOutsideBox.innerHTML += codeBlock
    })
})