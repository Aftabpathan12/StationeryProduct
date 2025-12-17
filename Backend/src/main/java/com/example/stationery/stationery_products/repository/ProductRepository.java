package com.example.stationery.stationery_products.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.stationery.stationery_products.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
