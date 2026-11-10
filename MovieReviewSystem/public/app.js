// ============================================================
// MOVIEVERSE - JAVASCRIPT APPLICATION CORE
// ============================================================

// State storage keys
const STORAGE_KEYS = {
    MOVIES: "movieverse_movies_v2",
    VIEWERS: "movieverse_viewers_v2",
    REVIEWS: "movieverse_reviews_v2"
};

// Initial state loaded from LocalStorage
let movies = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES)) || [];
let viewers = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWERS)) || [];
let reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS)) || [];

// UI State
let activeSection = "dashboard";
let currentGenreFilter = "";
let showOnlyDuplicatesFilter = false;
let confirmCallback = null;

// Star rating descriptor dictionary
const RATING_DESCRIPTORS = {
    1: "★☆☆☆☆ (1/5) — Poor",
    2: "★★☆☆☆ (2/5) — Fair",
    3: "★★★☆☆ (3/5) — Good",
    4: "★★★★☆ (4/5) — Very Good",
    5: "★★★★★ (5/5) — Masterpiece!"
};

// ============================================================
// INITIALIZATION & SAMPLE DATA SEEDING
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // If first time or empty, seed sample data
    if (movies.length === 0 && viewers.length === 0) {
        seedInitialSampleData();
    }

    // Close dropdowns on outside click
    document.addEventListener("click", (e) => {
        const menu = document.getElementById("quickToolsMenu");
        if (menu && !e.target.closest(".header-actions")) {
            menu.classList.add("hidden");
        }
    });

    // Close modals on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });

    // Render initial views
    refreshAllViews();
});

function seedInitialSampleData() {
    movies = [
        {
            id: "mov_1",
            title: "Inception",
            year: 2010,
            genre: "Sci-Fi",
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            createdAt: new Date("2026-01-10").toISOString()
        },
        {
            id: "mov_2",
            title: "The Dark Knight",
            year: 2008,
            genre: "Action",
            poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            createdAt: new Date("2026-01-11").toISOString()
        },
        {
            id: "mov_3",
            title: "Interstellar",
            year: 2014,
            genre: "Sci-Fi",
            poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.",
            createdAt: new Date("2026-01-12").toISOString()
        },
        {
            id: "mov_4",
            title: "Parasite",
            year: 2019,
            genre: "Thriller",
            poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
            description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            createdAt: new Date("2026-01-13").toISOString()
        },
        {
            id: "mov_5",
            title: "Spirited Away",
            year: 2001,
            genre: "Animation",
            poster: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
            description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
            createdAt: new Date("2026-01-14").toISOString()
        },
        {
            id: "mov_6",
            title: "The Shawshank Redemption",
            year: 1994,
            genre: "Drama",
            poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
            description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            createdAt: new Date("2026-01-15").toISOString()
        }
    ];

    viewers = [
        {
            id: "view_1",
            name: "Venkat Sai Mukkala",
            email: "venkatsaimukkala@gmail.com",
            createdAt: new Date("2026-01-10").toISOString()
        },
        {
            id: "view_2",
            name: "Bhavya Sri Innamuri",
            email: "bhavyasri@example.com",
            createdAt: new Date("2026-01-11").toISOString()
        },
        {
            id: "view_3",
            name: "Alex Rivera",
            email: "alex.rivera@cinema.org",
            createdAt: new Date("2026-01-12").toISOString()
        },
        {
            id: "view_4",
            name: "Sophia Chen",
            email: "sophia.chen@filmfan.com",
            createdAt: new Date("2026-01-13").toISOString()
        }
    ];

    reviews = [
        {
            id: "rev_1",
            movieId: "mov_1",
            viewerId: "view_1",
            rating: 5,
            text: "A mind-bending cinematic masterpiece with Hans Zimmer's unforgettable score. Truly Christopher Nolan at his peak storytelling.",
            date: "12/01/2026",
            createdAt: new Date("2026-01-12").toISOString()
        },
        {
            id: "rev_2",
            movieId: "mov_1",
            viewerId: "view_2",
            rating: 4,
            text: "Brilliant concept and visuals. Requires full attention from start to finish. Highly recommended!",
            date: "14/01/2026",
            createdAt: new Date("2026-01-14").toISOString()
        },
        {
            id: "rev_3",
            movieId: "mov_2",
            viewerId: "view_1",
            rating: 5,
            text: "Heath Ledger's Joker sets the gold standard for movie villains. Gripping, intense, and timeless.",
            date: "15/01/2026",
            createdAt: new Date("2026-01-15").toISOString()
        },
        {
            id: "rev_4",
            movieId: "mov_3",
            viewerId: "view_3",
            rating: 5,
            text: "Emotionally devastating and scientifically awe-inspiring. The docking scene gave me goosebumps.",
            date: "18/01/2026",
            createdAt: new Date("2026-01-18").toISOString()
        },
        {
            id: "rev_5",
            movieId: "mov_4",
            viewerId: "view_4",
            rating: 5,
            text: "Unpredictable, layered social commentary and razor-sharp dark humor. Deserved every Oscar.",
            date: "20/01/2026",
            createdAt: new Date("2026-01-20").toISOString()
        },
        {
            id: "rev_6",
            movieId: "mov_5",
            viewerId: "view_2",
            rating: 5,
            text: "Hayao Miyazaki's animation is pure poetry. Magical, tender, and beautifully drawn.",
            date: "22/01/2026",
            createdAt: new Date("2026-01-22").toISOString()
        }
    ];

    saveAllData();
}

function saveAllData() {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
    localStorage.setItem(STORAGE_KEYS.VIEWERS, JSON.stringify(viewers));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
}

