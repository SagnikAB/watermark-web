# 🖼️ Image Watermark Tool

A full-stack web application that allows users to add **custom text or logo watermarks** to images.  
Built with **Node.js, Express, Sharp**, and deployed on **Vercel**.

---

## 🚀 Features

- ✅ Upload images and add watermarks
- ✏️ Custom text watermark
- 🖼️ Logo/image watermark support
- 🔁 Repeating diagonal watermark option
- 🌙 Dark mode toggle
- 👀 Live image preview before download
- 📥 Download watermarked image
- ☁️ Serverless deployment on Vercel

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Image Processing:** Sharp
- **File Uploads:** Multer
- **Deployment:** Vercel (Serverless Functions)

---

## 📸 Screenshots

<img width="506" height="730" alt="Screenshot 2026-01-27 002738" src="https://github.com/user-attachments/assets/e608e4c6-66d0-4c35-b816-11188b1090fd" />


---

## 🔧 How It Works

1. User uploads an image
2. Chooses watermark options (text/logo, size, opacity, position)
3. Backend processes the image using Sharp
4. Watermarked image is returned and downloadable

---

## ▶️ Run Locally

```bash
git clone https://github.com/SagnikAB/watermark-web.git
cd watermark-web
npm install
npx vercel dev
