import QuotationCard from "@/components/quotation-card";
import ActionButton from "@/components/quotation-card-action-button";
import QuotationForm from "@/components/quotation-form";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { QuotationProduct } from "@/contexts/quotationOrder"; // Import as type
import QuotationOrderContextProvider, {
  ActionType,
  initialQuotationOrderState,
  quotationOrderReducer,
} from "@/contexts/quotationOrder";
import { getProducts } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { useClickAway, useDebounce } from "react-use";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
export const Route = createLazyFileRoute("/_authenticated/orders")({
  component: () => <OrderPage />,
});

function OrderPage() {
  const [input, setInput] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [openSearchResults, setOpenSearchResults] = useState<boolean>(false);

  const [state, dispatch] = useReducer(
    quotationOrderReducer,
    initialQuotationOrderState,
  );

  const searchAreaRef = useRef<HTMLDivElement | null>(null);
  useClickAway(searchAreaRef, () => {
    setOpenSearchResults(false);
  });

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(input);
    },
    1500,
    [input],
  );

  const { data } = useQuery({
    queryKey: ["products", debouncedValue],
    queryFn: () => getProducts(debouncedValue),
    enabled: debouncedValue.length > 2,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (debouncedValue.length > 2) {
      setOpenSearchResults(true);
    }
  }, [debouncedValue]);

  const productsByCategory = state.products.reduce<
    Record<string, QuotationProduct[]>
  >((acc, product) => {
    const category = product.level1Category ?? "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <QuotationOrderContextProvider
      value={{
        state,
        dispatch,
      }}
    >
      <div className="flex items-center px-4 py-2">
        <img
          src="https://scontent.fsyd10-2.fna.fbcdn.net/v/t39.30808-6/304774234_446477850832418_2279625669640971962_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ilOJeDglMJkQ7kNvgHARnd4&_nc_ht=scontent.fsyd10-2.fna&oh=00_AYCz-zNTLK9YhU7Irre_3ihrWLbxr9Si8tpCWXT7Tb5hwQ&oe=6664BC65"
          className="h-12 max-[683px]:hidden rounded-md"
        />
        <h1 className="text-xl font-bold pl-2">
          Business Introduction:{" "}
          <span className="font-medium">Make your house Cleaner</span>
        </h1>
      </div>
      <Separator />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="bg-gray-100 pb-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold py-5">Dux Cleaning</h1>
          </div>
          <div className="grid grid-cols-[2fr_4fr]">
            <Carousel
              orientation="vertical"
              opts={{
                align: "start",
                loop: true,
              }}
              className="container bg-[#0000fe] rounded-md shadow-sm px-6 mt-14"
            >
              <h1 className="text-2xl font-bold mt-5 text-white flex">
                Our values and believes:
              </h1>
              <CarouselContent className="flex text-lg md:text-3xl h-64 text-white font-semibold italic mt-28">
                <CarouselItem>
                  <h1 className="pb-40 text-center">
                    "We are happy to communicate with customers as friends to
                    understand their ideas on cleaning their houses."
                  </h1>
                </CarouselItem>
                <CarouselItem>
                  <h1 className="pb-40 text-center">
                    "We work all year round and actively cooperate with
                    customers at convenient time to reduce the impact of
                    cleaning on normal life and work."
                  </h1>
                </CarouselItem>
                <CarouselItem>
                  <h1 className="pb-40 text-center">
                    "We are good at stubborn stains, well trained, and an
                    efficient team."
                  </h1>
                </CarouselItem>
                <CarouselItem>
                  <h1 className="pb-40 text-center">
                    "We have advanced and professional tools and mature
                    technology."
                  </h1>
                </CarouselItem>
                <CarouselItem>
                  <h1 className="pb-20 text-center">
                    "After the cleaning work is completed, it often gives
                    customers a bright surprise."
                  </h1>
                </CarouselItem>
              </CarouselContent>
              <img
                src="https://scontent.fsyd10-2.fna.fbcdn.net/v/t39.30808-6/304774234_446477850832418_2279625669640971962_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=ilOJeDglMJkQ7kNvgHARnd4&_nc_ht=scontent.fsyd10-2.fna&oh=00_AYCz-zNTLK9YhU7Irre_3ihrWLbxr9Si8tpCWXT7Tb5hwQ&oe=6664BC65"
                className="absolute h-12 max-[683px]:hidden rounded-md right-2 bottom-2"
              />
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <p className="text-lg container pt-14">
              DUX CLEANING SERVICES, founded in 2018, is a cleaning service
              company located in Sydney, Australia. Its business areas are
              mainly household daily cleaning, end-leased cleaning, professional
              steam carpet cleaning , office or shop commercial cleaning and
              household air-conditioning cleaning. DUX CLEANING focuses on
              serving customers in Sydney, and has won many praises for its
              professionalism, sense of responsibility and excellent sense of
              service. In four years, more than 3000 customers in Sydney have
              chosen DUX services. They include office workers who know how to
              enjoy life, young overseas students, capable housewives, kind
              retired elders, busy shop owners, professional real estate
              agents.….. We are happy to communicate with customers as friends
              to understand their ideas on cleaning their houses; We work all
              year round and actively cooperate with customers at convenient
              time to reduce the impact of cleaning on normal life and work; We
              are good at stubborn stains, well trained, and an efficient team.
              Usually three teams work at the same time, and the cleaning speed
              is particularly fast; We have advanced and professional tools and
              mature technology. Whether it is environmental friendly potions
              with various functions, brushes of various sizes, powerful
              high-pressure water guns or steam carpet cleaners, we will choose
              the best ones. After the cleaning work is completed, it often
              gives customers a bright surprise; We believe that we can provide
              each customer with a satisfactory cleaning service with our
              diligent and skillful hands, and how happy it is to get the
              approval of customers!
            </p>
          </div>
        </div>
        <ScrollArea
          className={cn(
            "absolute inset-x-0 top-1.5 text-sm text-muted-foreground border rounded-md shadow h-72 bg-background",
            openSearchResults ? "block" : "hidden",
          )}
          ref={searchAreaRef}
        >
          {data && (
            <div className="divide-y">
              {data.data.products.map((product) => (
                <button
                  key={product._id}
                  className="w-full flex items-center gap-4 p-2 min-h-14 hover:bg-muted hover:text-muted-foreground focus-within:outline-none focus-within:bg-muted focus-within:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    dispatch({
                      type: ActionType.ADD_PRODUCT,
                      payload: {
                        id: product._id as string,
                        name: product.name ?? "Unknown",
                        sku: product.sku ?? "Unknown",
                        image: product.image?.[0]?.asset?.url ?? undefined,
                        msrp: product.msrp ?? 0,
                        quantity: 1,
                        tier1: product.tier1Pricing ?? 0,
                        tier2: product.tier2Pricing ?? 0,
                        level1Category:
                          product.level1Category?.name ?? "Uncategorized",
                      },
                    });

                    setOpenSearchResults(false);
                  }}
                  disabled={!product.msrp}
                >
                  <div className="flex flex-col items-start">
                    <h3 className="text-sm font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>
                  <div className="ml-auto text-foreground">
                    <p>{product.msrp ? formatPrice(product.msrp) : "N/A"}</p>
                  </div>
                </button>
              ))}
              <div
                className={cn(
                  "flex gap-4 px-2 py-0.5 text-xs items-center justify-between bg-slate-800 text-muted",
                  data.data.products.length < 5 &&
                    "absolute bottom-0 inset-x-0",
                )}
              >
                <p>Total: {data.data.products.length}</p>
                <p>Time: {data.data.duration.toFixed(2)}ms</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      <div className="px-4">
        {Object.keys(productsByCategory).map((category) => (
          <div key={category} className="pt-4">
            <Badge variant="default" className="text-sm  py-0.5 mb-1">
              --- {category} ---
            </Badge>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsByCategory[category].map((product) => (
                <QuotationCard key={product.id} productId={product.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {state.products.length > 0 && (
        <div className="px-4 text-center mb-4">
          <Separator className="my-6" />
          <div className="mb-6">
            <ActionButton />
          </div>
          <QuotationForm />
        </div>
      )}
    </QuotationOrderContextProvider>
  );
}