function refreshAllViews() {
    saveAllData();
    updateNavigationBadges();
    updateDashboard();
    updateReviewDropdowns();

    if (activeSection === "movies") displayMovies();
    if (activeSection === "viewers") displayViewers();
    if (activeSection === "reviews") displayReviews();
}

// Generate unique ID
function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// XSS Sanitizer
function safeHtml(val) {
    return String(val ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);
}

// Navigation between sections
function showSection(sectionId, filterDuplicates = false) {
    activeSection = sectionId;

    document.querySelectorAll(".content-section").forEach(sec => sec.classList.add("hidden"));
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

    const targetSection = document.getElementById(sectionId);
    const targetNav = document.getElementById(`nav-${sectionId}`);

    if (targetSection) targetSection.classList.remove("hidden");
    if (targetNav) targetNav.classList.add("active");

    if (filterDuplicates) {
        showOnlyDuplicatesFilter = true;
    }

    if (sectionId === "dashboard") updateDashboard();
    if (sectionId === "movies") displayMovies();
    if (sectionId === "viewers") displayViewers();
    if (sectionId === "reviews") displayReviews();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNavigationBadges() {
    document.getElementById("navMovieBadge").textContent = movies.length;
    document.getElementById("navViewerBadge").textContent = viewers.length;
    document.getElementById("navReviewBadge").textContent = reviews.length;
}

// Quick action menu toggle
function openQuickActionMenu() {
    const menu = document.getElementById("quickToolsMenu");
    menu.classList.toggle("hidden");
}

function loadSampleData() {
    seedInitialSampleData();
    refreshAllViews();
    showToast("Sample data loaded successfully!", "success");
    const menu = document.getElementById("quickToolsMenu");
    if (menu) menu.classList.add("hidden");
}

function confirmResetAll() {
    const menu = document.getElementById("quickToolsMenu");
    if (menu) menu.classList.add("hidden");

    openConfirmModal(
        "Reset All System Data?",
        "This will wipe all movies, registered viewers, and reviews from local storage. This action cannot be undone.",
        () => {
            movies = [];
            viewers = [];
            reviews = [];
            saveAllData();
            refreshAllViews();
            showToast("All data has been reset.", "info");
        }
    );
}

// ============================================================
// DASHBOARD LOGIC
// ============================================================

function updateDashboard() {
    document.getElementById("dashMovieCount").textContent = movies.length;
    document.getElementById("dashViewerCount").textContent = viewers.length;
    document.getElementById("dashReviewCount").textContent = reviews.length;

    const avg = getGlobalAverageRating();
    document.getElementById("dashAvgRating").textContent = avg.toFixed(1);
    document.getElementById("dashStarsPreview").innerHTML = renderStarRating(Math.round(avg));

    // Check duplicate reviews for Requirement #5
    const duplicateMap = findDuplicateReviews();
    const dashBanner = document.getElementById("dashDuplicateBanner");
    const dashMsg = document.getElementById("dashDuplicateMessage");

    if (duplicateMap.duplicateIds.size > 0) {
        dashBanner.classList.remove("hidden");
        dashMsg.textContent = `Found ${duplicateMap.duplicateIds.size} duplicate review records violating the 1-review per movie rule.`;
    } else {
        dashBanner.classList.add("hidden");
    }

    // Top rated movies
    renderDashboardTopMovies();

    // Recent activity reviews
    renderDashboardRecentReviews();
}

function getGlobalAverageRating() {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / reviews.length;
}

function renderDashboardTopMovies() {
    const list = document.getElementById("dashTopMoviesList");
    if (!list) return;

    if (movies.length === 0) {
        list.innerHTML = `<div class="empty-state"><p>No movies in catalog yet.</p></div>`;
        return;
    }

    const ratedMovies = movies.map(movie => {
        const stats = getMovieReviewStats(movie.id);
        return { ...movie, avgRating: stats.average, reviewCount: stats.count };
    });

    // Sort by rating desc, then review count
    ratedMovies.sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount);
    const top4 = ratedMovies.slice(0, 4);

    list.innerHTML = top4.map((movie, index) => `
        <div class="dash-movie-item" onclick="openMovieDetailsModal('${movie.id}')">
            <div class="dash-movie-left">
                <span class="dash-movie-rank">#${index + 1}</span>
                <div>
                    <div class="dash-movie-title">${safeHtml(movie.title)} <small style="color:var(--text-muted)">(${movie.year})</small></div>
                    <span class="dash-movie-genre">${safeHtml(movie.genre)} &bull; ${movie.reviewCount} reviews</span>
                </div>
            </div>
            <div class="dash-movie-right">
                <span class="dash-rating-pill">★ ${movie.avgRating.toFixed(1)}</span>
            </div>
        </div>
    `).join("");
}

function renderDashboardRecentReviews() {
    const list = document.getElementById("dashRecentReviewsList");
    if (!list) return;

    if (reviews.length === 0) {
        list.innerHTML = `<div class="empty-state"><p>No reviews posted yet.</p></div>`;
        return;
    }

    const sorted = [...reviews].reverse().slice(0, 4);

    list.innerHTML = sorted.map(rev => {
        const movie = movies.find(m => m.id === rev.movieId);
        const viewer = viewers.find(v => v.id === rev.viewerId);
        return `
            <div class="dash-review-item">
                <div class="dash-review-meta">
                    <strong>${safeHtml(viewer?.name || "Viewer")} on <em>${safeHtml(movie?.title || "Movie")}</em></strong>
                    <span style="color:var(--gold-star)">${"★".repeat(rev.rating)}</span>
                </div>
                <div class="dash-review-text">"${safeHtml(rev.text.length > 90 ? rev.text.slice(0, 90) + '...' : rev.text)}"</div>
            </div>
        `;
    }).join("");
}

