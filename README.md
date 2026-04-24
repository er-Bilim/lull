# 🎵 Music App API

A backend implementation for a music application built with **NestJS**. This API manages artists, albums, and tracks with file upload support.

---

## 🛠 Tech Stack
* **Framework:** [NestJS](https://nestjs.com/)
* **Language:** TypeScript
* **Middleware:** Multer (for image processing)

---

## 📌 API Endpoints

### 👤 Artists
* `GET /artists` – Get a list of all artists.
* `GET /artists/:id` – Get detailed information about a specific artist.
* `POST /artists` – Create a new artist (supports image upload 🖼️).
* `DELETE /artists/:id` – Remove an artist.

### 💿 Albums
* `GET /albums` – Get a list of all albums.
* `GET /albums?artistId={id}` – Get albums by a specific artist (using query parameters).
* `GET /albums/:id` – Get detailed information about a specific album.
* `POST /albums` – Create a new album (supports image upload 🖼️).
* `DELETE /albums/:id` – Remove an album.

### 🎶 Tracks
* `GET /tracks` – Get a list of all tracks.
* `GET /tracks?albumId={id}` – Get tracks from a specific album (using query parameters).
* `POST /tracks` – Add a new track.
* `DELETE /tracks/:id` – Remove a track.

---

## ⚙️ Key Features
* **Public Access:** All endpoints are open to everyone. No authentication or authorization is required. 🔓
* **Image Uploads:** Built-in support for uploading cover art and profile pictures for both Artists and Albums.
* **Smart Filtering:** Instead of using separate routes, filtering for specific artist albums or album tracks is handled efficiently via **query parameters**.

---

## 🚀 Getting Started

1. **Install dependencies:**
  ```bash
   npm install
   ```
2. **Run the server:**
  ```bash
  npm run start:dev
  ```
3. **Access the API:**
  *The server will be running at ```http://localhost:3000```🌐*

**Developed with ❤️ using NestJS**