const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const coordsP = document.getElementById('coords');
const mapsLink = document.getElementById('maps-link');

let stream = null;
let currentFacingMode = "environment";

function initApp() {
    openCamera();
}

// Abrir cámara
async function openCamera() {
    try {
        stopCamera();

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        video.srcObject = stream;
        await video.play();
        
        console.log("Cámara activada");

    } catch (error) {
        console.error("Error cámara:", error);

        if (error.name === "NotAllowedError") {
            alert("Debes permitir el uso de la cámara");
        } else {
            alert("No se pudo acceder a la cámara");
        }
    }
}

// Tomar foto
async function takePhoto() {
    try {
        // Obtener ubicación
        const position = await getCurrentPosition();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Capturar imagen
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        
        // Mostrar modal
        modalImg.src = dataUrl;
        coordsP.textContent = `Latitud: ${lat.toFixed(4)}, Longitud: ${lng.toFixed(4)}`;
        mapsLink.href = `https://www.google.com/maps?q=${lat},${lng}`;
        
        modal.style.display = 'flex';
        
        // Detener cámara
        stopCamera();
        
        console.log("Foto tomada");

    } catch (error) {
        console.error("Error al tomar foto:", error);
        alert("Error al capturar la foto o obtener ubicación");
    }
}

// Obtener ubicación actual
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocalización no soportada"));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
}

// Cerrar modal
function closeModal() {
    modal.style.display = 'none';
    // Reabrir cámara
    openCamera();
}

// Cambiar cámara
function switchCamera() {
    currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
    openCamera();
}

// Detener cámara
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Event Listeners
captureBtn.addEventListener('click', takePhoto);

// Cambiar cámara con doble tap
video.addEventListener('dblclick', switchCamera);

// Inicializar
window.addEventListener('load', initApp);

// Detener al cerrar
window.addEventListener('beforeunload', stopCamera);