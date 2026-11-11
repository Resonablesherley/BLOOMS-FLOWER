// --- 1. Dynamic Shopping Cart Badge (Navigation) ---
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('bloomsCart')) || [];
    const totalCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (!cartLink) return;

    let badge = document.getElementById('cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'cart-badge';
        badge.style.cssText = 'background: #d81b60; color: white; border-radius: 50%; padding: 2px 7px; font-size: 12px; margin-left: 5px; font-weight: bold;';
        cartLink.appendChild(badge);
    }
    
    badge.innerText = totalCount;
}

// --- 2. Track Customer Account State in Navbar ---
function updateNavUserStatus() {
    const user = JSON.parse(localStorage.getItem('bloomsUser'));
    const loginNav = document.querySelector('nav a[href="login.html"]');
    if (loginNav) {
        if (user) {
            loginNav.innerHTML = `<i class="fa-solid fa-user"></i> ${user.name.split(' ')[0]}`;
        } else {
            loginNav.innerHTML = `<i class="fa-solid fa-user"></i> Profile`;
        }
    }
}

// --- 3. Interactive "Back to Top" Scroll Button ---
function setupScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: #d81b60;
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- 4. Flying Add-To-Cart Animation & Centered Toast Notification ---
function addToCart(name, price, image, btnElement) {
    let cart = JSON.parse(localStorage.getItem('bloomsCart')) || [];
    const existingIndex = cart.findIndex(item => item.name === name);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    
    localStorage.setItem('bloomsCart', JSON.stringify(cart));
    updateCartBadge();
    
    const cartNav = document.querySelector('nav a[href="cart.html"]');
    if (btnElement && cartNav) {
        const card = btnElement.closest('.product-card');
        const imgToFly = card ? card.querySelector('img') : null;
        
        if (imgToFly) {
            const imgRect = imgToFly.getBoundingClientRect();
            const cartRect = cartNav.getBoundingClientRect();
            
            const clone = imgToFly.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = imgRect.left + 'px';
            clone.style.top = imgRect.top + 'px';
            clone.style.width = imgRect.width + 'px';
            clone.style.height = imgRect.height + 'px';
            clone.style.opacity = '0.9';
            clone.style.borderRadius = '50%';
            clone.style.zIndex = '9999';
            clone.style.transition = 'all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
            
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.left = (cartRect.left + 15) + 'px';
                clone.style.top = (cartRect.top + 10) + 'px';
                clone.style.width = '30px';
                clone.style.height = '30px';
                clone.style.opacity = '0.2';
                clone.style.transform = 'scale(0.3) rotate(360deg)';
            }, 20);
            
            setTimeout(() => {
                clone.remove();
            }, 850);
        }
    }
    
    showCenterToast(`<i class="fa-solid fa-circle-check" style="color: #4caf50; margin-right: 8px;"></i> <strong>${name}</strong> added to your cart!`);
}

function showCenterToast(message) {
    let toast = document.getElementById('center-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'center-toast';
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background-color: rgba(255, 255, 255, 0.96);
            color: #333;
            border: 2px solid #d81b60;
            padding: 16px 28px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.25);
            font-size: 16px;
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease-in-out;
            text-align: center;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, -50%) scale(1)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }, 2000);
}

// --- 5. Customer Reviews System ---
const initialReviews = [
    { name: "Maria Clara", rating: 5, date: "Nov 5, 2026", text: "The Velvet Rose bouquet lasted forever! Perfect centerpiece." },
    { name: "Juan Dela Cruz", rating: 5, date: "Nov 8, 2026", text: "Fast shipping and handcrafted quality is impressive. Highly recommended!" },
    { name: "Sarah G.", rating: 5, date: "Nov 10, 2026", text: "Beautiful fuzzy wire tulips! The colors are vibrant and lovely." }
];

function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem('bloomsReviews'));
    if (!reviews) {
        reviews = initialReviews;
        localStorage.setItem('bloomsReviews', JSON.stringify(reviews));
    }
    renderReviews(reviews);
}

function renderReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-list');
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #880e4f;"><i class="fa-solid fa-circle-user"></i> ${r.name}</strong>
                <span style="color: #ffb300;">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
                </span>
            </div>
            <p style="color: #555; font-size: 14px; margin-bottom: 6px;">"${r.text}"</p>
            <small style="color: #999; display: block; text-align: right;">${r.date}</small>
        </div>
    `).join('');
}

function submitCustomerReview(e) {
    e.preventDefault();
    const nameInput = document.getElementById('rev-name');
    const ratingInput = document.getElementById('rev-rating');
    const textInput = document.getElementById('rev-text');

    const currentUser = JSON.parse(localStorage.getItem('bloomsUser'));
    const authorName = currentUser ? currentUser.name : (nameInput ? nameInput.value : 'Anonymous');
    const rating = parseInt(ratingInput.value);
    const text = textInput.value;

    let reviews = JSON.parse(localStorage.getItem('bloomsReviews')) || [];
    reviews.unshift({
        name: authorName,
        rating: rating,
        date: new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: text
    });

    localStorage.setItem('bloomsReviews', JSON.stringify(reviews));
    renderReviews(reviews);
    
    if (textInput) textInput.value = '';
    showCenterToast('<i class="fa-solid fa-star" style="color: #ffb300; margin-right: 8px;"></i> Thank you for your 5-star review!');
}

// --- 6. Initialize Shared Features ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateNavUserStatus();
    setupScrollToTop();
    loadReviews();
});
