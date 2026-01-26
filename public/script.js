document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("watermarkForm");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const darkToggle = document.getElementById("darkToggle");

  // Restore dark mode
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Dark mode toggle
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  // Live image preview
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  // Handle form submit (ASYNC IS HERE ✅)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "watermarked.png";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console.");
    }
  });
});
