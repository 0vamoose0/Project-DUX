import {
  IQuotationOrderState,
  useQuotationOrderContext,
} from "@/contexts/quotationOrder";
import {
  calculatePrice,
  formatPrice,
  handleSaveAsPDF,
  transformImageUrl,
} from "@/lib/utils";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import React from "react";

interface QuotationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuotationDialog: React.FC<QuotationDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { state } = useQuotationOrderContext();

  const { products, meta } = state;

  const totalPriceWithoutDisount = state.products.reduce((acc, product) => {
    const { totalPrice } = calculatePrice(state, product.id);
    return acc + totalPrice;
  }, 0);

  const hasGlobalDiscount = !!state.discount;

  const saveAsPDFFilter = (filename: string, excludePrice: boolean) => {
    console.log(excludePrice);
    const content = document.getElementById("invoice-content");
    if (!content) {
      console.log("PDF content not found.");
      return;
    }

    if (excludePrice) {
      console.log("Excluding price");
      const tempElements = content.cloneNode(true) as HTMLElement;
      const priceInfos = tempElements.querySelectorAll(
        "td:nth-child(3), th:nth-child(3)",
        // .total-price
      );
      priceInfos.forEach((el) => {
        el.remove();
      });
      handleSaveAsPDF(filename, tempElements);
    } else {
      handleSaveAsPDF(filename, content);
    }
  };
  const totalPriceWithDiscount = hasGlobalDiscount
    ? state.discount?.type === "fixed"
      ? totalPriceWithoutDisount - state.discount.value
      : totalPriceWithoutDisount * (1 - state.discount!.value / 100)
    : totalPriceWithoutDisount;

  // Group products by category
  const groupedProducts = products.reduce(
    (acc, product) => {
      // Get the category of the product or use a placeholder "Uncategorised"
      const category = product.level1Category || "Uncategorised";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, IQuotationOrderState["products"]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[95vh]">
        <div id="invoice-content">
          {/* Header: Issue Date, Logo */}
          <div className="border-b-2">
            <div className="grid grid-cols-2">
              <div className="">
                <h1 className="text-2xl flex">Quote</h1>
                <h1 className="text-left text-sm pt-3">
                  Issue Date: {new Date().toLocaleDateString()}
                </h1>
                <h1 className="text-left text-sm">Quote ID: 0xx98h6</h1>
              </div>
              <div className="flex ml-auto">
                <img
                  src="https://www.konechome.com.au/images/konec_black_logo.png"
                  className="w-48"
                />
              </div>
            </div>
          </div>

          {/* Info:  Supplier Info, Shipping Info, Billing Info*/}
          <div className="grid grid-cols-3 text-left pt-2">
            <div>
              <div className="text-sm">
                <p>Supplier: </p>
                <div className="text-xs">
                  <p>Konec Solutions Pty Ltd</p>
                  <p>Level 3, 5 Talavera Road,</p>
                  <p>Macquarie Park, NSW, 2113</p>
                  <p>ABN 41 642 206 835</p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm">
                <p>Quote To: </p>
                <div className="text-xs">
                  <p>{meta?.name}</p>
                  <p>{meta?.abn}</p>
                  <p>{meta?.contact}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm">
                <p>Project ID: </p>
                <div className="text-xs">
                  <p>{meta?.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Table: Item (product name and SKU), Unit Price, Unit Quantity, Total Price (Per product & Overall total) */}
          <div>
            <div className="overflow-auto">
              <Table>
                <TableHeader className="pb-3">
                  <TableRow className="font-bold text-xs">
                    <TableHead className="text-left">Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {Object.keys(groupedProducts).map((category) => (
                    <React.Fragment key={category}>
                      <TableRow className="">
                        <TableCell
                          colSpan={3}
                          className="font-semibold text-xs text-muted-foreground border-t-[2px] border-b-[2px] border-[#ffd500] outline-1 text-center p-2"
                        >
                          {category}
                        </TableCell>
                      </TableRow>

                      {groupedProducts[category].map((item) => (
                        <ProductRow key={item.id} product={item} />
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="font-extrabold text-right text-sm">
                    <TableCell colSpan={3} className="total-price">
                      Total Price: {formatPrice(totalPriceWithDiscount)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button
            variant={"default"}
            onClick={() => {
              saveAsPDFFilter("test.pdf", false);
            }}
          >
            Save Invoice as PDF
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              saveAsPDFFilter("item.pdf", true);
            }}
            className="ml-5"
          >
            Save Items as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProductRow: React.FC<{
  product: IQuotationOrderState["products"][0];
}> = ({ product }) => {
  const { state } = useQuotationOrderContext();
  const { totalPrice } = calculatePrice(state, product.id);

  return (
    <TableRow key={product.id} className="break-before-auto">
      <TableCell>
        <div className="grid grid-cols-[1fr_5fr]">
          <div className="flex justify-center items-center h-14 w-14 bg-gray-50 rounded-xl">
            <img
              src={transformImageUrl(product.image, 200, 200)}
              className="w-auto max-h-14 object-cover rounded-2xl"
              alt="Product"
            />
          </div>

          <div className="text-left max-w-80 ml-3 flex flex-col my-auto">
            <h1 className="text-sm text-wrap text-foreground">
              {product.name}
            </h1>
            <h1 className="mr-auto text-[0.65rem] text-muted-foreground">
              {product.sku}
            </h1>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right text-xs text-foreground">
        {product.quantity}
      </TableCell>
      <TableCell className="text-right text-xs text-foreground font-semibold">
        {formatPrice(totalPrice)}
      </TableCell>
    </TableRow>
  );
};

export default QuotationDialog;
