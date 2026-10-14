// GOOGLE APPS SCRIPT WEB APP ENDPOINT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxI_hR2lIU9ExtCmHmRgp-jxPexkDNxV5fqY1GFldW2vm0EIN2Mxi0G7okArwv7A5ZqzQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  // BACKGROUND SLIDESHOW LOGIC
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  if (slides.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 4000); // Transitions every 4 seconds
  }

  // FORM SUBMISSION & BASE64 CONVERT
  const form = document.getElementById("campaignForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const statusDiv = document.getElementById("status");

    submitBtn.disabled = true;
    statusDiv.style.color = "#0f172a";
    statusDiv.innerText = "Submitting registration & uploading PVC...";

    try {
      const fileInput = document.getElementById("pvcImage").files[0];
      const base64File = await convertBase64(fileInput);

      const payload = {
        fullName: document.getElementById("fullName").value,
        whatsapp: document.getElementById("whatsapp").value,
        role: document.getElementById("role").value,
        lga: document.getElementById("lga").value,
        ward: document.getElementById("ward").value,
        pollingUnit: document.getElementById("pollingUnit").value,
        vin: document.getElementById("vin").value,
        fileData: base64File,
        fileName: `${document.getElementById("fullName").value}_PVC.jpg`
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "success") {
        statusDiv.style.color = "green";
        statusDiv.innerText = "Registration successful! Thank you for supporting Senator Allwell Onyesoh.";
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      statusDiv.style.color = "red";
      statusDiv.innerText = "Error submitting form. Please check your network and try again.";
    } finally {
      submitBtn.disabled = false;
    }
  });
});

// Convert file to Base64
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
};