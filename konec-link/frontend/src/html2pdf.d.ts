// src/html2pdf.d.ts
declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: { scale: number };
    pagebreak: { avoid: all };
    jsPDF?: { unit: string; format: string; orientation: string };
  }

  function html2pdf(): {
    from: (element: HTMLElement) => {
      set: (options: Html2PdfOptions) => {
        save: () => void;
      };
    };
  };

  export = html2pdf;
}
