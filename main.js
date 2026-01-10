
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));

            // Activate the clicked tab and its content
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) {
                target.classList.add('active');
            }
            
            // Special handling for comments tab
            if (tab.dataset.tab === 'comments') {
                loadDisqus();
            }
        });
    });

    // Initial setup for lotto if it's the default active tab
    if (document.getElementById('lotto').classList.contains('active')){
        if(typeof generateLottoNumbers === "function") generateLottoNumbers();
    } 
    // Initial setup for Animal Classifier if it's the default active tab
    else if(document.getElementById('animal-test').classList.contains('active')){
        // The animal-classifier.js handles its own initialization based on user clicks
    }
});

let disqus_loaded = false;
function loadDisqus() {
    if (disqus_loaded) {
        return;
    }
    disqus_loaded = true;

    var disqus_config = function () {
        this.page.url = window.location.href;  
        this.page.identifier = "all-in-one-fun-page-1"; 
    };
    
    (function() { 
        var d = document, s = d.createElement('script');
        s.src = 'https://product-builder-1.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
}
