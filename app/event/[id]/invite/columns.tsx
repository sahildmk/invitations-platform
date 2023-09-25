"use client";

import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/lib/utils";
import { Invite } from "@/services/eventsService";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, CircleDashed, X } from "lucide-react";
import Link from "next/link";

type InviteWithoutEvent = Omit<Invite, "event">;

export const columns: ColumnDef<InviteWithoutEvent>[] = [
  {
    accessorKey: "ownerFullname",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          Name
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-2 py-0 px-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </span>
      );
    },
    cell({ row }) {
      const invite = row.original;
      return (
        <Link href={`/invitation/${invite.key}`}>
          {toTitleCase(invite.ownerFullname)}
        </Link>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "confirmedAttendees",
    header: "Confirmed Attendees",
  },
  {
    accessorKey: "maxAttendees",
    header: "Max Attendees",
  },
  {
    accessorKey: "inviteStatus",
    header: ({ column }) => {
      return (
        <span className="flex items-center">
          Invite Status
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-2 py-0 px-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </span>
      );
    },
    cell({ row }) {
      let icon = <CircleDashed className="w-5 h-5 text-neutral-400" />;
      switch (row.original.inviteStatus) {
        case "confirmed":
          icon = <Check className="w-5 h-5 text-green-500" />;
          break;
        case "declined":
          icon = <X className="w-5 h-5 text-destructive" />;
          break;
      }

      return <div className="flex justify-center">{icon}</div>;
    },
  },
];
