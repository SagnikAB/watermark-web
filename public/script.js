document.addEventListener("DOMContentLoaded", () => {
  // ================= ELEMENTS =================
  const form = document.getElementById("watermarkForm");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const darkToggle = document.getElementById("darkToggle");

  // ================= DARK MODE =================
  // Restore saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  }

  // Toggle theme
  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  // ================= LIVE IMAGE PREVIEW =================
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

  // ================= FORM SUBMIT =================
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

      // Auto-download result
      const link = document.createElement("a");
      link.href = url;
      link.download = "watermarked.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console.");
    }
  });
});
