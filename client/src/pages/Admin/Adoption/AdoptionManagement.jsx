// Thuc - Adoption Management
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";

export default function AdoptionManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get("https://thoriumstudio.xyz/api/adoption-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching adoption requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleApprove = async (id) => {
    try {
      setLoadingApprove(true);
      const token = localStorage.getItem("access_token");
      await axios.patch(`https://thoriumstudio.xyz/api/adoption-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Adoption request approved successfully!");
      fetchAdoptions();
    } catch (err) {
      console.error("Error approving adoption request:", err);
    } finally {
      setLoadingApprove(false);
    }
  };

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0 1 14.14 14.14A10 10 0 0 1 4.93 4.93z"></path>
        </svg>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-10 mt-10">
      <div className="mb-2">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center rounded text-sm text-customPurple hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl ">Adoption Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User ID</th>
              <th className="p-4">Pet ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Note</th>
              <th className="p-4">Requested At</th>
              <th className="p-4">Approved At</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">Loading...</td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No adoption requests found.</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{request.id}</td>
                  <td className="p-4">{request.user_id}</td>
                  <td className="p-4">{request.pet_id}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs inline-block ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-pre-wrap max-w-sm text-xs text-gray-600">
                    {request.note || "—"}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {request.requested_at || "—"}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {request.approved_at || "—"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(request.id)}
                          className={`px-2 py-1 text-xs ${loadingApprove ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition'} rounded`}
                          disabled={loadingApprove}
                        >
                          {loadingApprove ? <Loader className="animate-spin h-4 w-4" /> : "Approve"}
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Reject request #${request.id}`)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
