"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { sanityClient } from "@/sanity-nextjs/src/sanity/lib/client";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/protectedlayout/layout";
import { urlFor } from "@/sanity-nextjs/src/sanity/lib/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPackage, FiCheckCircle, FiClock } from "react-icons/fi";

interface Order {
  _id: string;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  total: number;
  area: string;
  streetnumber: string;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems?: { 
    name?: string; 
    image?: string;
  }[] | null;

}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "order"]{
          _id,
          fullname,
          phone,
          email,
          address,
          region,
          area,
          street,
          total,
          discount,
          orderDate,
          status,
          streetnumber,
          cartItems[]->{
            productName,
            image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await sanityClient.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await sanityClient.patch(orderId).set({ status: newStatus }).commit();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "dispatch") {
        Swal.fire("Dispatch", "The order is now dispatched.", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success", "The order has been completed.", "success");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire(
        "Error!",
        "Something went wrong while updating the status.",
        "error"
      );
    }
  };

return (
  <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <nav className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
            <div className="flex space-x-2">
              {["All", "pending", "dispatch", "success"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-md transition-all transform hover:scale-105 ${
                    filter === status
                      ? "bg-white text-indigo-600 shadow-lg"
                      : "bg-indigo-500/20 hover:bg-indigo-500/30"
                  }`}
                  onClick={() => setFilter(status)}
                >
                  <span className="flex items-center gap-2">
                    {status === 'pending' && <FiClock className="inline" />}
                    {status === 'dispatch' && <FiPackage className="inline" />}
                    {status === 'success' && <FiCheckCircle className="inline" />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800">Order Management</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    {['ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-indigo-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{order.fullname}</p>
                                <p className="text-sm text-gray-500">{order.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ${order.total}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status || "pending"}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`block w-full rounded-lg border px-3 py-1 text-sm focus:outline-none focus:ring-2 ${
                                order.status === 'pending'
                                  ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                                  : order.status === 'dispatch'
                                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                                  : 'border-green-300 bg-green-50 text-green-700'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="dispatch">Dispatched</option>
                              <option value="success">Completed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(order._id);
                              }}
                              className="p-2 hover:bg-red-50 rounded-full text-red-600 hover:text-red-700 transition-colors"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </td>
                      </motion.tr>

                      <AnimatePresence>
                        {selectedOrderId === order._id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-indigo-50/50"
                          >
                            <td colSpan={6} className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-indigo-600">Customer Details</h4>
                                    <dl className="space-y-1">
                                      <div>
                                        <dt className="text-xs text-gray-500">Email</dt>
                                        <dd className="text-sm text-gray-900">{order.email}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-xs text-gray-500">Address</dt>
                                        <dd className="text-sm text-gray-900">
                                          {[order.address, order.area, order.region].join(', ')}
                                        </dd>
                                      </div>
                                    </dl>
                                  </div>

                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold text-indigo-600">Order Items</h4>
                                  <div className="space-y-2">
                                    {order.cartItems?.length ? (
                                      order.cartItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                          {item?.image && (
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                              <Image
                                                src={urlFor(item.image).url()}
                                                fill
                                                alt={item?.name || 'Product image'}
                                                className="object-cover"
                                              />
                                            </div>
                                          )}
                                          <span className="text-sm font-medium text-gray-900">
                                            {item?.name || 'Unnamed Product'}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">No items in cart</p>
                                    )}
                                  </div>
                                </div>

                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  </ProtectedRoute>
)
}