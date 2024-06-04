import {
  ActionType,
  useQuotationOrderContext,
} from "@/contexts/quotationOrder";
import { calculatePrice, formatPrice } from "@/lib/utils";
import ActionButton from "./quotation-card-action-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useEffect } from "react";

const MAX_QUANTITY = 30;

const QuotationCard: React.FC<{
  productId: string;
}> = ({ productId }) => {
  const { state, dispatch } = useQuotationOrderContext();

  const product = state.products.find((p) => p.id === productId);

  useEffect(() => {
    console.log("current product:", product);
  }, [product]);

  if (!product) {
    return null;
  }

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      return;
    }

    const quantity = parseInt(e.target.value, 10);
    if (quantity < 1) {
      return;
    }

    // setup quantity maxmium limit
    if (quantity > MAX_QUANTITY) {
      return;
    }

    dispatch({
      type: ActionType.UPDATE_PRODUCT,
      payload: {
        ...product,
        quantity,
      },
    });
  };

  const { hasDiscount, totalPrice } = calculatePrice(state, productId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{product.name}</CardTitle>
        <CardDescription className="text-xs">{product.sku}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div>
          <Input
            type="number"
            inputMode="numeric"
            pattern="\d*" // Only allow digits
            className="w-16 h-8"
            min={1}
            max={MAX_QUANTITY}
            value={product?.quantity}
            onChange={handleChangeQuantity}
          />
        </div>
        <p className="text-lg font-bold">
          {formatPrice(totalPrice)}{" "}
          {hasDiscount && (
            <span className="text-sm font-medium text-green-500">
              {product.discount?.type === "fixed"
                ? `-${formatPrice(product.discount!.value)}`
                : `-${product.discount?.value}%`}
            </span>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <ActionButton product={product} />
      </CardFooter>
    </Card>
  );
};

export default QuotationCard;
