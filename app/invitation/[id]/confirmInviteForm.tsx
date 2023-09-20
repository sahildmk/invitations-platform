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
import { BaseSyntheticEvent, useRef } from "react";
import { useRouter } from "next/router";

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

type Props = {
  invite: Invite;
  refetch: () => void;
};

const GetToastDescription = (isConfirmed: boolean, attendees: number) => {
  return isConfirmed
    ? `Invite confirmed for ${attendees} attendees.`
    : "Invite declined.";
};

export function ConfirmInviteForm(props: Props) {
  const { invite, refetch } = props;

  const isConfirmed = useRef(false);
  const formSchema = createFormSchema(invite.maxAttendees);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...(invite.confirmedAttendees && {
      defaultValues: {
        attendees: invite.confirmedAttendees,
      },
    }),
  });

  const { toast } = useToast();

  function onValidSubmit(
    values: z.infer<typeof formSchema>,
    e: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    e?.preventDefault();
    updateInvite({
      key: invite.key,
      confirmedAttendees: isConfirmed.current ? values.attendees : null,
      message: values.message,
      isConfirmed: isConfirmed.current,
    }).then((res) => {
      toast({
        description: GetToastDescription(isConfirmed.current, values.attendees),
      });
      refetch();
    });
  }

  function onInvalidSubmit(
    errors: FieldErrors<{
      attendees: number;
      message?: string | undefined;
    }>,
    e: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    e?.preventDefault();

    if (isConfirmed.current) return;

    updateInvite({
      key: invite.key,
      confirmedAttendees: null,
      message: undefined,
      isConfirmed: isConfirmed.current,
    }).then((res) => {
      toast({
        description: GetToastDescription(isConfirmed.current, 0),
      });
      form.reset();

      refetch();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
        className="w-full"
      >
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
