import React from "react";

export default function ContactDetailForm({ contact }) {
    const reply = contact.reply;
    const responder = reply?.responder;

    return (
        <div className="p-6 space-y-6 text-[15px] text-gray-800 font-[system-ui] leading-relaxed">
            {/* From */}
            <div className="space-y-1">
                <p className="text-gray-400 text-xs uppercase tracking-widest">From</p>
                <div className="px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 shadow-sm text-sm">
                    <span className="font-semibold">{contact.full_name}</span>
                    <span className="text-gray-500"> — {contact.email}</span>
                </div>
            </div>

            {/* Phone */}
            {contact.phone && (
                <div className="space-y-1">
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Phone</p>
                    <div className="px-4 py-2 rounded-xl border border-gray-100 bg-white shadow-sm text-sm">
                        {contact.phone}
                    </div>
                </div>
            )}

            {/* Subject */}
            <div className="space-y-1">
                <p className="text-gray-400 text-xs uppercase tracking-widest">Subject</p>
                <div className="px-4 py-2 rounded-xl border border-gray-100 bg-white shadow-sm capitalize text-sm">
                    {contact.subject}
                </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
                <p className="text-gray-400 text-xs uppercase tracking-widest">Message</p>
                <div className="px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm whitespace-pre-wrap max-h-60 overflow-auto text-sm">
                    {contact.message}
                </div>
            </div>

            {/* Admin Reply */}
            {reply && (
                <div className="pt-6 border-t border-gray-100 space-y-3 animate-fade-in">
                    <p className="text-blue-600 text-xs uppercase tracking-widest">Admin Reply</p>

                    <div className="px-4 py-3 rounded-xl border border-blue-100 bg-blue-50 shadow-sm whitespace-pre-wrap text-gray-800 text-sm">
                        {reply.message}
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 px-1">
                        <span className="font-medium">{responder?.name || "—"}</span>
                        <span className="capitalize">{responder?.role?.name || "—"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
