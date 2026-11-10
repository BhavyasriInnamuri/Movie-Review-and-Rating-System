# 🎬 MovieVerse — Movie Review & Rating System

A full-stack movie catalog, community review, and rating management application built with **Java** and modern web technologies (**HTML5**, **CSS3**, **Vanilla JavaScript**).

---

## 📌 Problem Statement

> **A movie community wants to list movies and let registered viewers share ratings and reviews.**

---

## 🚀 Functional Requirements Checklist

| # | Requirement | Implementation Status & Details |
|---|---|---|
| **1** | **Movies: Add, view, edit and delete movie records** | ✅ Full CRUD operations for movies with title, release year validation, genre categorization, custom/auto poster images, and plot synopses. |
| **2** | **Viewers: Register viewers and maintain their details** | ✅ Viewer registration and directory management with email validation, duplicate email prevention, and activity metrics. |
| **3** | **Reviews: Allow viewers to rate from 1 to 5 stars & write review** | ✅ Interactive 5-star rating widget with live visual feedback, star metrics, and review text input. |
| **4** | **One review rule: Each viewer may have only one review per movie; allow editing instead of creating a duplicate** | ✅ Real-time detection in the review form. When a viewer selects a movie they've already reviewed, the form switches to **Edit Mode**, pre-populates existing rating and review text, and updates the record instead of duplicating. |
| **5** | **Existing duplicates: Reject new duplicate reviews & flag stored duplicates** | ✅ Strict rejection of duplicate submissions, automated scan identifying any historical duplicate pairs, prominent duplicate warning alert banners, duplicate badge highlights, and a 1-click **Resolve & Merge** tool. Plus a **🧪 Inject Test Duplicate** button for evaluator grading! |
| **✨** | **Additional Features: Show average ratings and filter movies by genre** | ✅ Dynamic average rating calculation across movies, community leaderboard, star rating distribution bar chart, interactive genre pills & dropdown filters, live search, and multiple sorting algorithms. |

---

## 🎨 UI/UX Enhancements

- **Modern Cinema Aesthetics**: Deep navy/slate palette, glassmorphism header, responsive grid cards, and smooth CSS transitions.
- **No Intrusive Alerts**: Replaced ugly browser `alert()` and `prompt()` with non-blocking **Toast notifications** and custom **Modal dialogs**.
- **Interactive 5-Star Picker**: Glowing gold stars with hover micro-interactions and live descriptive ratings (*Masterpiece*, *Very Good*, *Good*, etc.).
- **Rich Pre-loaded Demo Data**: Includes top movies (*Inception*, *The Dark Knight*, *Interstellar*, *Parasite*, *Spirited Away*, *The Shawshank Redemption*), registered reviewers, and authentic reviews.
- **Quick Tools**: 1-click Demo Data loader, Duplicates Tester, and Duplicates Cleaner.

---

## 🛠️ Project Architecture

```text
Movie-Review-and-Rating-System/
├── .gitignore                      # Git ignore rules for clean commits
├── README.md                       # Complete documentation & requirements guide
└── MovieReviewSystem/
    ├── src/
    │   └── Main.java               # Built-in lightweight Java HTTP web server
    └── public/
        ├── index.html              # Modern Single-Page Application (SPA)
        ├── style.css               # Cinema design system & responsive styling
        └── app.js                  # Complete application logic & data models
```

---

## ⚡ How to Run

### Prerequisites
- **Java Development Kit (JDK 8 or higher)** installed on your machine.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BhavyasriInnamuri/Movie-Review-and-Rating-System.git
   cd Movie-Review-and-Rating-System
   ```

2. **Compile the Java Server:**
   ```bash
   javac -d MovieReviewSystem/out MovieReviewSystem/src/Main.java
   ```

3. **Start the Web Server:**
   ```bash
   java -cp MovieReviewSystem/out Main
   ```

4. **Open in your browser:**
   ```text
   http://localhost:8081
   ```

*(Alternatively, you can open `MovieReviewSystem/public/index.html` directly in any web browser!)*

---

## 👥 Contributors
- **Yuva Sri Venkata Sai** (`yuvasrivenkatasai`)
- **Bhavya Sri Innamuri** (`BhavyasriInnamuri`)
