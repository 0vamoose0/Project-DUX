import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import QuotationDialog from "./quotaion-dialog";
import { useState } from "react";
import {
  ActionType,
  useQuotationOrderContext,
} from "@/contexts/quotationOrder";

const FormSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(1, "Please enter a company name"),
  abn: z.string().optional(),
  contact: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return /^[0-9]{10}$/.test(val);
        }
        return true;
      },
      {
        message: "Please enter a valid contact number",
        path: ["contact"],
      },
    ),
});

const QuotationForm = () => {
  const { state, dispatch } = useQuotationOrderContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: state.meta
      ? {
          projectId: state.meta.id,
          name: state.meta.name,
          abn: state.meta.abn,
          contact: state.meta.contact,
        }
      : undefined,
  });

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);

    dispatch({
      type: ActionType.UPDATE_META,
      payload: {
        id: data.projectId,
        name: data.name,
        abn: data.abn ?? "",
        contact: data.contact ?? "",
      },
    });

    setOpenDialog(true);
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-1/3">Create Order</Button>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle>One More Step</DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mx-5"
            >
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="abn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company ABN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter>
                <Button type="submit">Submit</Button>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
      <QuotationDialog
        isOpen={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
        }}
      />
    </>
  );
};

export default QuotationForm;