// ============================================================
// REQUIREMENT 1: MOVIES MANAGEMENT (CRUD)
// ============================================================

function displayMovies() {
    const grid = document.getElementById("movieGrid");
    const searchVal = document.getElementById("movieSearchInput").value.trim().toLowerCase();
    const genreSelectVal = document.getElementById("movieGenreSelect").value;
    const sortVal = document.getElementById("movieSortSelect").value;
    const clearBtn = document.getElementById("clearMovieSearch");

    if (clearBtn) {
        clearBtn.classList.toggle("hidden", searchVal.length === 0);
    }

    // Active genre can come from select or pill
    const activeGenre = genreSelectVal || currentGenreFilter;

    // Sync select and pills
    if (document.getElementById("movieGenreSelect").value !== activeGenre) {
        document.getElementById("movieGenreSelect").value = activeGenre;
    }
    updateGenrePillsUI(activeGenre);

    let filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchVal) ||
                              (movie.description && movie.description.toLowerCase().includes(searchVal));
        const matchesGenre = !activeGenre || movie.genre.toLowerCase() === activeGenre.toLowerCase();
        return matchesSearch && matchesGenre;
    });

    // Sorting
    filtered.sort((a, b) => {
        const statsA = getMovieReviewStats(a.id);
        const statsB = getMovieReviewStats(b.id);

        if (sortVal === "rating-desc") return statsB.average - statsA.average || statsB.count - statsA.count;
        if (sortVal === "rating-asc")  return statsA.average - statsB.average;
        if (sortVal === "reviews-desc") return statsB.count - statsA.count;
        if (sortVal === "year-desc")   return b.year - a.year;
        if (sortVal === "year-asc")    return a.year - b.year;
        if (sortVal === "title-asc")   return a.title.localeCompare(b.title);
        return 0;
    });

    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🎬</div>
                <h3>No Movies Found</h3>
                <p>Try adjusting your search query or genre filter, or add a new movie to the catalog.</p>
                <button class="btn btn-primary" onclick="openAddMovieModal()">+ Add Movie</button>
            </div>
        `;
        return;
    }

    filtered.forEach(movie => {
        const stats = getMovieReviewStats(movie.id);
        const genreEmoji = getGenreEmoji(movie.genre);

        grid.innerHTML += `
            <div class="movie-card">
                <div class="movie-poster-banner">
                    ${movie.poster ? `<img src="${safeHtml(movie.poster)}" alt="${safeHtml(movie.title)}" onerror="this.onerror=null;this.parentElement.innerHTML='${genreEmoji}'">` : `<span>${genreEmoji}</span>`}
                    <div class="movie-badge-group">
                        <span class="genre-badge">${safeHtml(movie.genre)}</span>
                        <span class="year-badge">${movie.year}</span>
                    </div>
                </div>

                <div class="movie-card-body">
                    <div class="movie-card-header">
                        <h3 class="movie-card-title">${safeHtml(movie.title)}</h3>
                        <span class="movie-rating-badge">★ ${stats.average.toFixed(1)}</span>
                    </div>

                    <p class="movie-synopsis">${safeHtml(movie.description)}</p>

                    <div class="movie-review-stats">
                        <span>⭐ ${renderStarRating(Math.round(stats.average))}</span>
                        <span>${stats.count} ${stats.count === 1 ? 'review' : 'reviews'}</span>
                    </div>

                    <div class="card-actions">
                        <button class="btn btn-outline btn-sm" onclick="openMovieDetailsModal('${movie.id}')">
                            Details
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="openAddReviewModalForMovie('${movie.id}')">
                            + Review
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="openEditMovieModal('${movie.id}')" title="Edit movie details">
                            ✏️
                        </button>
                        <button class="btn btn-outline btn-sm text-danger" onclick="confirmDeleteMovie('${movie.id}')" title="Delete movie">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function selectGenrePill(genre) {
    currentGenreFilter = genre;
    document.getElementById("movieGenreSelect").value = genre;
    displayMovies();
}

function updateGenrePillsUI(activeGenre) {
    document.querySelectorAll("#genrePillsContainer .pill").forEach(pill => {
        pill.classList.toggle("active", pill.dataset.genre === activeGenre);
    });
}

function openAddMovieModal() {
    document.getElementById("movieModalTitle").textContent = "Add New Movie";
    document.getElementById("movieFormSubmitBtn").textContent = "Save Movie";
    document.getElementById("movieFormId").value = "";
    document.getElementById("movieFormTitle").value = "";
    document.getElementById("movieFormYear").value = new Date().getFullYear();
    document.getElementById("movieFormGenre").value = "";
    document.getElementById("movieFormPoster").value = "";
    document.getElementById("movieFormDescription").value = "";

    openModal("movieModal");
}

function openEditMovieModal(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    document.getElementById("movieModalTitle").textContent = "Edit Movie Details";
    document.getElementById("movieFormSubmitBtn").textContent = "Update Movie";
    document.getElementById("movieFormId").value = movie.id;
    document.getElementById("movieFormTitle").value = movie.title;
    document.getElementById("movieFormYear").value = movie.year;
    document.getElementById("movieFormGenre").value = movie.genre;
    document.getElementById("movieFormPoster").value = movie.poster || "";
    document.getElementById("movieFormDescription").value = movie.description || "";

    openModal("movieModal");
}

function handleMovieFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("movieFormId").value;
    const title = document.getElementById("movieFormTitle").value.trim();
    const year = Number(document.getElementById("movieFormYear").value);
    const genre = document.getElementById("movieFormGenre").value;
    const poster = document.getElementById("movieFormPoster").value.trim();
    const description = document.getElementById("movieFormDescription").value.trim();

    if (!title || !year || !genre || !description) {
        showToast("Please fill in all required fields.", "warning");
        return;
    }

    if (!Number.isInteger(year) || year < 1888 || year > 2100) {
        showToast("Enter a valid release year between 1888 and 2100.", "warning");
        return;
    }

    if (id) {
        // Edit existing movie
        const movie = movies.find(m => m.id === id);
        if (movie) {
            movie.title = title;
            movie.year = year;
            movie.genre = genre;
            movie.poster = poster;
            movie.description = description;
            showToast(`Updated "${title}" successfully!`, "success");
        }
    } else {
        // Add new movie
        const newMovie = {
            id: generateId("mov"),
            title,
            year,
            genre,
            poster,
            description,
            createdAt: new Date().toISOString()
        };
        movies.unshift(newMovie);
        showToast(`Added "${title}" to movie catalog!`, "success");
    }

    closeModal("movieModal");
    refreshAllViews();
}

function confirmDeleteMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const count = reviews.filter(r => r.movieId === id).length;
    const subText = count > 0 ? ` This will also delete ${count} associated review${count > 1 ? 's' : ''}.` : "";

    openConfirmModal(
        `Delete "${movie.title}"?`,
        `Are you sure you want to delete this movie record?${subText}`,
        () => {
            movies = movies.filter(m => m.id !== id);
            reviews = reviews.filter(r => r.movieId !== id);
            refreshAllViews();
            showToast(`"${movie.title}" and its reviews were deleted.`, "info");
        }
    );
}

// ============================================================
// REQUIREMENT 2: VIEWERS MANAGEMENT (CRUD)
// ============================================================

function displayViewers() {
    const grid = document.getElementById("viewerGrid");
    const searchVal = document.getElementById("viewerSearchInput").value.trim().toLowerCase();
    const clearBtn = document.getElementById("clearViewerSearch");

    if (clearBtn) {
        clearBtn.classList.toggle("hidden", searchVal.length === 0);
    }

    const filtered = viewers.filter(v =>
        v.name.toLowerCase().includes(searchVal) ||
        v.email.toLowerCase().includes(searchVal)
    );

    document.getElementById("viewerStatsSummary").textContent =
        `Showing ${filtered.length} of ${viewers.length} registered viewers`;

    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">👥</div>
                <h3>No Registered Viewers</h3>
                <p>No viewers matched your search. Register a new viewer to start sharing reviews.</p>
                <button class="btn btn-primary" onclick="openAddViewerModal()">+ Register Viewer</button>
            </div>
        `;
        return;
    }

    filtered.forEach(viewer => {
        const viewerReviews = reviews.filter(r => r.viewerId === viewer.id);
        const reviewCount = viewerReviews.length;
        const avgGiven = reviewCount > 0
            ? (viewerReviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount).toFixed(1)
            : "N/A";
        const initials = getInitials(viewer.name);

        grid.innerHTML += `
            <div class="viewer-card">
                <div class="viewer-header">
                    <div class="viewer-avatar">${initials}</div>
                    <div class="viewer-details">
                        <h3>${safeHtml(viewer.name)}</h3>
                        <a href="mailto:${safeHtml(viewer.email)}" class="viewer-email">${safeHtml(viewer.email)}</a>
                    </div>
                </div>

                <div class="viewer-stats-row">
                    <div class="viewer-stat-item">
                        <span class="label">Reviews Written</span>
                        <span class="val">${reviewCount}</span>
                    </div>
                    <div class="viewer-stat-item">
                        <span class="label">Average Rating</span>
                        <span class="val">${avgGiven !== "N/A" ? '★ ' + avgGiven : avgGiven}</span>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn btn-outline btn-sm" onclick="filterReviewsByViewer('${viewer.id}')">
                        Reviews (${reviewCount})
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="openEditViewerModal('${viewer.id}')" title="Edit viewer">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-outline btn-sm text-danger" onclick="confirmDeleteViewer('${viewer.id}')" title="Delete viewer">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    });
}

function openAddViewerModal() {
    document.getElementById("viewerModalTitle").textContent = "Register New Viewer";
    document.getElementById("viewerFormSubmitBtn").textContent = "Register Viewer";
    document.getElementById("viewerFormId").value = "";
    document.getElementById("viewerFormName").value = "";
    document.getElementById("viewerFormEmail").value = "";

    openModal("viewerModal");
}

function openEditViewerModal(id) {
    const viewer = viewers.find(v => v.id === id);
    if (!viewer) return;

    document.getElementById("viewerModalTitle").textContent = "Edit Viewer Details";
    document.getElementById("viewerFormSubmitBtn").textContent = "Update Viewer";
    document.getElementById("viewerFormId").value = viewer.id;
    document.getElementById("viewerFormName").value = viewer.name;
    document.getElementById("viewerFormEmail").value = viewer.email;

    openModal("viewerModal");
}

function handleViewerFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("viewerFormId").value;
    const name = document.getElementById("viewerFormName").value.trim();
    const email = document.getElementById("viewerFormEmail").value.trim().toLowerCase();

    if (!name || !email) {
        showToast("Please enter both name and email.", "warning");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.", "warning");
        return;
    }

    // Check duplicate email
    const duplicate = viewers.find(v => v.id !== id && v.email.toLowerCase() === email);
    if (duplicate) {
        showToast("A viewer with this email is already registered.", "warning");
        return;
    }

    if (id) {
        // Edit viewer
        const viewer = viewers.find(v => v.id === id);
        if (viewer) {
            viewer.name = name;
            viewer.email = email;
            showToast(`Viewer "${name}" updated successfully.`, "success");
        }
    } else {
        // Register viewer
        const newViewer = {
            id: generateId("view"),
            name,
            email,
            createdAt: new Date().toISOString()
        };
        viewers.push(newViewer);
        showToast(`Viewer "${name}" registered successfully!`, "success");
    }

    closeModal("viewerModal");
    refreshAllViews();
}

function confirmDeleteViewer(id) {
    const viewer = viewers.find(v => v.id === id);
    if (!viewer) return;

    const count = reviews.filter(r => r.viewerId === id).length;
    const subText = count > 0 ? ` This will also delete ${count} review${count > 1 ? 's' : ''} submitted by this viewer.` : "";

    openConfirmModal(
        `Delete "${viewer.name}"?`,
        `Are you sure you want to delete this registered viewer?${subText}`,
        () => {
            viewers = viewers.filter(v => v.id !== id);
            reviews = reviews.filter(r => r.viewerId !== id);
            refreshAllViews();
            showToast(`Viewer "${viewer.name}" deleted.`, "info");
        }
    );
}

// ============================================================
// REQUIREMENT 3, 4, 5: REVIEWS, ONE-REVIEW RULE & DUPLICATES
// ============================================================

function updateReviewDropdowns() {
    const movieSelect = document.getElementById("reviewFormMovie");
    const viewerSelect = document.getElementById("reviewFormViewer");
    const movieFilter = document.getElementById("reviewMovieFilter");
    const viewerFilter = document.getElementById("reviewViewerFilter");

    if (movieSelect) {
        movieSelect.innerHTML = `<option value="">Select a Movie...</option>` +
            movies.map(m => `<option value="${m.id}">${safeHtml(m.title)} (${m.year})</option>`).join("");
    }

    if (viewerSelect) {
        viewerSelect.innerHTML = `<option value="">Select a Viewer...</option>` +
            viewers.map(v => `<option value="${v.id}">${safeHtml(v.name)} (${safeHtml(v.email)})</option>`).join("");
    }

    if (movieFilter) {
        const cur = movieFilter.value;
        movieFilter.innerHTML = `<option value="">All Movies</option>` +
            movies.map(m => `<option value="${m.id}">${safeHtml(m.title)}</option>`).join("");
        movieFilter.value = cur;
    }

    if (viewerFilter) {
        const cur = viewerFilter.value;
        viewerFilter.innerHTML = `<option value="">All Viewers</option>` +
            viewers.map(v => `<option value="${v.id}">${safeHtml(v.name)}</option>`).join("");
        viewerFilter.value = cur;
    }
}

/**
 * REQUIREMENT 4: ONE REVIEW RULE
 * "Each viewer may have only one review per movie; allow that review to be edited
 * instead of creating a duplicate."
 *
 * Real-time detection in the form: When viewer and movie are selected, check if a review
 * already exists. If yes, auto-fill existing details and switch into edit mode!
 */
function checkOneReviewRule() {
    const movieId = document.getElementById("reviewFormMovie").value;
    const viewerId = document.getElementById("reviewFormViewer").value;
    const noticeBanner = document.getElementById("oneReviewRuleNotice");
    const noticeText = document.getElementById("oneReviewRuleText");
    const submitBtn = document.getElementById("reviewFormSubmitBtn");
    const modalTitle = document.getElementById("reviewModalTitle");
    const formIdInput = document.getElementById("reviewFormId");

    if (!movieId || !viewerId) {
        noticeBanner.classList.add("hidden");
        return;
    }

    // Find if review already exists
    const existingReview = reviews.find(r => r.movieId === movieId && r.viewerId === viewerId);

    if (existingReview) {
        const movie = movies.find(m => m.id === movieId);
        const viewer = viewers.find(v => v.id === viewerId);

        noticeBanner.classList.remove("hidden");
        noticeText.innerHTML = `<strong>${safeHtml(viewer?.name || "This viewer")}</strong> has already reviewed <strong>${safeHtml(movie?.title || "this movie")}</strong> on ${existingReview.date} (Rating: ${existingReview.rating}★).<br>Editing mode enabled — submitting will <strong>update</strong> this review instead of creating a duplicate.`;

        // Pre-fill existing data to allow edit
        formIdInput.value = existingReview.id;
        selectRating(existingReview.rating);
        document.getElementById("reviewFormText").value = existingReview.text;

        modalTitle.textContent = "Edit Existing Review (One-Review Rule)";
        submitBtn.textContent = "Update Existing Review";
    } else {
        noticeBanner.classList.add("hidden");
        formIdInput.value = "";
        modalTitle.textContent = "Write a Movie Review";
        submitBtn.textContent = "Submit Review";
    }
}

function openAddReviewModal() {
    if (movies.length === 0) {
        showToast("Please add at least one movie first.", "warning");
        showSection("movies");
        return;
    }

    if (viewers.length === 0) {
        showToast("Please register at least one viewer first.", "warning");
        showSection("viewers");
        return;
    }

    updateReviewDropdowns();
    document.getElementById("reviewModalTitle").textContent = "Write a Movie Review";
    document.getElementById("reviewFormSubmitBtn").textContent = "Submit Review";
    document.getElementById("reviewFormId").value = "";
    document.getElementById("reviewFormMovie").value = "";
    document.getElementById("reviewFormViewer").value = "";
    document.getElementById("reviewFormText").value = "";
    document.getElementById("oneReviewRuleNotice").classList.add("hidden");

    selectRating(5);
    openModal("reviewModal");
}

