import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import ProductCard from "./ProductCard";
import "./styles/ProductList.css";

export default function ProductList({ onDelete, onEdit, onView }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [totalValue, setTotalValue] = useState(0);

  // Wrap fetchProducts in useCallback to avoid infinite re-renders
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/products/all");
      setProducts(res.data);
      setFilteredProducts(res.data);
      
      // Calculate total inventory value
      const value = res.data.reduce((sum, product) => {
        return sum + (parseFloat(product.price) * parseInt(product.quantity || 1));
      }, 0);
      setTotalValue(value);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Now fetchProducts is included in dependencies

  // Rest of the code remains the same...
  // Extract unique categories and brands
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ["all", ...uniqueCats];
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    return ["all", ...uniqueBrands];
  }, [products]);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter(product => product.brand === selectedBrand);
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "price" || sortBy === "quantity") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy, sortOrder]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/delete/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {/* Header with stats */}
      <div className="list-header">
        <div>
          <h3>Product Inventory</h3>
          <p className="text-muted">{filteredProducts.length} products found</p>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{products.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Inventory Value</span>
            <span className="stat-value text-success">₹ {totalValue.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">In Stock</span>
            <span className="stat-value text-success">
              {products.filter(p => p.quantity > 0).length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search products by name, brand, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== "all").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {brands.filter(brand => brand !== "all").map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="brand">Sort by Brand</option>
            </select>
            <button className="btn btn-outline-secondary sort-btn" onClick={toggleSortOrder}>
              {sortOrder === "asc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h4>No products found</h4>
          <p className="text-muted">Try adjusting your search or filters</p>
          <button
            className="btn btn-outline-primary"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedBrand("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map(product => (
              <div className="grid-item" key={product.id}>
                <ProductCard
                  product={product}
                  onDelete={handleDelete}
                  onEdit={onEdit}
                  onView={onView}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className="pagination-section">
              <nav aria-label="Product navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={prevPage} disabled={currentPage === 1}>
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
                    if (
                      number === 1 ||
                      number === totalPages ||
                      (number >= currentPage - 1 && number <= currentPage + 1)
                    ) {
                      return (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(number)}>
                            {number}
                          </button>
                        </li>
                      );
                    } else if (number === currentPage - 2 || number === currentPage + 2) {
                      return (
                        <li key={number} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div className="info-text">
                Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}