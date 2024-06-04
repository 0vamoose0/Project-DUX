import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  IQuotationOrderState,
  useQuotationOrderContext,
} from "@/contexts/quotationOrder";

const FormSchema = z
  .object({
    type: z.enum(["fixed", "percentage"]),
    amount: z.string().min(1, "Please enter a discount amount"),
  })
  .refine(
    (data) => {
      if (data.type === "fixed") {
        try {
          parseFloat(data.amount);
          return true;
        } catch {
          return false;
        }
      }

      if (data.type === "percentage") {
        try {
          const amount = parseFloat(data.amount);
          return amount >= 0 && amount <= 100;
        } catch {
          return false;
        }
      }

      return true;
    },
    {
      message: "Please enter a valid discount amount",
      path: ["amount"],
    },
  );

const ActionButton: React.FC<{
  product?: IQuotationOrderState["products"][0];
}> = ({ product }) => {
  const { state, dispatch } = useQuotationOrderContext();

  const currentProduct = state.products.find((p) => p.id === product?.id);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(
      FormSchema.refine(
        (data) => {
          if (data.type === "fixed" && currentProduct) {
            const discount = parseFloat(data.amount);
            // make sure discount is smaller than the product price
            return discount < currentProduct[state.tier];
          }

          return true;
        },
        {
          message:
            "Please enter a discount amount smaller than the product price",
          path: ["amount"],
        },
      ),
    ),
    defaultValues: currentProduct?.discount
      ? {
          type: currentProduct.discount.type,
          amount: currentProduct.discount.value.toString(),
        }
      : {
          type: "fixed",
        },
  });

  const resetForm = () => {
    form.reset({
      type: "fixed",
    });
  };

  const handleRemoveProduct = () => {
    dispatch({
      type: "REMOVE_PRODUCT",
      payload: product!.id,
    });
  };

  const handleRemoveDiscount = () => {
    if (product) {
      dispatch({
        type: "UPDATE_PRODUCT",
        payload: {
          ...product,
          discount: undefined,
        },
      });
    } else {
      dispatch({
        type: "SET_GLOBAL_DISCOUNT",
        payload: undefined,
      });
    }

    resetForm();
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (product) {
      dispatch({
        type: "SET_PRODUCT_DISCOUNT",
        payload: {
          id: product.id,
          discount: {
            type: data.type as "fixed" | "percentage",
            value: parseFloat(data.amount),
          },
        },
      });
    } else {
      dispatch({
        type: "SET_GLOBAL_DISCOUNT",
        payload: {
          type: data.type as "fixed" | "percentage",
          value: parseFloat(data.amount),
        },
      });
    }
  };

  return (
    <div className="space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Tag className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Discount</h4>
              <p className="text-sm text-muted-foreground">
                {product
                  ? "Add a discount to this product"
                  : "Add a discount to all products"}
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-2"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-4">
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-2 h-8 text-left">
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="col-span-2 col-start-2 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-x-4">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input className="col-span-2 h-8" {...field} />
                      </FormControl>
                      <FormMessage className="col-span-2 col-start-2 text-xs" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3">
                  <div className="mt-2.5 col-span-3 text-right space-x-2.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveDiscount}
                    >
                      Clear
                    </Button>
                    <Button type="submit" size="sm">
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </PopoverContent>
      </Popover>
      {product && (
        <Button variant="destructive" size="icon" onClick={handleRemoveProduct}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ActionButton;
