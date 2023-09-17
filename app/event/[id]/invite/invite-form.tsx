"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { addInviteToEvent } from "@/services/eventsService";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must not be empty",
  }),
  maxAttendees: z.number().min(1, {
    message: "Must have at least one attendee",
  }),
});

export function AddInviteForm(props: { eventKey: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    addInviteToEvent({
      eventKey: props.eventKey,
      ownerFullName: values.fullName,
      maxAttendees: values.maxAttendees,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex space-x-4 mb-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
                {/* <FormDescription>Invitation addressee</FormDescription> */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxAttendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Attendees</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Maximum attendees"
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Add Invitation</Button>
      </form>
    </Form>
  );
}