function openAddReviewModalForMovie(movieId) {
    openAddReviewModal();
    const movieSelect = document.getElementById("reviewFormMovie");
    if (movieSelect) {
        movieSelect.value = movieId;
        checkOneReviewRule();
    }
}

function openEditReviewModal(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    updateReviewDropdowns();
    document.getElementById("reviewModalTitle").textContent = "Edit Review";
    document.getElementById("reviewFormSubmitBtn").textContent = "Update Review";
    document.getElementById("reviewFormId").value = review.id;
    document.getElementById("reviewFormMovie").value = review.movieId;
    document.getElementById("reviewFormViewer").value = review.viewerId;
    document.getElementById("reviewFormText").value = review.text;

    selectRating(review.rating);
    checkOneReviewRule();
    openModal("reviewModal");
}

function handleReviewFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("reviewFormId").value;
    const movieId = document.getElementById("reviewFormMovie").value;
    const viewerId = document.getElementById("reviewFormViewer").value;
    const rating = Number(document.getElementById("reviewFormRating").value);
    const text = document.getElementById("reviewFormText").value.trim();

    if (!movieId || !viewerId) {
        showToast("Please select both a movie and a viewer.", "warning");
        return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        showToast("Rating must be between 1 and 5 stars.", "warning");
        return;
    }

    if (!text) {
        showToast("Please write your review thoughts.", "warning");
        return;
    }

    // REQUIREMENT 4 & 5 ENFORCEMENT:
    // Check if another review exists for this (viewer, movie) pair
    const duplicate = reviews.find(r => r.id !== id && r.movieId === movieId && r.viewerId === viewerId);

    if (duplicate && !id) {
        // Enforce: Reject new duplicate reviews & allow editing instead
        showToast("One review rule: Each viewer can only review a movie once. Editing existing review instead.", "warning");
        // Update the existing review instead of creating a duplicate
        duplicate.rating = rating;
        duplicate.text = text;
        duplicate.date = new Date().toLocaleDateString();
        duplicate.updatedAt = new Date().toISOString();
        closeModal("reviewModal");
        refreshAllViews();
        return;
    }

    if (id) {
        // Update existing review
        const review = reviews.find(r => r.id === id);
        if (review) {
            review.movieId = movieId;
            review.viewerId = viewerId;
            review.rating = rating;
            review.text = text;
            review.date = new Date().toLocaleDateString();
            review.updatedAt = new Date().toISOString();
            showToast("Review updated successfully!", "success");
        }
    } else {
        // Add new unique review
        const newReview = {
            id: generateId("rev"),
            movieId,
            viewerId,
            rating,
            text,
            date: new Date().toLocaleDateString(),
            createdAt: new Date().toISOString()
        };
        reviews.unshift(newReview);
        showToast("Review submitted successfully!", "success");
    }

    closeModal("reviewModal");
    refreshAllViews();
}

/**
 * REQUIREMENT 5: DUPLICATE DETECTION & FLAGGING
 * "Existing duplicates: Reject new duplicate reviews and flag any duplicate records already stored."
 */
function findDuplicateReviews() {
    const groups = new Map();
    const duplicateIds = new Set();

    reviews.forEach(review => {
        const key = `${review.viewerId}_${review.movieId}`;
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(review);
    });

    groups.forEach(group => {
        if (group.length > 1) {
            group.forEach(r => duplicateIds.add(r.id));
        }
    });

    return { groups, duplicateIds };
}

