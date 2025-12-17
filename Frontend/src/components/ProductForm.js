import axios from "axios";
import { useState } from "react";
import { FaPlus, FaImage, FaSave } from "react-icons/fa";
import "./styles/ProductForm.css";

export default function ProductForm({ refresh }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    quantity: "",
    price: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.brand.trim()) newErrors.brand = "Brand is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.quantity || form.quantity < 0) newErrors.quantity = "Valid quantity is required";
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      if (image) data.append("image", image);

      await axios.post("http://localhost:8080/api/products/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      
      // Reset form
      setForm({
        name: "",
        category: "",
        brand: "",
        description: "",
        quantity: "",
        price: ""
      });
      setImage(null);
      setImagePreview(null);
      setErrors({});
      
      if (refresh) refresh();
      
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const categories = [
    "Writing Instruments",
    "Notebooks & Journals",
    "Art Supplies",
    "Office Supplies",
    "Mathematical Tools",
    "Cutting Tools",
    "Storage & Organization",
    "Adhesives"
  ];

  const brands = [
    "Parker", "Pentel", "Faber-Castell", "Moleskine", 
    "Classmate", "Camlin", "Staedtler", "Bostitch",
    "Doms", "Nataraj", "Casio", "Fevicol", "3M", "Rolson"
  ];

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h3><FaPlus className="me-2" /> Add New Product</h3>
        <p className="text-muted">Fill in the details below to add a new product to your inventory</p>
      </div>

      <form onSubmit={submit} className="product-form">
        <div className="row">
          {/* Left Column - Basic Info */}
          <div className="col-md-6">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter product name"
                value={form.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={form.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Brand *</label>
                  <select
                    name="brand"
                    className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
                    value={form.brand}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      name="price"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                    placeholder="Enter quantity"
                    value={form.quantity}
                    onChange={handleInputChange}
                    min="0"
                  />
                  {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Enter product description"
                rows="3"
                value={form.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="col-md-6">
            <div className="form-group">
              <label>Product Image</label>
              <div className="image-upload-container">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="upload-area">
                    <FaImage size={48} className="text-muted mb-3" />
                    <span>Click to upload product image</span>
                    <span className="text-muted small">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h6>Product Summary</h6>
              <div className="summary-card">
                <div className="summary-item">
                  <span>Name:</span>
                  <strong>{form.name || "Not specified"}</strong>
                </div>
                <div className="summary-item">
                  <span>Brand:</span>
                  <strong>{form.brand || "Not specified"}</strong>
                </div>
                <div className="summary-item">
                  <span>Price:</span>
                  <strong className="text-success">₹ {form.price || "0.00"}</strong>
                </div>
                <div className="summary-item">
                  <span>Stock:</span>
                  <strong className={form.quantity > 10 ? "text-success" : form.quantity > 0 ? "text-warning" : "text-danger"}>
                    {form.quantity || "0"} units
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Add Product
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setForm({
                name: "",
                category: "",
                brand: "",
                description: "",
                quantity: "",
                price: ""
              });
              setImage(null);
              setImagePreview(null);
              setErrors({});
            }}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}