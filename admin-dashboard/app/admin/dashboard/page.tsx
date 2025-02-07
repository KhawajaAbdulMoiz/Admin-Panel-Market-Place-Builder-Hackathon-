"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { sanityClient } from "@/sanity-nextjs/src/sanity/lib/client";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/protectedlayout/layout";
import { urlFor } from "@/sanity-nextjs/src/sanity/lib/image";

// import Swal from "sweetalert2";
// import ProtectedRoute from "@/app/components/protectedlayout/page"

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
  cartItems: { name: string; image: string }[];
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
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
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
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? "bg-white text-red-600 font-bold"
                    : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-50 text-red-600">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Action</th>
                  <th>Status</th>
                  {/* <th>Email</th>
                  <th>Region</th>
                  <th>Area</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="text-black cursor-pointer hover:bg-red-100 transition-all "
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td>{order._id}</td>
                      <td>{order.fullname}</td>
                      <td>{order.address}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>${order.total}</td>
                      <td>
                        <select
                          value={order.status || ""}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedOrderId === order._id && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-black bg-gray-50 p-4 transition-all animate-fadeIn"
                        >
                          <h3 className="font-bold">Order Details</h3>
                          <p>
                            <strong>Phone:</strong> {order.phone}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.email}
                          </p>
                          <p>
                            <strong>Address:</strong> {order.address}
                          </p>
                          <ul>
                            {Array.isArray(order.cartItems) ? (
                              order.cartItems.map((item, index) => (
                                <li
                                  key={`${order._id}-${index}`}
                                  className="flex items-center gap-2"
                                >
                                  {item?.name || "Unnamed Product"}
                                  {item?.image && (
                                    <Image
                                      src={urlFor(item.image).url()}
                                      width={40}
                                      height={40}
                                      alt={item?.name || "Product Image"}
                                    />
                                  )}
                                </li>
                              ))
                            ) : (
                              <p>No items in cart</p>
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
