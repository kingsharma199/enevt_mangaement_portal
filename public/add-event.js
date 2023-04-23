import { getFirestore, collection, doc, addDoc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
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


const storage = getStorage(app)
const imagesRef = ref(storage, "images")
let uploadedImageURL;

document.getElementById("header-img-upload").addEventListener("click", (event) => {
    event.preventDefault()
    console.log("new file recieved");
    const file = document.getElementById("header-img").files[0]
    const fileName = `${Date.now()}${file.name}`
    const imagesWithFileName = ref(storage, `images/${fileName}`);
    uploadBytes(imagesWithFileName, file)
        .then((snapshot) => {
            console.log('Uploaded a blob or file!');
            getDownloadURL(ref(storage, `images/${fileName}`))
                .then((url) => {
                    document.getElementById('header-img-display').setAttribute('src', url)
                    uploadedImageURL = url;
                })
        });
})

document.getElementById("submit-event").addEventListener('click', async(event) => {
    event.preventDefault()

    const eventName = document.getElementById('event-name').value;
    const eventDescription = document.getElementById('event-description').value;
    const eventLocation = document.getElementById('event-location').value;
    const dateMonth = document.getElementById('month').value;
    const dateDate = document.getElementById('date').value;
    const dayFrom = document.getElementById('dayFrom').value;
    const dayTo = document.getElementById('dayTo').value;
    const timeFrom = document.getElementById('timeFrom').value;
    const timeTo = document.getElementById('timeTo').value;
    const eventPhoto = uploadedImageURL

    console.log({
        eventName,
        eventDescription,
        eventLocation,
        dateMonth,
        dateDate,
        dayFrom,
        dayTo,
        timeFrom,
        timeTo,
        eventPhoto
    });
    const docRef = await addDoc(collection(db, "events"), {
        'name': eventName,
        'description': eventDescription,
        'location': eventLocation,
        'dateMonth': dateMonth,
        'dateDate': dateDate,
        'hours': [{
            'dayFrom': dayFrom,
            'dayTo': dayTo,
            'timeFrom': timeFrom,
            'timeTo': timeTo
        }],
        'image': eventPhoto,
        'participants': []
    })
    alert("New Event Added")
    window.location(`/meeting-details?id=${docRef.id}`)
})