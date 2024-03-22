import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const genderEnum = ["male", "female", "other", "prefer not to say"] as const;

// Citizen Schema
const citizenSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(genderEnum),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.coerce.number(),
});

// AddCitizen component
const AddCitizen = () => {
  const baseurl = import.meta.env.VITE_BASE_URL;
  const form = useForm<z.infer<typeof citizenSchema>>({
    resolver: zodResolver(citizenSchema),
  });

  // To reset the form
  const setClose = () => {
    form.reset();
  };

  // Adding citizen logic
  const onSubmit = async (data: z.infer<typeof citizenSchema>) => {
    console.log(data);

    const appendTime = data.dateOfBirth + "T00:00:00.000+00:00";

    data.dateOfBirth = appendTime;

    try {
      const response = await fetch(`${baseurl}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(data),
      });

      await response.json();

      window.location.reload();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <Dialog onOpenChange={setClose}>
      <DialogTrigger>
        <Button>Add Citizen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Meeting</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"First Name"}
                          className={cn(
                            "h-[45px]",
                            fieldState.error &&
                              " focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Last Name"}
                          className={cn(
                            "h-[45px]",
                            fieldState.error &&
                              " focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field, fieldState }) => (
                  <FormItem className="mt-3">
                    <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder={"eg. 24-05-2024"}
                        className={cn(
                          "h-[45px]",
                          fieldState.error &&
                            "focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field, fieldState }) => (
                  <FormItem className="mt-2">
                    <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"Enter Address"}
                        className={cn(
                          "h-[45px]",
                          fieldState.error &&
                            " focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex mt-2 justify-between gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Enter City"}
                          className={cn(
                            "h-[45px]",
                            fieldState.error &&
                              " focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={"Enter state"}
                          className={cn(
                            "h-[45px]",
                            fieldState.error &&
                              " focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-zinc-400 ring-red-400">
                        Pincode
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={"000000"}
                          className={cn(
                            "h-[45px]",
                            fieldState.error &&
                              " focus-visible:ring-red-500 border-red-500 focus-visible:border-none"
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              //   disabled={isLoading}
              className="bg-blue-500 h-[45px] hover:bg-blue-600 text-white mt-4 w-full"
            >
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCitizen;
