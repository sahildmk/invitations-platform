"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addInviteToEvent } from "@/services/eventsService";
import { Loader2 } from "lucide-react";
import { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must not be empty",
  }),
  maxAttendees: z
    .number()
    .min(1, {
      message: "Must have at least one attendee",
    })
    .max(10, {
      message: "Cannot have more than 10 attendees",
    }),
});

type Props = {
  eventKey: string;
  refetch: () => void;
};

export function AddInviteForm(props: Props) {
  const { eventKey, refetch } = props;
  const [buttonLoading, setButtonLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const { toast } = useToast();

  function onSubmit(
    values: z.infer<typeof formSchema>,
    e: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    e?.preventDefault();
    setButtonLoading(true);
    addInviteToEvent({
      eventKey: eventKey,
      ownerFullName: values.fullName,
      maxAttendees: values.maxAttendees,
    }).then(() => {
      toast({
        description: `Invite added for ${values.fullName}`,
      });
      form.reset();
      form.resetField("maxAttendees");
      refetch();
      setButtonLoading(false);
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
        <Button type="submit">
          {buttonLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Add Invitation"
          )}
        </Button>
      </form>
    </Form>
  );
}
