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
import {
  Invite,
  addInviteToEvent,
  updateInvite,
} from "@/services/eventsService";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

const createFormSchema = (maxAttendees: number) => {
  return z.object({
    attendees: z
      .number()
      .min(1, {
        message: "Must have at least one attendee",
      })
      .max(maxAttendees, {
        message: `Your maximum number of attendees is: ${maxAttendees}`,
      }),
    message: z.string().optional(),
  });
};

export function ConfirmInviteForm(props: { invite: Invite }) {
  const { invite } = props;
  const isConfirmed = useRef(false);
  const formSchema = createFormSchema(invite.maxAttendees);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendees: invite.confirmedAttendees ?? 0,
    },
  });

  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateInvite({
      key: invite.key,
      confirmedAttendees: values.attendees,
      message: values.message,
      isConfirmed: isConfirmed.current,
    }).then((res) => {
      toast({
        description: `Invite confirmed for ${values.attendees} attendees`,
      });
      form.reset();
    });
    // addInviteToEvent({
    //   eventKey: props.eventKey,
    //   ownerFullName: values.fullName,
    //   maxAttendees: values.maxAttendees,
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col space-y-2 mb-4">
          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Attendees</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${invite.maxAttendees}`}
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
                {/* <FormDescription>Invitation addressee</FormDescription> */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Write us a message about any considerations. Write down any dietary requirements you may have."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <section className="flex gap-2">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 flex-1"
            disabled={invite.isConfirmed}
            onClick={() => {
              isConfirmed.current = true;
            }}
          >
            Confirm
          </Button>
          <Button
            type="submit"
            variant={"outline"}
            className="flex-1"
            onClick={() => {
              isConfirmed.current = false;
            }}
          >
            Decline
          </Button>
        </section>
      </form>
    </Form>
  );
}