function displayReviews() {
    const container = document.getElementById("reviewsContainer");
    const movieFilterVal = document.getElementById("reviewMovieFilter").value;
    const viewerFilterVal = document.getElementById("reviewViewerFilter").value;
    const ratingFilterVal = document.getElementById("reviewRatingFilter").value;
    const sortVal = document.getElementById("reviewSortFilter").value;

    const { duplicateIds } = findDuplicateReviews();

    // Update Duplicate Alert Banner (Requirement #5)
    const duplicateBanner = document.getElementById("reviewDuplicateBanner");
    const duplicateText = document.getElementById("reviewDuplicateCountText");
    const toggleBtn = document.getElementById("toggleDuplicateFilterBtn");

    if (duplicateIds.size > 0) {
        duplicateBanner.classList.remove("hidden");
        duplicateText.textContent = `Detected ${duplicateIds.size} duplicate review records violating the one-review rule. Flagged items are highlighted below.`;
        if (toggleBtn) {
            toggleBtn.textContent = showOnlyDuplicatesFilter ? "Show All Reviews" : `Show Only Flagged Duplicates (${duplicateIds.size})`;
        }
    } else {
        duplicateBanner.classList.add("hidden");
        showOnlyDuplicatesFilter = false;
    }

    // Filter reviews
    let filtered = reviews.filter(rev => {
        if (movieFilterVal && rev.movieId !== movieFilterVal) return false;
        if (viewerFilterVal && rev.viewerId !== viewerFilterVal) return false;
        if (ratingFilterVal && Number(rev.rating) !== Number(ratingFilterVal)) return false;
        if (showOnlyDuplicatesFilter && !duplicateIds.has(rev.id)) return false;
        return true;
    });

    // Sort reviews
    filtered.sort((a, b) => {
        if (sortVal === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortVal === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortVal === "rating-high") return b.rating - a.rating;
        if (sortVal === "rating-low") return a.rating - b.rating;
        return 0;
    });

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⭐</div>
                <h3>No Reviews Found</h3>
                <p>${showOnlyDuplicatesFilter ? 'No duplicate reviews match the current filters.' : 'No reviews match the selected filters. Be the first to share your thoughts!'}</p>
                <button class="btn btn-primary" onclick="openAddReviewModal()">+ Write a Review</button>
            </div>
        `;
        return;
    }

    filtered.forEach(rev => {
        const movie = movies.find(m => m.id === rev.movieId);
        const viewer = viewers.find(v => v.id === rev.viewerId);
        const isDuplicate = duplicateIds.has(rev.id);
        const initials = viewer ? getInitials(viewer.name) : "??";

        container.innerHTML += `
            <div class="review-item ${isDuplicate ? 'flagged-duplicate' : ''}">
                ${isDuplicate ? `
                    <div class="duplicate-flag-pill">
                        ⚠️ DUPLICATE RECORD (Requirement #5: Viewer already reviewed this movie)
                    </div>
                ` : ''}

                <div class="review-header">
                    <div class="review-user-info">
                        <div class="review-avatar">${initials}</div>
                        <div class="review-names">
                            <h4>${safeHtml(viewer?.name || "Unknown Viewer")}</h4>
                            <span class="review-movie-link" onclick="openMovieDetailsModal('${rev.movieId}')">
                                on 🎬 ${safeHtml(movie?.title || "Deleted Movie")} (${movie?.year || ""})
                            </span>
                        </div>
                    </div>

                    <div class="review-rating-block">
                        <div class="stars-display">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
                        <span class="review-date">${safeHtml(rev.date || "")}</span>
                    </div>
                </div>

                <div class="review-body">${safeHtml(rev.text)}</div>

                <div class="review-footer">
                    <button class="btn btn-outline btn-sm" onclick="openEditReviewModal('${rev.id}')">
                        ✏️ Edit Review
                    </button>
                    <button class="btn btn-outline btn-sm text-danger" onclick="confirmDeleteReview('${rev.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    });
}

function toggleDuplicatesFilter() {
    showOnlyDuplicatesFilter = !showOnlyDuplicatesFilter;
    displayReviews();
}

/**
 * Cleans all duplicate reviews by keeping the latest entry for each (viewer, movie) pair
 */
