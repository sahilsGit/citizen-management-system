import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const querySchema = z.object({
  query: z.string().min(1, "Should at least be 1 character long"),
  attribute: z.string(),
});

interface SearchCitizenProps {
  querySetter: any;
}

const SearchCitizen = ({
  querySetter,
}: //   setStatus,
SearchCitizenProps) => {
  // Search form
  const form = useForm<z.infer<typeof querySchema>>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      query: "",
      attribute: "fn",
    },
  });

  const onSubmit = async (data: z.infer<typeof querySchema>) => {
    querySetter({ query: data.query, attribute: data.attribute });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex items-center justify-center space-x-5">
          <FormField
            control={form.control}
            name="query"
            render={({ field, fieldState }) => (
              <FormItem className="h-[45px]">
                <FormControl>
                  <Input
                    placeholder={"Enter Search Query"}
                    className={cn(
                      "h-[45px] w-[800px]",
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
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="attribute"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[45px] w-[200px]">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fn">First Name</SelectItem>
                      <SelectItem value="ln">Last Name</SelectItem>
                      <SelectItem value="dob">Date of Birth</SelectItem>
                      <SelectItem value="gd">Gender</SelectItem>
                      <SelectItem value="ad">Address</SelectItem>
                      <SelectItem value="ct">City</SelectItem>
                      <SelectItem value="st">State</SelectItem>
                      <SelectItem value="pin">Pincode</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="max-w-[100px] h-[45px] text-white w-full"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SearchCitizen;
