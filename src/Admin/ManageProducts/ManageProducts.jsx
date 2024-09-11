import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [editProductData, setEditProductData] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        images: ['', '', '']
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...newProduct.images];
        updatedImages[index] = value;
        setNewProduct(prev => ({
            ...prev,
            images: updatedImages
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditImageChange = (index, value) => {
        const updatedImages = [...editProductData.images];
        updatedImages[index] = value;
        setEditProductData(prev => ({
            ...prev,
            images: updatedImages
        }));
    };

    const validateProduct = (product) => {
        const validImages = product.images.filter(img => img.trim() !== '');
        const priceIsValid = !isNaN(parseFloat(product.price)) && parseFloat(product.price) > 0;
        const stockIsValid = !isNaN(parseInt(product.stock)) && parseInt(product.stock) >= 0;

        return product.name &&
            priceIsValid &&
            product.category &&
            stockIsValid &&
            validImages.length >= 3;
    };

    const handleAddProduct = () => {
        if (!validateProduct(newProduct)) {
            Swal.fire('Error!', 'Please fill in all required fields and add at least 3 images.', 'error');
            return;
        }

        axios.post('http://localhost:3001/api/products', {
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock)
        })
            .then(response => {
                setProducts([...products, response.data]);
                setNewProduct({
                    name: '',
                    price: '',
                    description: '',
                    category: '',
                    stock: '',
                    images: ['', '', '']
                });
                Swal.fire('Success!', 'Product added successfully', 'success');
            })
            .catch(error => {
                Swal.fire('Error!', 'There was an error adding the product.', 'error');
                console.error('Error adding product:', error);
            });
    };

    const handleEditProduct = () => {
        if (!validateProduct(editProductData)) {
            Swal.fire('Error!', 'Please fill in all required fields and add at least 3 images.', 'error');
            return;
        }

        axios.put(`http://localhost:3001/api/products/${editProductData._id}`, {
            ...editProductData,
            price: parseFloat(editProductData.price),
            stock: parseInt(editProductData.stock)
        })
            .then(response => {
                const updatedProducts = products.map(product =>
                    product._id === editProductData._id ? response.data : product
                );
                setProducts(updatedProducts);
                setEditProductData(null);
                setIsEditModalOpen(false);
                Swal.fire('Success!', 'Product updated successfully', 'success');
            })
            .catch(error => {
                Swal.fire('Error!', 'There was an error updating the product.', 'error');
                console.error('Error updating product:', error);
            });
    };

    const openEditModal = (product) => {
        setEditProductData(product);
        setIsEditModalOpen(true);
    };

    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/api/products/${id}`)
                    .then(() => {
                        setProducts(products.filter(product => product._id !== id));
                        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'There was an error deleting the product.', 'error');
                        console.error('Error deleting product:', error);
                    });
            }
        });
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Manage Products</h1>

            {/* Add New Product */}
            <AddProductForm
                newProduct={newProduct}
                handleInputChange={handleInputChange}
                handleImageChange={handleImageChange}
                handleAddProduct={handleAddProduct}
            />

            {/* Products List */}
            <ProductsTable
                products={products}
                openEditModal={openEditModal}
                handleDeleteProduct={handleDeleteProduct}
            />

            {/* Edit Product Modal */}
            {isEditModalOpen && editProductData && (
                <EditProductModal
                    editProduct={editProductData}
                    handleEditInputChange={handleEditInputChange}
                    handleEditImageChange={handleEditImageChange}
                    handleEditProduct={handleEditProduct}
                    closeModal={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
};

// AddProductForm component for adding a new product
const AddProductForm = ({ newProduct, handleInputChange, handleImageChange, handleAddProduct }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="border rounded-lg px-4 py-2"
            />
            <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="border rounded-lg px-4 py-2"
            />
            <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="border rounded-lg px-4 py-2"
            />
            <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="border rounded-lg px-4 py-2"
            />
            <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="Stock"
                className="border rounded-lg px-4 py-2"
            />
            {newProduct.images.map((img, index) => (
                <input
                    key={index}
                    type="text"
                    value={img}
                    onChange={e => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="border rounded-lg px-4 py-2"
                />
            ))}
        </div>
        <button
            onClick={handleAddProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4"
        >
            Add Product
        </button>
    </div>
);

// ProductsTable component for displaying the product list
const ProductsTable = ({ products, openEditModal, handleDeleteProduct }) => (
    <div className="overflow-x-auto mb-8">
        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th className="px-4 py-2">Select</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Images</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product._id}>
                        <td className="border px-4 py-2">
                            <input type="checkbox" className="form-checkbox" />
                        </td>
                        <td className="border px-4 py-2">{product.name}</td>
                        <td className="border px-4 py-2">{product.description}</td>
                        <td className="border px-4 py-2">{product.category}</td>
                        <td className="border px-4 py-2">{product.stock}</td>
                        <td className="border px-4 py-2">${product.price.toFixed(2)}</td>
                        <td className="border px-4 py-2">
                            {product.images.map((img, index) => (
                                <img key={index} src={img} alt={`Product Image ${index + 1}`} className="w-12 h-12" />
                            ))}
                        </td>
                        <td className="border px-4 py-2">
                            <button
                                onClick={() => openEditModal(product)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// EditProductModal component for editing an existing product
const EditProductModal = ({ editProduct, handleEditInputChange, handleEditImageChange, handleEditProduct, closeModal }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <input
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleEditInputChange}
                    placeholder="Product Name"
                    className="border rounded-lg px-4 py-2"
                />
                <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleEditInputChange}
                    placeholder="Price"
                    className="border rounded-lg px-4 py-2"
                />
                <input
                    type="text"
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditInputChange}
                    placeholder="Description"
                    className="border rounded-lg px-4 py-2"
                />
                <input
                    type="text"
                    name="category"
                    value={editProduct.category}
                    onChange={handleEditInputChange}
                    placeholder="Category"
                    className="border rounded-lg px-4 py-2"
                />
                <input
                    type="number"
                    name="stock"
                    value={editProduct.stock}
                    onChange={handleEditInputChange}
                    placeholder="Stock"
                    className="border rounded-lg px-4 py-2"
                />
                {editProduct.images.map((img, index) => (
                    <input
                        key={index}
                        type="text"
                        value={img}
                        onChange={e => handleEditImageChange(index, e.target.value)}
                        placeholder={`Image URL ${index + 1}`}
                        className="border rounded-lg px-4 py-2"
                    />
                ))}
            </div>
            <div className="mt-4">
                <button
                    onClick={handleEditProduct}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
                >
                    Save Changes
                </button>
                <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

export default ManageProducts;
