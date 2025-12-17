import React, { useState, useEffect, useCallback } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css"; // CORRECT PATH: ./styles/App.css (not /styles/App.css)

function App() {
  const [products, setProducts] = useState([]); // Keep this for future use
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    avgPrice: 0,
    outOfStock: 0
  });

  // Wrap fetchProducts in useCallback to fix dependency warning
  const fetchProducts = useCallback(async () => {
    try {
      // You can fetch from API here when ready
      // For now, we'll use dummy data or empty
      // Example: const response = await fetch("http://localhost:8080/api/products/all");
      // const data = await response.json();
      // setProducts(data);
      // calculateStats(data);
      
      // Temporary: Use empty array
      const dummyProducts = [];
      setProducts(dummyProducts); // Now 'products' is being used
      calculateStats(dummyProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []); // Empty dependency array for useCallback

  const calculateStats = (products) => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => {
      return sum + (parseFloat(p.price || 0) * parseInt(p.quantity || 1));
    }, 0);
    const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    const outOfStock = products.filter(p => (p.quantity || 0) === 0).length;

    setStats({
      totalProducts,
      totalValue,
      avgPrice,
      outOfStock
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Include fetchProducts in dependencies

  const handleProductAdded = () => {
    fetchProducts();
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <h1 className="display-4 fw-bold">📦 Stationery Store Manager</h1>
          <p className="lead">Manage your inventory, track sales, and grow your business</p>
        </div>
      </header>

      <main className="container">
        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">₹ {stats.totalValue.toFixed(2)}</div>
            <div className="stat-label">Inventory Value</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">₹ {stats.avgPrice.toFixed(2)}</div>
            <div className="stat-label">Avg. Price</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{stats.outOfStock}</div>
            <div className="stat-label">Out of Stock</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Alert Message */}
          {stats.outOfStock > 0 && (
            <div className="alert alert-warning">
              ⚠️ <strong>Attention:</strong> {stats.outOfStock} product(s) are out of stock. 
              Consider restocking soon.
            </div>
          )}

          {/* Add Product Form */}
          <div className="mb-5">
            <ProductForm refresh={handleProductAdded} />
          </div>

          {/* Product List */}
          <div>
            <ProductList 
              onDelete={handleProductAdded}
              onEdit={(product) => {
                console.log("Edit product:", product);
              }}
              onView={(product) => {
                console.log("View product:", product);
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted mt-5 pt-4 border-top">
          <p className="small">
            © {new Date().getFullYear()} Stationery Store Manager. 
            Built with React & Bootstrap
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;