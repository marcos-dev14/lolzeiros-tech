const lazyLoad = (picture) => {
    const img = picture.querySelector('img');
    const sources = picture.querySelectorAll('source');

    sources.forEach((source) => {
        source.srcset = source.dataset.srcset;
        source.removeAttribute('data-srcset');
    });
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    img.classList.add('unblured');
}

document.querySelectorAll('.lazy-picture').forEach((picture) => {
    new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lazyLoad(entry.target);
                self.unobserve(entry.target);
            }
        });
    }).observe(picture)
});
