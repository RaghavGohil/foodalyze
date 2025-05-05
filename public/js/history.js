const products = [
    { name: "Maggi", date: "April 29, 2025 | 8:43 PM" },
    { name: "Cadbury Dairy milk", date: "April 29, 2025 | 8:43 PM" },
    { name: "Coca Cola", date: "April 29, 2025 | 8:43 PM" },
    { name: "Act 2 popcorn", date: "April 29, 2025 | 8:43 PM" },
    { name: "Nutrela soya mini chunks", date: "April 29, 2025 | 8:43 PM" },
    { name: "Multigrain energy bar", date: "April 29, 2025 | 8:43 PM" },
  ];
  
  function renderProducts(list) {
    const container = document.getElementById("productList");
    container.innerHTML = "";
    list.forEach(item => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `<span>${item.name}</span><span>– ${item.date}</span>`;
      container.appendChild(div);
    });
  }
  
  function sortProducts() {
    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
    renderProducts(sorted);
  }
  
  function clearHistory() {
    document.getElementById("productList").innerHTML = "";
  }
  
  window.onload = () => renderProducts(products);
