import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrashAlt, FaTag, FaCalendarAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

import useAxiosSecure from './../../../hooks/useAxiosSecure';


const ManageCoupons = () => {

    useEffect( () => {
        // Set the page title when the component mounts
        document.title = 'Manage Coupons || AppOrbit';
    }, [] );

    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // State for managing edit mode
    const [ editingCoupon, setEditingCoupon ] = useState( null );
    const {
        data: coupons = [],
        isLoading,
        isError,
        error
    } = useQuery( {
        queryKey: [ 'allCoupons' ],
        queryFn: async () => {
            const res = await axiosSecure.get( '/coupons' );
            return res.data;
        },
        staleTime: 1000 * 60,
    } );

    // Mutation for adding a coupon
    const addCouponMutation = useMutation( {
        mutationFn: async ( newCouponData ) => {
            const res = await axiosSecure.post( '/coupons', newCouponData );
            return res.data;
        },
        onSuccess: () => {
            toast.success( 'Coupon added successfully!' );
            reset();
            queryClient.invalidateQueries( [ 'allCoupons' ] );
            queryClient.invalidateQueries( [ 'validCoupons' ] );
        },
        onError: ( err ) => {
            console.error( 'Error adding coupon:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to add coupon.',
            } );
        },
    } );

    // Mutation for updating a coupon
    const updateCouponMutation = useMutation( {
        mutationFn: async ( { couponId, updatedData } ) => {
            const res = await axiosSecure.patch( `/coupons/${ couponId }`, updatedData );
            return res.data;
        },
        onSuccess: () => {
            toast.success( 'Coupon updated successfully!' );
            setEditingCoupon( null );
            reset();
            queryClient.invalidateQueries( [ 'allCoupons' ] );
            queryClient.invalidateQueries( [ 'validCoupons' ] );
        },
        onError: ( err ) => {
            console.error( 'Error updating coupon:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to update coupon.',
            } );
        },
    } );

    // Mutation for deleting a coupon
    const deleteCouponMutation = useMutation( {
        mutationFn: async ( couponId ) => {
            const res = await axiosSecure.delete( `/coupons/${ couponId }` );
            return res.data;
        },
        onSuccess: () => {
            Swal.fire( {
                icon: 'success',
                title: 'Deleted!',
                text: 'Coupon has been deleted.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            } );
            queryClient.invalidateQueries( [ 'allCoupons' ] );
            queryClient.invalidateQueries( [ 'validCoupons' ] );
        },
        onError: ( err ) => {
            console.error( 'Error deleting coupon:', err.response?.data || err.message );
            Swal.fire( {
                icon: 'error',
                title: 'Error!',
                text: err.response?.data?.message || 'Failed to delete coupon.',
            } );
        },
    } );

    // Handle form submission (Add or Update)
    const onSubmit = async ( data ) => {
        // Convert date to ISO string for backend
        const formattedData = {
            ...data,
            expiryDate: new Date( data.expiryDate ).toISOString(),
            discountAmount: parseFloat( data.discountAmount )
        };

        if ( editingCoupon ) {
            updateCouponMutation.mutate( { couponId: editingCoupon._id, updatedData: formattedData } );
        } else {
            addCouponMutation.mutate( formattedData );
        }
    };

    // Handle Edit button click
    const handleEdit = ( coupon ) => {
        setEditingCoupon( coupon );
        setValue( 'couponCode', coupon.couponCode );
        setValue( 'discountAmount', coupon.discountAmount );
        setValue( 'expiryDate', new Date( coupon.expiryDate ).toISOString().split( 'T' )[ 0 ] );
        setValue( 'couponDescription', coupon.couponDescription );
    };

    // Handle Delete button click
    const handleDelete = ( couponId ) => {
        Swal.fire( {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                deleteCouponMutation.mutate( couponId );
            }
        } );
    };

    // Helper to format date for display
    const formatDate = ( dateString ) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date( dateString ).toLocaleDateString( undefined, options );
    };

    // Loading and Error states for fetching coupons
    if ( isLoading ) {
        return (
            <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
                <p>Loading coupons...</p>
            </div>
        );
    }

    if ( isError ) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>Error loading coupons: { error.message }</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-base-200">
            <h2 className="text-3xl font-bold text-center mb-8">{ editingCoupon ? 'Edit Coupon' : 'Add New Coupon' }</h2>

            {/* Coupon Add/Edit Form */ }
            <form onSubmit={ handleSubmit( onSubmit ) } className="max-w-xl mx-auto bg-base-200 p-8 rounded-lg shadow-md mb-10">
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Coupon Code</span></label>
                    <input
                        type="text"
                        placeholder="SUMMER20"
                        className="input input-bordered w-full"
                        { ...register( "couponCode", { required: "Coupon code is required" } ) }
                    />
                    { errors.couponCode && <span className="text-red-500 text-sm">{ errors.couponCode.message }</span> }
                </div>
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Discount Amount ($)</span></label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 10.00"
                        className="input input-bordered w-full"
                        { ...register( "discountAmount", {
                            required: "Discount amount is required",
                            min: { value: 0, message: "Discount cannot be negative" }
                        } ) }
                    />
                    { errors.discountAmount && <span className="text-red-500 text-sm">{ errors.discountAmount.message }</span> }
                </div>
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Expiry Date</span></label>
                    <input
                        type="date"
                        className="input input-bordered w-full"
                        { ...register( "expiryDate", {
                            required: "Expiry date is required",
                            validate: ( value ) => new Date( value ) > new Date() || "Expiry date must be in the future"
                        } ) }
                    />
                    { errors.expiryDate && <span className="text-red-500 text-sm">{ errors.expiryDate.message }</span> }
                </div>
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Coupon Description</span></label>
                    <textarea
                        placeholder="e.g., Discount for new members"
                        className="textarea textarea-bordered h-24 w-full"
                        { ...register( "couponDescription", { required: "Description is required" } ) }
                    ></textarea>
                    { errors.couponDescription && <span className="text-red-500 text-sm">{ errors.couponDescription.message }</span> }
                </div>
                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={ addCouponMutation.isPending || updateCouponMutation.isPending }
                    >
                        { editingCoupon ? (
                            updateCouponMutation.isPending ? 'Updating Coupon...' : 'Update Coupon'
                        ) : (
                            addCouponMutation.isPending ? 'Adding Coupon...' : 'Add Coupon'
                        ) }
                    </button>
                    { editingCoupon && (
                        <button type="button" onClick={ () => { setEditingCoupon( null ); reset(); } } className="btn btn-ghost w-full mt-2">
                            Cancel Edit
                        </button>
                    ) }
                </div>
            </form>

            <h2 className="text-3xl font-bold text-center mb-8">All Coupons ({ coupons.length })</h2>

            {/* Coupons Table */ }
            { coupons.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p>No coupons found. Add some new offers above!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        {/* Table Head */ }
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Expiry Date</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Table Body */ }
                            { coupons.map( ( coupon, index ) => (
                                <tr key={ coupon._id }>
                                    <th>{ index + 1 }</th>
                                    <td className="font-bold text-primary">{ coupon.couponCode }</td>
                                    <td>${ coupon.discountAmount.toFixed( 2 ) }</td>
                                    <td>
                                        <div className="flex items-center gap-1">
                                            <FaCalendarAlt />
                                            { formatDate( coupon.expiryDate ) }
                                        </div>
                                    </td>
                                    <td>{ coupon.couponDescription }</td>
                                    <td>
                                        <span className={ `badge ${ new Date( coupon.expiryDate ) > new Date() ? 'badge-success' : 'badge-error' }` }>
                                            { new Date( coupon.expiryDate ) > new Date() ? 'Active' : 'Expired' }
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={ () => handleEdit( coupon ) }
                                            className="btn btn-sm btn-info text-white"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={ () => handleDelete( coupon._id ) }
                                            className="btn btn-sm btn-error text-white"
                                            disabled={ deleteCouponMutation.isPending }
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ) ) }
                        </tbody>
                    </table>
                </div>
            ) }
        </div>
    );
};

export default ManageCoupons;