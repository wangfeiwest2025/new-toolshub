// Main JavaScript file for New ToolsHub

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      })
      .catch(function(error) {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Utility functions for tools
const ToolsHub = {
  // Copy text to clipboard
  copyToClipboard: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show temporary notification
    const notification = document.createElement('div');
    notification.textContent = 'Copied to clipboard!';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 15px';
    notification.style.background = '#28a745';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  },

  // Validate URL
  isValidUrl: function(urlString) {
    try {
      return Boolean(new URL(urlString));
    } catch(e) {
      return false;
    }
  },

  // Format JSON
  formatJson: function(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch(e) {
      throw new Error('Invalid JSON: ' + e.message);
    }
  },

  // Show loading indicator
  showLoading: function(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    return function() {
      button.innerHTML = originalText;
      button.disabled = false;
    };
  },

  // Show toast notification
  showToast: function(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 12px 20px; background: #333; color: white; border-radius: 6px; z-index: 1000; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
  }
};

// DOM ready function
function domReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Initialize common tool behaviors
domReady(function() {
  // Add theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle light';
  themeToggle.id = 'themeToggle';
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.title = 'Toggle Dark Mode';
  document.body.appendChild(themeToggle);
  
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
    themeToggle.className = 'theme-toggle dark';
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Theme toggle click handler
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (isDark) {
      this.className = 'theme-toggle dark';
      this.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      this.className = 'theme-toggle light';
      this.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Add favorites functionality to tool cards
  document.querySelectorAll('.tool-card').forEach(card => {
    const toolName = card.getAttribute('data-tool');
    if (toolName) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favorites.includes(toolName)) {
        card.classList.add('favorite');
      }
      
      // Add favorite button
      const favoriteBtn = document.createElement('button');
      favoriteBtn.className = 'favorite-btn';
      favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
      favoriteBtn.title = 'Add to Favorites';
      card.querySelector('.tool-actions').prepend(favoriteBtn);
      
      favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(toolName);
        
        if (index > -1) {
          favorites.splice(index, 1);
          card.classList.remove('favorite');
          this.innerHTML = '<i class="far fa-star"></i>';
          this.title = 'Add to Favorites';
          ToolsHub.showToast('Removed from favorites');
        } else {
          favorites.push(toolName);
          card.classList.add('favorite');
          this.innerHTML = '<i class="fas fa-star"></i>';
          this.title = 'Remove from Favorites';
          ToolsHub.showToast('Added to favorites');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
      });
    }
  });
  
  // Add event listeners to all copy buttons
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-copy');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        ToolsHub.copyToClipboard(targetElement.value || targetElement.textContent);
      }
    });
  });
  
  // Add tooltips to elements with title attributes
  document.querySelectorAll('[title]').forEach(element => {
    element.addEventListener('mouseenter', function() {
      // Simple tooltip implementation
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.title;
      tooltip.style.position = 'absolute';
      tooltip.style.background = '#333';
      tooltip.style.color = 'white';
      tooltip.style.padding = '5px 10px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '14px';
      tooltip.style.zIndex = '1000';
      tooltip.style.pointerEvents = 'none';
      
      const rect = this.getBoundingClientRect();
      tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
      tooltip.style.left = (rect.left + window.scrollX) + 'px';
      
      document.body.appendChild(tooltip);
      
      this.tooltipEl = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
      if (this.tooltipEl) {
        document.body.removeChild(this.tooltipEl);
        this.tooltipEl = null;
      }
    });
  });
});