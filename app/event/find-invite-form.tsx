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
import { findInviteByFullName } from "@/services/eventsService";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must not be empty",
  }),
});

type Props = {
  eventKey: string;
};

export function FindInviteForm(props: Props) {
  const { eventKey } = props;
  const router = useRouter();
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
    findInviteByFullName(eventKey, values.fullName).then((res) => {
      if (!res || !res.ok) {
        toast({
          title: "Invite Not Found",
          description:
            "Make sure you've entered your full name. If you're still having trouble, please contact the event organizer.",
          variant: "destructive",
          duration: 5000,
        });
        setButtonLoading(false);
      } else {
        router.push(`/invitation/${res.value.inviteKey}`);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-x-4 mb-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          {buttonLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Find Invitation"
          )}
        </Button>
      </form>
    </Form>
  );
}
