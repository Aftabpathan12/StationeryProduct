package com.example.stationery.stationery_products.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.stationery.stationery_products.model.Product;
import com.example.stationery.stationery_products.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    public Product addProduct(Product product, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            product.setImage(image.getBytes());
            product.setImageType(image.getContentType());
        }
        return repo.save(product);
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        return repo.findById(id);
    }

    public void deleteProduct(Integer id) {
        repo.deleteById(id);
    }
}
