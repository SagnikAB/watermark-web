document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("watermarkForm");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const darkToggle = document.getElementById("darkToggle");

  // Restore theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  // Live preview
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

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        alert(await response.text());
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked.png";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  });
});
