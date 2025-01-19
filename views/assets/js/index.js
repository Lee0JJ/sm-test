window.onload = function() {
    // Fetch the navbar.html file
    fetch('/components/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load navbar.html');
            }
            return response.text(); // Get the content as text
        })
        .then(data => {
            // Inject the HTML content into the navbar-container element
            document.getElementById('navbar-container').innerHTML = data;
            $(".nav-link").on("click", function(){
                $(".nav").find(".active").removeClass("active");
                $(this).addClass("active");
                console.log("a");
            });
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
    // Fetch the footer.html file
    fetch('/components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load footer.html');
            }
            return response.text(); // Get the content as text
        })
        .then(data => {
            // Inject the HTML content into the navbar-container element
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
};