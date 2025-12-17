import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../api/productApi";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="container mt-4">
      <ProductForm refresh={loadProducts} />
      <ProductList products={products} onDelete={handleDelete} />
    </div>
  );
};

export default ProductsPage;
