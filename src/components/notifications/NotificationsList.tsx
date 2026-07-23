"use client";

import * as React from "react";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";

type Notif = {
  id: string;
  title: string;
  body: string;
  is_read: boolean | null;
  created_at: string | null;
};

export function NotificationsList({
  initial,
}: {
  initial: Notif[];
}) {
  const [items, setItems] = React.useState(initial);

  const markOne = async (id: string) => {
    await markNotificationReadAction(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAll = async () => {
    await markAllNotificationsReadAction();
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="rounded-xl" onClick={markAll}>
          Tout marquer lu
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">
          Aucune notification pour le moment.
        </p>
      )}
      {items.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => markOne(n.id)}
          className={`w-full text-left rounded-2xl border p-4 transition-colors ${
            n.is_read
              ? "border-border/50 bg-background"
              : "border-accent/40 bg-accent/5"
          }`}
        >
          <p className="font-serif font-bold text-base">{n.title}</p>
          <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
          {n.created_at && (
            <p className="text-[11px] text-muted-foreground mt-2">
              {new Date(n.created_at).toLocaleString("fr-FR")}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
