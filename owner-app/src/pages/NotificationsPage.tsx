import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Clock, Info, ShieldAlert, Award } from "lucide-react";
import { api } from "../lib/api";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data: any = await api.get("/owner/notifications");
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`); // endpoint to mark as read
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Alerts</h1>
          <p className="text-slate-400 text-sm mt-1">Platform events, subscriptions, and administrative updates</p>
        </div>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((n) => {
            const isRead = n.is_read || n.read;
            return (
              <div 
                key={n.ID || n._id} 
                className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start gap-4 transition-all ${
                  !isRead ? "border-l-4 border-l-indigo-500" : ""
                }`}
              >
                {/* Notification Icon */}
                <div className={`p-2.5 rounded-xl ${
                  n.type === "alert" || n.type === "error"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : n.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {n.type === "alert" || n.type === "error" ? (
                    <ShieldAlert size={20} />
                  ) : n.type === "success" ? (
                    <Award size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-sm font-semibold truncate ${!isRead ? "text-white" : "text-slate-300"}`}>
                      {n.title || "Platform Update"}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0 font-mono">
                      <Clock size={12} />
                      <span>{new Date(n.created_at || n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {n.message || n.content}
                  </p>

                  <div className="flex items-center justify-end gap-3 mt-3.5 pt-3.5 border-t border-slate-850">
                    {!isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.ID || n._id)}
                        className="text-[10px] bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold py-1.5 px-3 rounded-lg border border-slate-750 flex items-center gap-1 transition-all"
                      >
                        <Check size={12} />
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.ID || n._id)}
                      className="text-[10px] bg-slate-850 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-semibold py-1.5 px-3 rounded-lg border border-slate-750 flex items-center gap-1 transition-all"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Bell size={48} className="mx-auto mb-4 text-slate-600 animate-pulse" />
          <p className="text-lg font-semibold text-slate-400">All caught up!</p>
          <p className="text-sm mt-1">No system alerts or notification feeds found.</p>
        </div>
      )}
    </div>
  );
}
