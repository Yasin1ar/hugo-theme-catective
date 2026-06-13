document.addEventListener('DOMContentLoaded', function() {
    const ratingContainer = document.getElementById('star-rating');
    const modal = document.getElementById('prankModal');
    const closeBtn = document.getElementById('closeModalBtn');

    if (ratingContainer) {
        ratingContainer.addEventListener('click', function(e) {
            const button = e.target.closest('button[data-rating]');
            if (!button) return;
            const rating = button.dataset.rating;
            if (modal) modal.classList.remove('hidden');
            
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});
