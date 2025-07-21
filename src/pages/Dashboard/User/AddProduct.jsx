import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddProduct = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [ formData, setFormData ] = useState({
        name: '',
        image: '',
        description: '',
        tags: '',
    });

    const addProductMutation = useMutation({
        mutationFn: async (newProductData) => {
            const response = await axiosSecure.post('/products/add-product', newProductData);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Product added successfully!');
            queryClient.invalidateQueries(['products']);
            setFormData({ name: '', image: '', description: '', tags: '' });
            navigate('/dashboard/my-products');
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add product. Please try again.';

            if (
                errorMessage.includes('exceeded product limit') ||
                errorMessage.includes('only add 1 product') ||
                errorMessage.includes('subscribe for unlimited additions')
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Product Limit Reached!',
                    html: `<p>${errorMessage}</p><p class="mt-4">To add more products, please subscribe to our premium membership.</p>`,
                    showCancelButton: true,
                    confirmButtonText: 'Get Membership',
                    cancelButtonText: 'Maybe Later',
                    reverseButtons: true,
                    customClass: { confirmButton: 'btn btn-primary', cancelButton: 'btn btn-outline' },
                    buttonsStyling: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('dashboard/checkout');
                    }
                });
            } else if (
                errorMessage.includes("role is not 'user'") ||
                errorMessage.includes('Forbidden') ||
                errorMessage.includes('User not found') ||
                errorMessage.includes('Owner ID mismatch')
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied!',
                    text: errorMessage,
                    footer: '<a href="/login">Log in and check your role</a>'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage,
                    footer: 'For more details, check the browser console.'
                });
            }
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (authLoading) {
            toast('Loading user data, please wait...');
            return;
        }
        if (!user || !user.uid || !user.email || !user.displayName) {
            toast.error('You must be logged in with complete profile information to add a product.');
            return;
        }

        const productToSend = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            owner: {
                id: user.uid,
                name: user.displayName || user.email.split('@')[0] || 'Unknown User',
                email: user.email,
            },
        };

        addProductMutation.mutate(productToSend);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-center my-8">Add New Product</h2>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Product Name</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Product Image URL</span>
                    </label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/product-image.jpg"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Product Description</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        className="textarea textarea-bordered h-24 w-full"
                        required
                    ></textarea>
                </div>

                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Tags (comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g., tech, innovation, software"
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={addProductMutation.isPending || authLoading}
                    >
                        {addProductMutation.isPending ? 'Adding Product...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
