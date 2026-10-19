// nav_index.js

// === 1. EDIT YOUR ARTICLES & CATEGORIES HERE ===
const siteTitle = ""; // Leave as "" if you don't want a title above the tabs

const menuData = [
    {
        title: "作者的话 (About)",
        url: "index.html"
    },
    {
        title: "Blogs",
        // Items with "subItems" will open a clean dropdown menu when hovered/clicked
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

// === 2. INJECT TAB MENU & STYLES AUTOMATICALLY ===
function renderHeader() {
    // Support either <header id="site-header"> or <div id="site-index-container">
    const headerEl = document.getElementById("site-header") || document.getElementById("site-index-container");
    if (!headerEl) return;

    // Detect current page filename to highlight the active tab automatically
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const tabsHtml = menuData.map((item) => {
        // Case A: Category tab with dropdown articles
        if (item.subItems && item.subItems.length > 0) {
            const isParentActive = item.subItems.some(sub => sub.url === currentPage);
            const subLinks = item.subItems.map(sub => {
                const isSubActive = (sub.url === currentPage) ? 'class="active-sub"' : '';
                return `<li><a href="${sub.url}" ${isSubActive}>${sub.title}</a></li>`;
            }).join("");

            return `
                <li class="has-dropdown ${isParentActive ? 'active' : ''}">
                    <a href="javascript:void(0)" onclick="toggleTabDropdown(event, this)">
                        ${item.title} <span class="tab-arrow">▾</span>
                    </a>
                    <ul class="tab-dropdown">${subLinks}</ul>
                </li>`;
        }
        // Case B: Direct single link tab
        else {
            const isActive = (item.url === currentPage) ? 'class="active"' : '';
            return `<li ${isActive}><a href="${item.url}">${item.title}</a></li>`;
        }
    }).join("");

    headerEl.innerHTML = `
        <style>
            .tab-nav-wrapper {
                font-family: Arial, sans-serif;
                margin-bottom: 20px;
            }
            .site-title-bar {
                text-align: center;
                padding: 12px 0 8px 0;
            }
            .site-title-bar a {
                text-decoration: none;
                color: #1e293b;
                font-size: 1.5rem;
                font-weight: bold;
            }
            /* Search bar row */
            .container-search {
                text-align: center;
                padding: 8px 15px;
                background-color: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }
            /* The Menu Bar - Centered (from your tabs.html) */
            .botmenu-bar {
                background-color: #f1f5f9;
                border-top: 1px solid #e2e8f0;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                padding: 0;
                margin: 0;
                list-style: none;
            }
            .botmenu-bar > li {
                margin: 0;
                position: relative;
            }
            .botmenu-bar > li > a {
                display: inline-block;
                padding: 10px 16px;
                color: #334155;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                border-right: 1px solid #e2e8f0;
                transition: background-color 0.2s, color 0.2s;
            }
            /* Matching left border on first tab */
            .botmenu-bar > li:first-child > a {
                border-left: 1px solid #e2e8f0;
            }
            /* Hover & Active States */
            .botmenu-bar > li > a:hover {
                background-color: #e2e8f0;
                color: #0284c7;
            }
            .botmenu-bar > li.active > a {
                background-color: #ffffff;
                color: #0284c7;
                border-bottom: 2px solid #0284c7;
                margin-bottom: -1px;
            }
            .tab-arrow {
                font-size: 11px;
                margin-left: 3px;
            }
            /* Dropdown menu for Blogs / Themes */
            .tab-dropdown {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 190px;
                background-color: #ffffff;
                border: 1px solid #d1d5db;
                border-radius: 0 0 6px 6px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                list-style: none;
                padding: 4px 0;
                margin: 0;
                z-index: 1000;
                text-align: left;
            }
            .botmenu-bar > li.has-dropdown:hover .tab-dropdown,
            .botmenu-bar > li.has-dropdown.open .tab-dropdown {
                display: block;
            }
            .tab-dropdown li a {
                display: block;
                padding: 9px 16px;
                color: #334155;
                text-decoration: none;
                font-size: 13.5px;
                border-bottom: 1px solid #f1f5f9;
            }
            .tab-dropdown li:last-child a {
                border-bottom: none;
            }
            .tab-dropdown li a:hover,
            .tab-dropdown li a.active-sub {
                background-color: #f1f5f9;
                color: #0284c7;
                font-weight: 500;
            }
        </style>

        <div class="tab-nav-wrapper">
            ${siteTitle ? `<div class="site-title-bar"><a href="index.html">${siteTitle}</a></div>` : ''}
            
            <div class="container-search">
                <input type="text" id="search-box" placeholder="输入关键词..." />
                <button id="search-button">搜索</button>
                <div id="search-results"></div>
            </div>

            <ul class="botmenu-bar" id="menuTabs">
                ${tabsHtml}
            </ul>
        </div>
    `;
}

// Allows tapping a category tab on mobile/touchscreens to open its dropdown
function toggleTabDropdown(event, linkEl) {
    event.stopPropagation();
    const parentLi = linkEl.parentElement;
    const isAlreadyOpen = parentLi.classList.contains("open");
    
    document.querySelectorAll(".botmenu-bar > li.has-dropdown").forEach(li => {
        li.classList.remove("open");
    });

    if (!isAlreadyOpen) {
        parentLi.classList.add("open");
    }
}

// Close dropdown if clicking anywhere outside on the page
document.addEventListener("click", () => {
    document.querySelectorAll(".botmenu-bar > li.has-dropdown").forEach(li => {
        li.classList.remove("open");
    });
});

// Run immediately so #search-box is ready before search_script.js loads
renderHeader();
