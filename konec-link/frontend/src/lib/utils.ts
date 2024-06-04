import { IQuotationOrderState } from "@/contexts/quotationOrder";
import imgToBase64 from "@/imgToBase64";
import { clsx, type ClassValue } from "clsx";
import html2pdf from "html2pdf.js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "AUD" | "USD";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { currency = "AUD", notation = "standard" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

const imagePlaceholder =
  "https://t4.ftcdn.net/jpg/03/76/40/81/360_F_376408140_kiazgwOvkEy0e50oxgF5kllIl7j2q1SQ.jpg";

export const transformImageUrl = (
  url: string | null | undefined,
  width: number,
  height: number,
) => {
  if (!url) return imagePlaceholder;
  return `${url}?w=${width}&h=${height}`;
};

export const calculatePrice = (
  state: IQuotationOrderState,
  productId: string,
) => {
  const product = state.products.find((p) => p.id === productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const hasDiscount = !!product?.discount;

  const price = product[state.tier];

  const totalPrice = hasDiscount
    ? product.discount?.type === "fixed"
      ? price * product.quantity - product.discount.value
      : price * product.quantity * (1 - product.discount!.value / 100)
    : price * product.quantity;

  return {
    hasDiscount,
    totalPrice,
  };
};

export const handleSaveAsPDF = async (name: string, content: HTMLElement) => {
  const element = content;
  console.log("Saving...");
  // const element = document.getElementById("invoice-content");
  if (!element) {
    console.log("No content found.");
    return;
  }

  // images -> base64
  const images = Array.from(element.getElementsByTagName("img"));
  await Promise.all(
    images.map(async (img) => {
      const base64 = await imgToBase64(img.src);
      img.src = base64;
    }),
  );

  const opt = {
    margin: 10,
    filename: name,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 3 },
    pagebreak: { before: ".newPage", avoid: ["tr", "td", "th"] },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(opt).save();
};
