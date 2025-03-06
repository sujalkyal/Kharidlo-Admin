"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [orders, setOrders] = useState([]);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [editProduct, setEditProduct] = useState(null); // State for edit modal
  const [addImageProduct, setAddImageProduct] = useState(null); // For add image modal
  const [newImageUrl, setNewImageUrl] = useState(""); // New image URL input
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/api/product/getAllProducts`);
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.BACKEND_URL}/api/sales/getAllOrders`);
        setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateOrdersCount = (productId) => {
    return orders.reduce((count, order) => {
      const productOrders = order.products.filter((p) => p.productId === productId);
      return count + productOrders.reduce((sum, p) => sum + (p.quantity || 0), 0);
    }, 0);
  };

  const handleMenuClick = (event, product) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX - 100,
    });

    setMenuOpen(menuOpen === product.id ? null : product.id);
  };

  const openEditModal = (product) => {
    console.log("Editing Product:", product); // Debugging log
    if (!product) return;
    setEditProduct(product);
    setMenuOpen(null);
  };

  const openAddImageModal = (product) => {
    if (!product) return;
    setAddImageProduct(product);
    setMenuOpen(null);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const { id, name, price, stock } = editProduct;
    
    try {
      await axios.post(`${process.env.BACKEND_URL}/api/product/editProduct`, {
        productId: id,
        name: name || undefined,
        price: price || undefined,
        stock: stock || undefined,
      });

      setProducts((prevProducts) =>
        prevProducts.map((prod) => (prod.id === id ? { ...prod, name, price, stock } : prod))
      );

      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };


  const handleAddImageSubmit = async (event) => {
    event.preventDefault();
    if (!newImageUrl || !addImageProduct) return;
    try {
      await axios.post(`${process.env.BACKEND_URL}/api/product/addNewImage`, {
        productId: addImageProduct.id,
        imageUrl: newImageUrl,
      });
      // Update the product's image array in the UI:
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === addImageProduct.id
            ? { ...prod, image: [...(prod.image || []), newImageUrl] }
            : prod
        )
      );
      setAddImageProduct(null);
      setNewImageUrl("");
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };


  return (
    <div className="bg-white text-black min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Products</h1>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800" onClick={() => router.push("/products/addProduct")}>
            Add Product
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg">
          <table className="w-full table-fixed text-left border-collapse">
          <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="w-1/6 p-3 font-medium">Image</th>
                <th className="w-1/6 p-3 font-medium">Name</th>
                <th className="w-1/6 p-3 font-medium">Price</th>
                <th className="w-1/6 p-3 font-medium">Stock</th>
                <th className="w-1/6 p-3 font-medium">Orders</th>
                <th className="w-1/6 p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-100 transition-all">
                  <td className="w-1/5 p-3">
                    <img
                      src={product.image[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  </td>
                  <td className="w-1/6 p-3 font-medium truncate">{product.name}</td>
                  <td className="w-1/6 p-3">${product.price}</td>
                  <td className="w-1/6 p-3 font-medium" style={{ color: product.stock === 0 ? "red" : "green" }}>
                    {product.stock === 0 ? "Out of Stock" : product.stock}
                  </td>
                  <td className="w-1/6 p-3">{calculateOrdersCount(product.id)}</td>
                  <td className="w-1/6 p-3 text-right">
                    <button
                      className="text-gray-600 text-lg px-2 py-1 rounded hover:bg-gray-200"
                      onClick={(e) => handleMenuClick(e, product)}
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {menuOpen !== null && (
          <div
            ref={menuRef}
            className="absolute w-40 bg-white text-black rounded-lg shadow-lg border z-50"
            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          >
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => openEditModal(products.find((p) => p.id === menuOpen))}
            >
              ✏️ Edit Product
            </button>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => openAddImageModal(products.find((p) => p.id === menuOpen))}
            >
              🖼️ Add Image
            </button>
          </div>
        )}

        {editProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={editProduct?.name || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={editProduct?.price || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={editProduct?.stock || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setEditProduct(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

{addImageProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                Add Image to {addImageProduct.name}
              </h2>
              <form onSubmit={handleAddImageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Image URL</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => {
                      setAddImageProduct(null);
                      setNewImageUrl("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Add Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
