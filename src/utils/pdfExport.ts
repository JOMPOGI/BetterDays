import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures a DOM element and downloads it as a PDF.
 * @param elementId The ID of the DOM element to capture.
 * @param filename The desired filename for the downloaded PDF (without .pdf).
 */
export async function downloadElementAsPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    // Capture the element as a high-resolution canvas
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      backgroundColor: '#000000', // Ensure dark theme background is preserved
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions based on A4 size, scaling the image to fit
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Scale image to fit the width of the PDF page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
