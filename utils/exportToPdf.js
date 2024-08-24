import { jsPDF } from 'jspdf';

const exportToPDF = (meeting, agendaItems) => {
  const doc = new jsPDF();
  
  // Set font sizes
  const titleSize = 24;
  const headingSize = 18;
  const bodySize = 12;

  // Add title
  doc.setFontSize(titleSize);
  doc.setTextColor(99, 102, 241); // Indigo color
  doc.text(meeting?.name || "Meeting Agenda", 20, 20);

  // Add attribution
  doc.setFontSize(bodySize);
  doc.setTextColor(0, 0, 0);
  doc.textWithLink("Made with agenda.makr.io", 20, 30, { url: 'https://agenda.makr.io' });

  // Add agenda items
  doc.setFontSize(headingSize);
  doc.setTextColor(99, 102, 241);
  doc.text("Agenda Items", 20, 50);

  let yPos = 60;
  doc.setFontSize(bodySize);
  doc.setTextColor(0, 0, 0);

  agendaItems.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.title}`, 30, yPos);
    doc.text(`Duration: ${item.duration} minutes`, 40, yPos + 7);
    yPos += 20;
  });

  doc.save("meeting-agenda.pdf");
};

export default exportToPDF;