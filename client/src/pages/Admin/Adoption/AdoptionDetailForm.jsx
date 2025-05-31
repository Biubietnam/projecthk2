import React from "react";
import dayjs from "dayjs";

export default function AdoptionDetailForm({ request }) {
  return (
    <div className="space-y-4 text-sm text-gray-700 max-w-md">
      <div><strong>User ID:</strong> {request.user_id}</div>
      <div><strong>Pet ID:</strong> {request.pet_id}</div>
      <div><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs inline-block ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{request.status}</span></div>
      <div><strong>Note:</strong> {request.note || "—"}</div>
      <div><strong>Requested At:</strong> {dayjs(request.requested_at).format("YYYY-MM-DD HH:mm") || "—"}</div>
      <div><strong>Approved At:</strong> {request.approved_at ? dayjs(request.approved_at).format("YYYY-MM-DD HH:mm") : "—"}</div>
      <div><strong>Rejected At:</strong> {request.rejected_at ? dayjs(request.rejected_at).format("YYYY-MM-DD HH:mm") : "—"}</div>
      <div><strong>Scheduled At:</strong> {request.scheduled_at ? dayjs(request.scheduled_at).format("YYYY-MM-DD HH:mm") : "—"}</div>
    </div>
  );
}
