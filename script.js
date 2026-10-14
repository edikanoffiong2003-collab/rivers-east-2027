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

  // FORM SUBMISSION & OPTIONAL FILE CONVERT
  const form = document.getElementById("campaignForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const statusDiv = document.getElementById("status");

    submitBtn.disabled = true;
    statusDiv.style.color = "#0f172a";
    statusDiv.innerText = "Submitting registration...";

    try {
      const fileInput = document.getElementById("pvcImage").files[0];
      let base64File = "";
      let fileName = "";

      // Only convert image if user selected a file
      if (fileInput) {
        statusDiv.innerText = "Submitting registration & uploading PVC...";
        base64File = await convertBase64(fileInput);
        fileName = `${document.getElementById("fullName").value}_PVC.jpg`;
      }

      const payload = {
        fullName: document.getElementById("fullName").value,
        whatsapp: document.getElementById("whatsapp").value,
        role: document.getElementById("role").value,
        lga: document.getElementById("lga").value,
        ward: document.getElementById("ward").value,
        pollingUnit: document.getElementById("pollingUnit").value,
        vin: document.getElementById("vin").value || "",
        fileData: base64File,
        fileName: fileName
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "success") {
        // Display Thank You screen inside the card
        const cardContent = document.querySelector(".card-content");
        cardContent.innerHTML = `
          <div style="text-align: center; padding: 20px 10px;">
            <div style="font-size: 50px; color: #28a745; margin-bottom: 10px;">✓</div>
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 10px;">THANK YOU FOR JOINING!</h2>
            <p style="color: #334155; font-size: 15px; font-weight: 600; line-height: 1.5;">
              Your registration for <strong>Project 1,000,000 Votes for Senator Allwell Onyesoh</strong> has been submitted successfully.
            </p>
          </div>
        `;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      statusDiv.style.color = "red";
      statusDiv.innerText = "Error submitting form. Please check your network and try again.";
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