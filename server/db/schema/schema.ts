import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const event = pgTable(
  "event",
  {
    id: serial("id").primaryKey(),
    key: uuid("key").defaultRandom().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    dateCreated: timestamp("date_created").defaultNow(),
    contactFullName: text("contact_fullname").notNull(),
    contactNumber: text("contact_number").notNull(),
  },
  (table) => {
    return {
      eventKeyIdx: uniqueIndex("event_key_idx").on(table.key),
    };
  }
);

export const invite = pgTable(
  "invite",
  {
    id: serial("id").primaryKey(),
    key: uuid("key").defaultRandom().notNull(),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id),
    ownerFullname: text("owner_fullname").notNull(),
    maxAttendees: integer("max_attendees").notNull(),
    confirmedAttendees: integer("confirmed_attendees"),
    isConfirmed: boolean("is_confirmed"),
  },
  (table) => {
    return {
      eventKeyIdx: uniqueIndex("invite_key_idx").on(table.key),
    };
  }
);

export const inviteRelations = relations(invite, ({ one }) => ({
  event: one(event, {
    fields: [invite.eventId],
    references: [event.id],
  }),
}));

export const eventRelations = relations(event, ({many}) => ({
  invites: many(invite)
}))
