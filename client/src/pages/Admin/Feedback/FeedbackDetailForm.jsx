import React from "react";

export default function FeedbackDetailForm({ feedback }) {
    const reply = feedback.reply;
    const responder = reply?.responder;

    console.log(feedback);

    return (
        <div className="p-6 space-y-6 text-[15px] text-gray-800 font-[system-ui] leading-relaxed">
            {/* User Info */}
            <div className="space-y-1">
                <p className="text-gray-400 text-xs uppercase tracking-widest">From</p>
                <div className="px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                    <span className="font-medium">{feedback.name}</span> —{" "}
                    <span className="text-gray-500">{feedback.email}</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-gray-400 text-xs uppercase tracking-widest">Message</p>
                <div className="px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm whitespace-pre-wrap">
                    {feedback.message}
                </div>
            </div>

            {/* Reply (if exists) */}
            {reply && (
                <div className="pt-6 border-t border-gray-100 space-y-3">
                    <p className="text-blue-600 text-xs uppercase tracking-widest">Admin Reply</p>

                    <div className="px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 shadow-sm whitespace-pre-wrap text-gray-800">
                        {reply.message}
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 px-1">
                        <span>{responder?.name || "—"}</span>
                        <span className="capitalize">{feedback.reply?.responder?.role?.name || "—"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
