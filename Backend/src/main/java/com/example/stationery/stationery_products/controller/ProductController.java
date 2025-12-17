package com.example.stationery.stationery_products.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.stationery.stationery_products.dto.ProductDTO;
import com.example.stationery.stationery_products.model.Product;
import com.example.stationery.stationery_products.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService service;

    // ADD PRODUCT
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam Integer quantity,
            @RequestParam Double price,
            @RequestParam String brand,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setDescription(description);
        product.setQuantity(quantity);
        product.setPrice(price);
        product.setBrand(brand);

        service.addProduct(product, image);
        return ResponseEntity.ok("Product added successfully");
    }

    // GET ALL PRODUCTS
    @GetMapping("/all")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {

        List<ProductDTO> products = service.getAllProducts()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Integer id) {

        Optional<Product> optional = service.getProductById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        return ResponseEntity.ok(convertToDTO(optional.get()));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
        return ResponseEntity.ok("Deleted");
    }

    // CONVERTER METHOD
    private ProductDTO convertToDTO(Product product) {

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCategory(product.getCategory());
        dto.setDescription(product.getDescription());
        dto.setQuantity(product.getQuantity());
        dto.setPrice(product.getPrice());
        dto.setBrand(product.getBrand());

        if (product.getImage() != null) {
            dto.setImageBase64(
                Base64.getEncoder().encodeToString(product.getImage())
            );
            dto.setImageType(product.getImageType());
        }

        return dto;
    }
}
