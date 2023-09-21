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
import { FieldErrors, useForm } from "react-hook-form";
import {
  Invite,
  addInviteToEvent,
  updateInvite,
} from "@/services/eventsService";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { BaseSyntheticEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { InviteStatus } from "@/shared/invite";

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
    contactNumber: z.string().optional(),
  });
};

type Props = {
  invite: Invite;
  refetch: () => void;
};

const GetToastDescription = (inviteStatus: InviteStatus, attendees: number) => {
  return inviteStatus === "confirmed"
    ? `Invite confirmed for ${attendees} attendees.`
    : "Invite declined.";
};

const messagePlaceholder =
  "Write us a message about any considerations you may have such as your dietary requirements.";

export function ConfirmInviteForm(props: Props) {
  const { invite, refetch } = props;
  const [confirmed, setConfirmed] = useState(
    invite.inviteStatus === "confirmed"
  );
  const inviteStatus = useRef<InviteStatus>("none");
  const formSchema = createFormSchema(invite.maxAttendees);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...(invite.confirmedAttendees && {
      defaultValues: {
        attendees: invite.confirmedAttendees,
      },
    }),
    ...(invite.contactNumber && {
      defaultValues: {
        contactNumber: invite.contactNumber,
      },
    }),
  });

  const { toast } = useToast();

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    e?.preventDefault();
    updateInvite({
      key: invite.key,
      confirmedAttendees: inviteStatus.current ? values.attendees : null,
      message: values.message,
      isConfirmed: false,
      inviteStatus: inviteStatus.current,
      contactNumber: values.contactNumber,
    }).then((res) => {
      toast({
        description: GetToastDescription(
          inviteStatus.current,
          values.attendees
        ),
      });
      setConfirmed(true);
      refetch();
    });
  }

  function declineInvite() {
    updateInvite({
      key: invite.key,
      confirmedAttendees: null,
      isConfirmed: false,
      inviteStatus: "declined",
    }).then(() => {
      toast({
        description: GetToastDescription("declined", 0),
      });
      form.reset();
      setConfirmed(false);
      refetch();
    });
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
                    placeholder={`${
                      invite.confirmedAttendees ?? invite.maxAttendees
                    }`}
                    {...field}
                    type="number"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  You can confirm attendence for a maximum of{" "}
                  {invite.maxAttendees} people
                </FormDescription>
              </FormItem>
            )}
            disabled={confirmed}
          />
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder={"0400000000"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            disabled={confirmed}
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
                    placeholder={invite.message ?? messagePlaceholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            disabled={confirmed}
          />
        </div>
        <section className="flex gap-2">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 flex-1"
            disabled={confirmed}
            onClick={() => {
              inviteStatus.current = "confirmed";
            }}
          >
            Confirm
          </Button>
          {confirmed && (
            <Button
              type="button"
              variant={"outline"}
              className="flex-1"
              onClick={() => {
                setConfirmed(false);
              }}
            >
              Edit
            </Button>
          )}
          <Button
            type="button"
            variant={"outline"}
            className="flex-1"
            onClick={declineInvite}
          >
            Decline
          </Button>
        </section>
      </form>
    </Form>
  );
}
