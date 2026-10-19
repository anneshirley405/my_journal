// header_nav.js

// === 1. EDIT YOUR ARTICLES & CATEGORIES HERE ===
const siteTitle = "My Website Title";
const bannerImage = ""; // Optional: put "banner.jpg" if you want a top image like travel_blog

const menuData = [
    {
        title: "作者的话 (About)",
        url: "index.html"
    },
    {
        title: "Blogs",
        // If an item has "subItems", it becomes a dropdown on Desktop & expandable list on Mobile
        subItems: [
            { title: "My First Blog", url: "blog1.html" },
            { title: "Second Blog Post", url: "blog2.html" }
        ]
    },
    {
        title: "Theme: Communication",
        subItems: [
            { title: "Daryl Davis", url: "daryl_davis.html" },
            { title: "The Radical Candor", url: "radical_candor.html" }
        ]
    },
    {
        title: "Useful Links",
        url: "links.html"
    }
];

// === 2. AUTOMATICALLY GENERATE DESKTOP & MOBILE MENU ===
function renderHeader() {
    const headerEl = document.getElementById("site-header");
    if (!headerEl) return;

    // Build menu items HTML (works for both desktop & mobile)
    const buildMenuList = (isMobile) => {
        return menuData.map((item, idx) => {
            if (item.subItems && item.subItems.length > 0) {
                const subLinks = item.subItems
                    .map(sub => `<li><a href="${sub.url}">${sub.title}</a></li>`)
                    .join("");
                
                if (isMobile) {
                    return `
                        <li class="mobile-dropdown">
                            <div class="mobile-dropdown-toggle" onclick="toggleMobileSubmenu(${idx})">
                                ${item.title} <span class="arrow">▾</span>
                            </div>
                            <ul id="mobile-sub-${idx}" class="mobile-submenu">${subLinks}</ul>
                        </li>`;
                } else {
                    return `
                        <li class="dropdown">
                            <a href="javascript:void(0)" class="dropbtn">${item.title} ▾</a>
                            <ul class="dropdown-content">${subLinks}</ul>
                        </li>`;
                }
            } else {
                return `<li><a href="${item.url}">${item.title}</a></li>`;
            }
        }).join("");
    };

    headerEl.innerHTML = `
        <div class="site-title-bar">
            <h1 class="site-title"><a href="index.html">${siteTitle}</a></h1>
        </div>

        <!-- DESKTOP NAVIGATION -->
        <div class="desktop-nav-container">
            <div class="container-search">
                <input type="text" id="search-box" placeholder="输入关键词..." />
                <button id="search-button">搜索</button>
                <div id="search-results"></div>
            </div>
            <nav class="desktop-nav">
                <ul class="nav-links">
                    ${buildMenuList(false)}
                </ul>
            </nav>
        </div>

        ${bannerImage ? `<div class="banner-container"><img src="${bannerImage}" alt="Menu Image" class="banner-img"></div>` : ''}

        <!-- MOBILE NAVIGATION (目录 ☰) -->
        <div class="mobile-nav-container">
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
                目录 <span class="hamburger-icon">☰</span>
            </button>
            <div id="mobile-menu-panel" class="mobile-menu-panel">
                <ul class="mobile-nav-links">
                    ${buildMenuList(true)}
                </ul>
            </div>
        </div>
    `;
}

// Toggle the main mobile "目录 ☰" menu
function toggleMobileMenu() {
    const panel = document.getElementById("mobile-menu-panel");
    panel.classList.toggle("open");
}

// Toggle category sub-menus on mobile
function toggleMobileSubmenu(idx) {
    const sub = document.getElementById(`mobile-sub-${idx}`);
    sub.classList.toggle("open");
}

// Run immediately before other scripts so search_script.js can find #search-box
renderHeader();
