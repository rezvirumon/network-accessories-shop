import React, { useState } from 'react';
import Swal from 'sweetalert2';

const initialProducts = [
    { id: 1, name: 'Product 1', price: 29.99, description: 'Description for product 1', category: 'Category 1', stock: 10, images: ['https://via.placeholder.com/150'] },
    { id: 2, name: 'Product 2', price: 49.99, description: 'Description for product 2', category: 'Category 2', stock: 20, images: ['https://via.placeholder.com/150'] },
    { id: 3, name: 'Product 3', price: 19.99, description: 'Description for product 3', category: 'Category 3', stock: 15, images: ['https://via.placeholder.com/150'] }
];

const ManageProducts = () => {
    const [products, setProducts] = useState(initialProducts);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        images: ['', '', ''] // Start with 3 empty image URLs
    });

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

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = () => {
        const validImages = newProduct.images.filter(img => img.trim() !== '');
        if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock || validImages.length < 3) {
            Swal.fire('Error!', 'Please fill in all required fields and add at least 3 images.', 'error');
            return;
        }

        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const addedProduct = { ...newProduct, id: newId, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) };
        setProducts([...products, addedProduct]);
        setNewProduct({
            name: '',
            price: '',
            description: '',
            category: '',
            stock: '',
            images: ['', '', ''] // Reset to 3 empty image URLs
        });
        Swal.fire('Success!', 'Product added successfully', 'success');
    };

    const handleEditProduct = () => {
        const validImages = editProduct.images.filter(img => img.trim() !== '');
        if (!editProduct.name || !editProduct.price || !editProduct.category || !editProduct.stock || validImages.length < 3) {
            Swal.fire('Error!', 'Please fill in all required fields and add at least 3 images.', 'error');
            return;
        }

        const updatedProducts = products.map((product) =>
            product.id === editProduct.id ? { ...editProduct, price: parseFloat(editProduct.price), stock: parseInt(editProduct.stock) } : product
        );
        setProducts(updatedProducts);
        setEditProduct(null);
        Swal.fire('Success!', 'Product updated successfully', 'success');
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
        }).then((result) => {
            if (result.isConfirmed) {
                setProducts(products.filter(product => product.id !== id));
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            }
        });
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Manage Products</h1>

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
                    {[0, 1, 2, 3, 4].map(index => (
                        <input
                            key={index}
                            type="text"
                            value={newProduct.images[index] || ''}
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

            {/* Products Table */}
            <div className="overflow-x-auto mb-8">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Images</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>{product.stock}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>
                                    <div className="flex gap-2">
                                        {product.images.slice(0, 3).map((img, idx) => (
                                            <img key={idx} src={img} alt={`Product ${product.name} ${idx + 1}`} className="w-24 h-24 object-cover" />
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setEditProduct(product);
                                            document.getElementById('editProductModal').showModal();
                                        }}
                                        className="btn btn-ghost btn-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="btn btn-ghost btn-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Images</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Edit Product Modal */}
            {editProduct && (
                <dialog id="editProductModal" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Edit Product</h3>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
                            <input
                                type="text"
                                name="name"
                                value={editProduct.name}
                                onChange={handleEditChange}
                                placeholder="Product Name"
                                className="border rounded-lg px-4 py-2"
                            />
                            <input
                                type="number"
                                name="price"
                                value={editProduct.price}
                                onChange={handleEditChange}
                                placeholder="Price"
                                className="border rounded-lg px-4 py-2"
                            />
                            <input
                                type="text"
                                name="description"
                                value={editProduct.description}
                                onChange={handleEditChange}
                                placeholder="Description"
                                className="border rounded-lg px-4 py-2"
                            />
                            <input
                                type="text"
                                name="category"
                                value={editProduct.category}
                                onChange={handleEditChange}
                                placeholder="Category"
                                className="border rounded-lg px-4 py-2"
                            />
                            <input
                                type="number"
                                name="stock"
                                value={editProduct.stock}
                                onChange={handleEditChange}
                                placeholder="Stock"
                                className="border rounded-lg px-4 py-2"
                            />
                            {[0, 1, 2, 3, 4].map(index => (
                                <input
                                    key={index}
                                    type="text"
                                    name="images"
                                    value={editProduct.images[index] || ''}
                                    onChange={e => handleEditChange({
                                        target: { name: 'images', value: e.target.value }
                                    })}
                                    placeholder={`Image URL ${index + 1}`}
                                    className="border rounded-lg px-4 py-2"
                                />
                            ))}
                        </div>
                        <div className="modal-action">
                            <button
                                onClick={handleEditProduct}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Save Changes
                            </button>
                            <button className="btn" onClick={() => document.getElementById('editProductModal').close()}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default ManageProducts;
