document.getElementById("productForm").addEventListener("submit", function(event) {
    const productName = document.getElementById("productName");
  
    if (!productName.value.trim()) {
      productName.classList.add("error-border");
      event.preventDefault();
    } else {
      productName.classList.remove("error-border");
    }
  });
  