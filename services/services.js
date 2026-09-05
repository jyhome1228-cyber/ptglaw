(function () {
  var processSection = document.getElementById('pentaProcessSection');
  if (!processSection) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        processSection.classList.add('is-visible');
        observer.unobserve(processSection);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(processSection);
})();
