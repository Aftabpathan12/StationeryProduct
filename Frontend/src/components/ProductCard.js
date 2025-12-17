import React from "react";
import { FaEdit, FaTrash, FaEye, FaStar, FaShoppingCart } from "react-icons/fa";
import "./styles/ProductCard.css";

const ProductCard = ({ product, onDelete, onEdit, onView }) => {
  const getStockStatus = (quantity) => {
    if (quantity === 0) return "out-of-stock";
    if (quantity < 10) return "low-stock";
    return "in-stock";
  };

  const getStockText = (quantity) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < 10) return `Only ${quantity} left`;
    return `${quantity} in stock`;
  };

  return (
    <div className="card product-card">
      {/* Product Image */}
      <div className="position-relative">
        {product.imageBase64 ? (
          <img
            src={`data:${product.imageType};base64,${product.imageBase64}`}
            className="card-img-top product-image"
            alt={product.name}
          />
        ) : (
          <div className="product-image bg-light d-flex align-items-center justify-content-center">
            <span className="text-muted">No Image</span>
          </div>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
            {product.category}
          </span>
        )}
        
        {/* Rating Badge */}
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-warning text-dark">
            <FaStar className="me-1" /> 4.5
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column">
        {/* Product Name */}
        <h5 className="product-name">{product.name}</h5>
        
        {/* Brand */}
        <p className="product-brand text-muted mb-2">
          <strong>Brand:</strong> {product.brand}
        </p>
        
        {/* Category */}
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        
        {/* Description */}
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        {/* Stock Status */}
        <div className={`product-stock ${getStockStatus(product.quantity || 0)}`}>
          <strong>{getStockText(product.quantity || 0)}</strong>
        </div>
        
        {/* Price */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <h4 className="product-price mb-0">  {product.price}</h4>
          
          {/* Actions */}
          <div className="product-actions">
            {onView && (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => onView(product)}
                title="View Details"
              >
                <FaEye />
              </button>
            )}
            
            {onEdit && (
              <button 
                className="btn btn-outline-warning btn-sm"
                onClick={() => onEdit(product)}
                title="Edit Product"
              >
                <FaEdit />
              </button>
            )}
            
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(product.id)}
              title="Delete Product"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button className="btn btn-success mt-2">
          <FaShoppingCart className="me-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;