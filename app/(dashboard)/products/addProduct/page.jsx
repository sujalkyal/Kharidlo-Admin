"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    images: [""],
    category: "", // New category field
  });

  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Home & Lifestyle", value: "home-lifestyle" },
    { label: "Sports & Outdoor", value: "sports-outdoor" },
    { label: "Health & Beauty", value: "health-beauty" },
    { label: "Baby's & Toys", value: "babys-toys" },
    { label: "Groceries & Pets", value: "groceries-pets" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    setProduct((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const addImageField = () => {
    setProduct((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.images.length === 0 || product.images.some((img) => img.trim() === "")) {
      toast.error("Please add at least one image URL.");
      return;
    }
    if (!product.category) {
      toast.error("Please select a category.");
      return;
    }

    try {
      await axios.post("/api/product/addNewProduct", {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.images,
        category: product.category, // Sending category value
      });

      toast.success("Product added successfully!");
      router.push("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price in Cents"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {product.images.map((image, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Image URL ${index + 1}`}
            value={image}
            onChange={(e) => handleImageChange(index, e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Add Another Image
        </button>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save
        </button>
      </form>
    </div>
  );
}