function cleanAllDuplicates() {
    const { duplicateIds } = findDuplicateReviews();
    if (duplicateIds.size === 0) {
        showToast("No duplicate records found to clean.", "info");
        return;
    }

    openConfirmModal(
        "Resolve All Duplicates?",
        `Found ${duplicateIds.size} duplicate records. The system will merge them and preserve the latest review for each viewer-movie pair.`,
        () => {
            const seen = new Set();
            const cleanList = [];

            // Iterate newest to oldest
            for (const rev of reviews) {
                const key = `${rev.viewerId}_${rev.movieId}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    cleanList.push(rev);
                }
            }

            reviews = cleanList;
            showOnlyDuplicatesFilter = false;
            refreshAllViews();
            showToast("All duplicate records resolved and merged successfully!", "success");
        }
    );
}

/**
 * Requirement 5 Testing Helper:
 * Injects a test duplicate to allow professors/evaluators to immediately verify duplicate flagging!
 */
function injectTestDuplicate() {
    if (movies.length === 0 || viewers.length === 0) {
        seedInitialSampleData();
    }

    const testMovie = movies[0];
    const testViewer = viewers[0];

    // Create an intentional duplicate review
    const duplicateReview = {
        id: generateId("dup"),
        movieId: testMovie.id,
        viewerId: testViewer.id,
        rating: 3,
        text: "TEST RECORD: This is an intentional duplicate review to test Requirement #5 detection and flagging.",
        date: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
    };

    reviews.unshift(duplicateReview);
    saveAllData();
    refreshAllViews();
    showSection("reviews");

    showToast(`Test duplicate injected for "${testMovie.title}" by ${testViewer.name}!`, "warning");
}

function confirmDeleteReview(id) {
    openConfirmModal(
        "Delete Review?",
        "Are you sure you want to permanently delete this review?",
        () => {
            reviews = reviews.filter(r => r.id !== id);
            refreshAllViews();
            showToast("Review deleted.", "info");
        }
    );
}

function filterReviewsByViewer(viewerId) {
    showSection("reviews");
    const viewerFilter = document.getElementById("reviewViewerFilter");
    if (viewerFilter) {
        viewerFilter.value = viewerId;
        displayReviews();
    }
}

// ============================================================
// INTERACTIVE STAR RATING PICKER (Requirement #3)
// ============================================================

function selectRating(val) {
    const rating = Math.max(1, Math.min(5, Number(val)));
    document.getElementById("reviewFormRating").value = rating;

    document.querySelectorAll("#starPicker .star-item").forEach(star => {
        const starVal = Number(star.dataset.value);
        star.classList.toggle("active", starVal <= rating);
    });

    const desc = document.getElementById("ratingDescriptor");
    if (desc) {
        desc.textContent = RATING_DESCRIPTORS[rating] || `${rating}/5 Stars`;
    }
}

function hoverStar(val) {
    document.querySelectorAll("#starPicker .star-item").forEach(star => {
        const starVal = Number(star.dataset.value);
        star.classList.toggle("hovered", starVal <= val);
    });
    const desc = document.getElementById("ratingDescriptor");
    if (desc) {
        desc.textContent = RATING_DESCRIPTORS[val] || `${val}/5 Stars`;
    }
}

function resetStarHover() {
    document.querySelectorAll("#starPicker .star-item").forEach(star => {
        star.classList.remove("hovered");
    });
    const curVal = Number(document.getElementById("reviewFormRating").value) || 5;
    const desc = document.getElementById("ratingDescriptor");
    if (desc) {
        desc.textContent = RATING_DESCRIPTORS[curVal] || `${curVal}/5 Stars`;
    }
}

// ============================================================
// MOVIE DETAILS MODAL & RATING BREAKDOWN (Optional Features)
// ============================================================

function openMovieDetailsModal(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const stats = getMovieReviewStats(movie.id);
    const movieReviews = reviews.filter(r => r.movieId === movie.id);
    const genreEmoji = getGenreEmoji(movie.genre);

    document.getElementById("detailsMovieTitle").textContent = `${movie.title} (${movie.year})`;

    const container = document.getElementById("movieDetailsContent");
    container.innerHTML = `
        <div class="movie-details-grid">
            <div class="details-poster">
                ${movie.poster ? `<img src="${safeHtml(movie.poster)}" alt="${safeHtml(movie.title)}" onerror="this.onerror=null;this.parentElement.innerHTML='${genreEmoji}'">` : `<span>${genreEmoji}</span>`}
            </div>
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span class="genre-badge">${safeHtml(movie.genre)}</span>
                    <span class="dash-rating-pill" style="font-size:14px;">★ ${stats.average.toFixed(1)} / 5.0</span>
                </div>
                <p style="color:var(--text-secondary); margin-bottom:16px; font-size:14px; line-height:1.6;">${safeHtml(movie.description)}</p>

                <h4 style="font-size:13px; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px;">Rating Distribution (${stats.count} reviews)</h4>
                ${[5, 4, 3, 2, 1].map(star => {
                    const count = stats.breakdown[star] || 0;
                    const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
                    return `
                        <div class="rating-breakdown-bar">
                            <span style="width:30px;">${star} ★</span>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: ${pct}%"></div>
                            </div>
                            <span style="width:40px; text-align:right; color:var(--text-muted)">${count}</span>
                        </div>
                    `;
                }).join("")}

                <div style="margin-top:16px;">
                    <button class="btn btn-primary btn-sm" onclick="closeModal('movieDetailsModal'); openAddReviewModalForMovie('${movie.id}')">
                        + Write Review for this Movie
                    </button>
                </div>
            </div>
        </div>

        <hr style="border:none; border-top:1px solid var(--border-color); margin:20px 0;">

        <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">Reviews for this movie (${movieReviews.length})</h3>

        <div class="reviews-list" style="max-height: 280px; overflow-y: auto;">
            ${movieReviews.length === 0 ? '<p style="color:var(--text-muted); font-size:13px;">No reviews yet for this movie.</p>' :
                movieReviews.map(rev => {
                    const viewer = viewers.find(v => v.id === rev.viewerId);
                    return `
                        <div class="review-item" style="padding:12px;">
                            <div class="review-header" style="margin-bottom:6px;">
                                <strong>${safeHtml(viewer?.name || "Viewer")}</strong>
                                <span style="color:var(--gold-star)">${"★".repeat(rev.rating)}</span>
                            </div>
                            <p style="font-size:13px; color:var(--text-secondary);">${safeHtml(rev.text)}</p>
                        </div>
                    `;
                }).join("")
            }
        </div>
    `;

    openModal("movieDetailsModal");
}

// ============================================================
// UTILITIES & HELPERS
// ============================================================

function getMovieReviewStats(movieId) {
    const movieReviews = reviews.filter(r => r.movieId === movieId);
    const count = movieReviews.length;

    if (count === 0) {
        return { average: 0, count: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    const sum = movieReviews.reduce((acc, r) => acc + Number(r.rating), 0);
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    movieReviews.forEach(r => {
        if (breakdown[r.rating] !== undefined) {
            breakdown[r.rating]++;
        }
    });

    return {
        average: sum / count,
        count,
        breakdown
    };
}

function renderStarRating(stars) {
    const full = Math.max(0, Math.min(5, stars));
    return "★".repeat(full) + "☆".repeat(5 - full);
}

function getInitials(name) {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGenreEmoji(genre) {
    const map = {
        "Action": "💥",
        "Adventure": "🧗",
        "Animation": "🎨",
        "Comedy": "😂",
        "Crime": "🕵️",
        "Drama": "🎭",
        "Fantasy": "🧙",
        "Horror": "👻",
        "Romance": "💖",
        "Sci-Fi": "🚀",
        "Thriller": "🔪"
    };
    return map[genre] || "🎬";
}

function clearSearch(inputId) {
    const el = document.getElementById(inputId);
    if (el) {
        el.value = "";
        if (inputId === "movieSearchInput") displayMovies();
        if (inputId === "viewerSearchInput") displayViewers();
    }
}

// Modal open/close manager
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    }
}

function closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
    document.body.style.overflow = "";
}

function openConfirmModal(title, message, onConfirm) {
    document.getElementById("confirmModalTitle").textContent = title;
    document.getElementById("confirmModalMessage").textContent = message;
    confirmCallback = onConfirm;

    const actionBtn = document.getElementById("confirmModalActionBtn");
    actionBtn.onclick = () => {
        if (typeof confirmCallback === "function") {
            confirmCallback();
        }
        closeModal("confirmModal");
    };

    openModal("confirmModal");
}

// Toast notification system
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
        success: "✓",
        warning: "⚠️",
        danger: "✕",
        info: "ℹ️"
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || "ℹ️"}</span>
        <span class="toast-msg">${safeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}
