// Theme JavaScript for Ebook Store
// Handles mobile menu, search, cart, and other interactive features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme functionality
  initMobileMenu();
  initSearch();
  initCart();
  initProductFilters();
  initNewsletterSignup();
  initLazyLoading();
});

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('[onclick*="toggleMobileMenu"]');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      mobileMenu.classList.toggle('hidden');

      // Close search if open
      const mobileSearch = document.getElementById('mobile-search');
      if (mobileSearch && !mobileSearch.classList.contains('hidden')) {
        mobileSearch.classList.add('hidden');
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
}

// Search Functionality
function initSearch() {
  const searchToggle = document.querySelector('[onclick*="toggleMobileSearch"]');
  const mobileSearch = document.getElementById('mobile-search');

  if (searchToggle && mobileSearch) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      mobileSearch.classList.toggle('hidden');

      // Close menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  // Search form enhancement
  const searchForms = document.querySelectorAll('form[action="/search"]');
  searchForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const query = form.querySelector('input[name="q"]').value.trim();
      if (!query) {
        e.preventDefault();
        showNotification('Please enter a search term', 'error');
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner"></div>';
      }
    });
  });
}

// Cart Functionality
function initCart() {
  // Update cart count
  updateCartCount();

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll('[data-action="add-to-cart"]');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      const variantId = this.dataset.variantId || productId;

      addToCart(variantId, 1);
    });
  });

  // Cart drawer toggle
  const cartToggle = document.querySelector('[href="/cart"]');
  if (cartToggle) {
    cartToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleCartDrawer();
    });
  }
}

async function addToCart(variantId, quantity = 1) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    });

    const data = await response.json();

    if (response.ok) {
      updateCartCount();
      showNotification('Item added to cart!', 'success');

      // Update cart drawer if visible
      updateCartDrawer(data);
    } else {
      showNotification('Failed to add item to cart', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('Error adding item to cart', 'error');
  }
}

function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCountElements = document.querySelectorAll('[data-cart-count]');
      cartCountElements.forEach(element => {
        element.textContent = cart.item_count;
        element.style.display = cart.item_count > 0 ? 'inline' : 'none';
      });
    })
    .catch(error => console.error('Error updating cart count:', error));
}

function toggleCartDrawer() {
  // Implement cart drawer toggle if using a cart drawer
  console.log('Cart drawer toggle clicked');
}

// Product Filters
function initProductFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const sortSelect = document.querySelector('[name="sort_by"]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;
      const value = this.dataset.value;

      applyFilter(filter, value);
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      applySort(sortValue);
    });
  }
}

function applyFilter(filter, value) {
  const url = new URL(window.location);
  url.searchParams.set(filter, value);
  window.location.href = url.toString();
}

function applySort(sortValue) {
  const url = new URL(window.location);
  url.searchParams.set('sort_by', sortValue);
  window.location.href = url.toString();
}

// Newsletter Signup
function initNewsletterSignup() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[name="contact[email]"]');
      const email = emailInput.value.trim();

      if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
      }

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';

      // Submit form
      this.submit();
    });
  }
}

// Lazy Loading for Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

// Notification System
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationClasses(type)}`;
  notification.innerHTML = `
    <div class="flex items-center">
      <div class="flex-1">${message}</div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current opacity-75 hover:opacity-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationClasses(type) {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-blue-500 text-white';
  }
}

// Product Quick View
function initQuickView() {
  const quickViewButtons = document.querySelectorAll('[data-quick-view]');
  quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      openQuickView(productId);
    });
  });
}

function openQuickView(productId) {
  // Implement quick view modal
  console.log('Opening quick view for product:', productId);
}

// Wishlist Functionality
function initWishlist() {
  const wishlistButtons = document.querySelectorAll('[data-wishlist]');
  wishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      toggleWishlist(productId, this);
    });
  });
}

function toggleWishlist(productId, button) {
  // Implement wishlist toggle
  const isInWishlist = button.classList.contains('active');

  if (isInWishlist) {
    removeFromWishlist(productId);
    button.classList.remove('active');
    showNotification('Removed from wishlist', 'info');
  } else {
    addToWishlist(productId);
    button.classList.add('active');
    showNotification('Added to wishlist', 'success');
  }
}

function addToWishlist(productId) {
  // Implement add to wishlist
  console.log('Adding to wishlist:', productId);
}

function removeFromWishlist(productId) {
  // Implement remove from wishlist
  console.log('Removing from wishlist:', productId);
}

// Product Image Gallery
function initProductGallery() {
  const galleries = document.querySelectorAll('.product-gallery');
  galleries.forEach(gallery => {
    const thumbnails = gallery.querySelectorAll('.thumbnail');
    const mainImage = gallery.querySelector('.main-image img');

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const imageSrc = this.dataset.image;
        if (mainImage && imageSrc) {
          mainImage.src = imageSrc;
        }

        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
  });
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      showFieldError(field, 'This field is required');
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });

  // Email validation
  const emailFields = form.querySelectorAll('input[type="email"]');
  emailFields.forEach(field => {
    if (field.value && !isValidEmail(field.value)) {
      showFieldError(field, 'Please enter a valid email address');
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(field, message) {
  clearFieldError(field);

  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = message;

  field.parentElement.appendChild(errorElement);
  field.classList.add('border-red-500');
}

function clearFieldError(field) {
  const existingError = field.parentElement.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  field.classList.remove('border-red-500');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Accessibility Improvements
function initAccessibility() {
  // Add focus trap for modals
  // Improve keyboard navigation
  // Add ARIA labels where needed

  // Skip to content link
  const skipLink = document.querySelector('a[href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.focus();
        }
      }
    });
  }
}

// Performance Monitoring
function initPerformanceMonitoring() {
  // Monitor Core Web Vitals
  if ('web-vitals' in window) {
    import('https://unpkg.com/web-vitals@3.1.1/dist/web-vitals.es5.min.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}

// Export functions for global use
window.EbookStore = {
  addToCart,
  showNotification,
  toggleMobileMenu: () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
  },
  toggleMobileSearch: () => {
    const search = document.getElementById('mobile-search');
    if (search) search.classList.toggle('hidden');
  }
};