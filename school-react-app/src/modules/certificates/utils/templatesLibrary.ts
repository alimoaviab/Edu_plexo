import { type TemplateType } from "../store/templateStore";

export interface PrebuiltTemplate {
  id: string;
  name: string;
  type: TemplateType;
  category: "Certificates" | "Fee Challans" | "Result Cards" | "Admission Forms" | "ID Cards";
  thumbnail?: string;
  themeColor: string;
  fabricData: any; // The JSON exported by fabric.js
}

const basicText = (text: string, top: number, left: number, fontSize = 16, fontFamily = "Inter", options: any = {}) => ({
  type: "textbox",
  text,
  top,
  left,
  fontSize,
  fontFamily,
  fill: "#333333",
  textAlign: "left",
  width: options.width || 400, // Textboxes need a width to wrap correctly
  styles: {}, // FabricJS requires this to be present for textbox serialization to avoid crashing in stylesToArray
  ...options,
});

const basicRect = (top: number, left: number, width: number, height: number, fill: string, options: any = {}) => ({
  type: "rect",
  top,
  left,
  width,
  height,
  fill,
  ...options,
});

const basicLine = (x1: number, y1: number, x2: number, y2: number, stroke: string, strokeWidth = 1, options: any = {}) => ({
  type: "line",
  x1,
  y1,
  x2,
  y2,
  stroke,
  strokeWidth,
  ...options,
});

// ==========================================
// CERTIFICATE GENERATOR (Landscape 842x595)
// ==========================================
const generateCertificate = (design: number) => {
  const w = 842;
  const h = 595;
  const objects = [];

  if (design === 1) { // Classic Gold
    objects.push(basicRect(0, 0, w, h, "#fffff8")); // Ivory bg
    objects.push(basicRect(20, 20, w - 40, h - 40, "transparent", { stroke: "#b8860b", strokeWidth: 4 })); // Outer gold
    objects.push(basicRect(28, 28, w - 56, h - 56, "transparent", { stroke: "#b8860b", strokeWidth: 1 })); // Inner gold
    objects.push(basicText("CERTIFICATE", 80, w/2, 48, "Playfair Display", { fill: "#1e3a8a", fontWeight: "bold", originX: "center" }));
    objects.push(basicText("OF ACHIEVEMENT", 135, w/2, 24, "Montserrat", { fill: "#b8860b", originX: "center", charSpacing: 200 }));
    objects.push(basicText("This is proudly presented to", 220, w/2, 16, "Libre Baskerville", { fill: "#666", originX: "center", fontStyle: "italic" }));
    objects.push(basicText("{{student_name}}", 270, w/2, 42, "Great Vibes", { fill: "#1e3a8a", originX: "center" }));
    objects.push(basicLine(200, 330, w-200, 330, "#b8860b"));
    objects.push(basicText("For outstanding performance in {{class_name}} during the {{academic_year}} academic year.", 360, w/2, 14, "Inter", { fill: "#444", originX: "center", textAlign: "center" }));
    objects.push(basicLine(120, 480, 280, 480, "#333"));
    objects.push(basicText("Principal", 495, 200, 14, "Montserrat", { originX: "center" }));
    objects.push(basicLine(w-280, 480, w-120, 480, "#333"));
    objects.push(basicText("Director", 495, w-200, 14, "Montserrat", { originX: "center" }));
    // Gold Seal Placeholder
    objects.push({ type: "circle", top: 430, left: w/2, radius: 40, fill: "#b8860b", originX: "center", originY: "center" });
    objects.push({ type: "circle", top: 430, left: w/2, radius: 32, fill: "transparent", stroke: "#fff", strokeWidth: 1, strokeDashArray: [2,2], originX: "center", originY: "center" });
  } 
  else if (design === 2) { // Modern Minimal
    objects.push(basicRect(0, 0, w, h, "#ffffff")); 
    objects.push(basicRect(0, 0, 15, h, "#3b82f6")); // Left blue accent bar
    objects.push(basicText("CERTIFICATE OF EXCELLENCE", 100, 100, 32, "Montserrat", { fill: "#1e293b", fontWeight: "bold" }));
    objects.push(basicText("AWARDED TO", 150, 100, 12, "Inter", { fill: "#64748b", fontWeight: "bold", charSpacing: 150 }));
    objects.push(basicText("{{student_name}}", 200, 100, 38, "Playfair Display", { fill: "#3b82f6", fontWeight: "bold" }));
    objects.push(basicText("For exceptional dedication and hard work in {{class_name}}.", 270, 100, 14, "Inter", { fill: "#475569" }));
    objects.push(basicText("Date: {{issue_date}}", 450, 100, 12, "Inter", { fill: "#94a3b8" }));
    objects.push(basicLine(w-250, 460, w-50, 460, "#cbd5e1"));
    objects.push(basicText("Authorized Signature", 475, w-150, 12, "Inter", { fill: "#64748b", originX: "center" }));
  }
  else if (design === 3) { // Royal Navy & Gold
    objects.push(basicRect(0, 0, w, h, "#0f172a")); // Navy bg
    objects.push(basicRect(20, 20, w - 40, h - 40, "transparent", { stroke: "#eab308", strokeWidth: 2 }));
    objects.push(basicText("Certificate of Merit", 120, w/2, 56, "Pinyon Script", { fill: "#fef08a", originX: "center" }));
    objects.push(basicText("This certifies that", 220, w/2, 16, "Merriweather", { fill: "#cbd5e1", originX: "center", fontStyle: "italic" }));
    objects.push(basicText("{{student_name}}", 280, w/2, 36, "Cinzel", { fill: "#ffffff", originX: "center", fontWeight: "bold" }));
    objects.push(basicLine(250, 335, w-250, 335, "#eab308"));
    objects.push(basicText("has successfully completed the requirements for {{class_name}}.", 360, w/2, 14, "Inter", { fill: "#cbd5e1", originX: "center" }));
  }
  else if (design === 4) { // Pastel Achievement
    objects.push(basicRect(0, 0, w, h, "#f0fdf4")); // Mint bg
    objects.push(basicRect(15, 15, w - 30, h - 30, "transparent", { stroke: "#4ade80", strokeWidth: 6, rx: 20, ry: 20 }));
    objects.push(basicText("SUPERSTAR AWARD", 80, w/2, 42, "Montserrat", { fill: "#166534", originX: "center", fontWeight: "900" }));
    objects.push(basicText("Presented to our brightest star", 150, w/2, 18, "Inter", { fill: "#15803d", originX: "center" }));
    objects.push(basicText("{{student_name}}", 220, w/2, 48, "Dancing Script", { fill: "#f59e0b", originX: "center", fontWeight: "bold" }));
    objects.push(basicText("For being awesome in {{class_name}}!", 320, w/2, 20, "Inter", { fill: "#166534", originX: "center" }));
    objects.push({ type: "circle", top: 420, left: w/2, radius: 45, fill: "#fcd34d", originX: "center", originY: "center" });
    objects.push(basicText("★", 420, w/2, 40, "Inter", { fill: "#d97706", originX: "center", originY: "center" }));
  }
  else if (design === 5) { // Islamic Geometric
    objects.push(basicRect(0, 0, w, h, "#fffbeb")); // Cream bg
    objects.push(basicRect(30, 30, w - 60, h - 60, "transparent", { stroke: "#065f46", strokeWidth: 8 }));
    objects.push(basicRect(40, 40, w - 80, h - 80, "transparent", { stroke: "#d97706", strokeWidth: 2 }));
    objects.push(basicText("بسم الله الرحمن الرحيم", 60, w/2, 24, "Noto Nastaliq Urdu", { fill: "#065f46", originX: "center" }));
    objects.push(basicText("CERTIFICATE OF COMPLETION", 120, w/2, 32, "Cinzel Decorative", { fill: "#065f46", originX: "center", fontWeight: "bold" }));
    objects.push(basicText("This honor is bestowed upon", 180, w/2, 16, "EB Garamond", { fill: "#444", originX: "center", fontStyle: "italic" }));
    objects.push(basicText("{{student_name}}", 240, w/2, 42, "Cormorant Garamond", { fill: "#b45309", originX: "center", fontWeight: "bold" }));
    objects.push(basicText("In recognition of dedicated studies at {{school_name}}.", 320, w/2, 18, "EB Garamond", { fill: "#065f46", originX: "center" }));
  }

  return { version: "5.3.0", objects };
};

// ==========================================
// FEE CHALLAN GENERATOR (Portrait 595x842)
// ==========================================
const generateFeeChallan = (design: number) => {
  const w = 595;
  const h = 842;
  const objects = [];
  
  if (design === 1) { // Bank-Style Triple Copy
    objects.push(basicRect(0, 0, w, h, "#ffffff"));
    const copyWidth = w / 3;
    const copies = ["Bank Copy", "School Copy", "Student Copy"];
    
    copies.forEach((copyName, i) => {
      const offsetX = i * copyWidth;
      if (i > 0) objects.push(basicLine(offsetX, 0, offsetX, h, "#cbd5e1", 1, { strokeDashArray: [5, 5] }));
      
      objects.push(basicRect(20, offsetX + 10, copyWidth - 20, 40, "#1e293b"));
      objects.push(basicText(copyName, 30, offsetX + copyWidth/2, 12, "Montserrat", { fill: "#fff", originX: "center", fontWeight: "bold" }));
      
      objects.push(basicText("{{school_name}}", 75, offsetX + copyWidth/2, 11, "Inter", { originX: "center", fontWeight: "bold" }));
      objects.push(basicText("Name: {{student_name}}", 110, offsetX + 15, 10, "Inter"));
      objects.push(basicText("Class: {{class_name}}", 130, offsetX + 15, 10, "Inter"));
      objects.push(basicText("Reg: {{registration_no}}", 150, offsetX + 15, 10, "Inter"));
      objects.push(basicText("Due Date: {{issue_date}}", 170, offsetX + 15, 10, "Inter"));
      
      objects.push(basicRect(200, offsetX + 10, copyWidth - 20, 20, "#f1f5f9"));
      objects.push(basicText("Description", 205, offsetX + 20, 9, "Inter", { fontWeight: "bold" }));
      objects.push(basicText("Amount", 205, offsetX + copyWidth - 20, 9, "Inter", { fontWeight: "bold", originX: "right" }));
      
      objects.push(basicText("Tuition Fee", 235, offsetX + 20, 9, "Inter"));
      objects.push(basicText("{{fee_amount}}", 235, offsetX + copyWidth - 20, 9, "Inter", { originX: "right" }));
      
      objects.push(basicLine(offsetX + 10, 300, offsetX + copyWidth - 10, 300, "#333", 1));
      objects.push(basicText("Total", 310, offsetX + 20, 10, "Inter", { fontWeight: "bold" }));
      objects.push(basicText("{{fee_amount}}", 310, offsetX + copyWidth - 20, 10, "Inter", { originX: "right", fontWeight: "bold" }));
    });
  }
  else if (design === 2) { // Color-Coded Copies
    objects.push(basicRect(0, 0, w, h, "#ffffff"));
    const copyHeight = h / 3;
    const colors = ["#2563eb", "#16a34a", "#ea580c"];
    const labels = ["Bank Copy", "School Copy", "Student Copy"];
    
    colors.forEach((color, i) => {
      const offsetY = i * copyHeight;
      if (i > 0) objects.push(basicLine(0, offsetY, w, offsetY, "#cbd5e1", 1, { strokeDashArray: [5, 5] }));
      
      objects.push(basicRect(20, 20 + offsetY, w - 40, 30, color));
      objects.push(basicText(labels[i], 28 + offsetY, 40, 12, "Montserrat", { fill: "#fff", fontWeight: "bold" }));
      
      objects.push(basicText("{{student_name}}", 70 + offsetY, 40, 16, "Inter", { fontWeight: "bold" }));
      objects.push(basicText("Class: {{class_name}} | Reg: {{registration_no}}", 95 + offsetY, 40, 10, "Inter", { fill: "#475569" }));
      
      objects.push(basicRect(130 + offsetY, 40, w - 80, 40, "#f8fafc", { stroke: "#e2e8f0", strokeWidth: 1 }));
      objects.push(basicText("Total Fee Due", 143 + offsetY, 60, 12, "Inter", { fontWeight: "bold" }));
      objects.push(basicText("{{fee_amount}}", 143 + offsetY, w - 60, 14, "Inter", { originX: "right", fontWeight: "bold", fill: color }));
    });
  }
  else if (design === 3 || design === 4 || design === 5) {
    // simplified generic challan for remaining
    objects.push(basicRect(0, 0, w, h, "#ffffff"));
    objects.push(basicRect(40, 40, w - 80, h - 80, "transparent", { stroke: "#0f172a", strokeWidth: 2 }));
    objects.push(basicText("{{school_name}}", 80, w/2, 24, "Montserrat", { originX: "center", fontWeight: "bold" }));
    objects.push(basicText("FEE INVOICE", 120, w/2, 14, "Inter", { originX: "center", fill: "#64748b", charSpacing: 100 }));
    
    objects.push(basicText("Student: {{student_name}}", 200, 80, 12, "Inter"));
    objects.push(basicText("Class: {{class_name}}", 230, 80, 12, "Inter"));
    objects.push(basicText("Reg No: {{registration_no}}", 260, 80, 12, "Inter"));
    
    objects.push(basicRect(80, 320, w - 160, 30, "#0f172a"));
    objects.push(basicText("Particulars", 328, 100, 11, "Inter", { fill: "#fff", fontWeight: "bold" }));
    objects.push(basicText("Amount", 328, w - 100, 11, "Inter", { fill: "#fff", fontWeight: "bold", originX: "right" }));
    
    objects.push(basicText("Tuition Fee", 370, 100, 11, "Inter"));
    objects.push(basicText("{{fee_amount}}", 370, w - 100, 11, "Inter", { originX: "right" }));
    
    objects.push(basicLine(80, 420, w - 80, 420, "#0f172a", 2));
    objects.push(basicText("Total Due", 440, 100, 14, "Montserrat", { fontWeight: "bold" }));
    objects.push(basicText("{{fee_amount}}", 440, w - 100, 14, "Montserrat", { originX: "right", fontWeight: "bold" }));
  }

  return { version: "5.3.0", objects };
};

// ==========================================
// RESULT CARD GENERATOR (Portrait 595x842)
// ==========================================
const generateResultCard = (design: number) => {
  const w = 595;
  const h = 842;
  const objects = [];

  objects.push(basicRect(0, 0, w, h, "#ffffff"));
  
  if (design === 1) { // Traditional Report Card
    objects.push(basicRect(20, 20, w - 40, h - 40, "transparent", { stroke: "#334155", strokeWidth: 4, strokeDashArray: [10, 5] }));
    objects.push(basicText("{{school_name}}", 60, w/2, 28, "Playfair Display", { originX: "center", fontWeight: "bold" }));
    objects.push(basicText("ACADEMIC REPORT CARD", 100, w/2, 14, "Inter", { originX: "center", charSpacing: 100 }));
    
    objects.push(basicText("Name: {{student_name}}", 160, 60, 12, "Inter"));
    objects.push(basicText("Class: {{class_name}}", 180, 60, 12, "Inter"));
    objects.push(basicText("Year: {{academic_year}}", 160, w - 60, 12, "Inter", { originX: "right" }));
    
    // Grades Table
    objects.push(basicRect(60, 230, w - 120, 25, "#e2e8f0"));
    objects.push(basicText("Subject", 236, 80, 11, "Inter", { fontWeight: "bold" }));
    objects.push(basicText("Marks", 236, w - 80, 11, "Inter", { originX: "right", fontWeight: "bold" }));
    
    objects.push(basicText("Mathematics", 270, 80, 11, "Inter"));
    objects.push(basicText("95/100", 270, w - 80, 11, "Inter", { originX: "right" }));
    objects.push(basicText("English", 300, 80, 11, "Inter"));
    objects.push(basicText("88/100", 300, w - 80, 11, "Inter", { originX: "right" }));
    objects.push(basicText("Science", 330, 80, 11, "Inter"));
    objects.push(basicText("92/100", 330, w - 80, 11, "Inter", { originX: "right" }));
    
    objects.push(basicLine(60, 370, w - 60, 370, "#334155", 1));
    objects.push(basicText("Percentage: 91.6%", 390, 80, 14, "Inter", { fontWeight: "bold" }));
    objects.push(basicText("Grade: A+", 390, w - 80, 14, "Inter", { originX: "right", fontWeight: "bold" }));
  }
  else { // Modern Dashboard
    objects.push(basicRect(0, 0, w, 150, "#2563eb")); // Blue header
    objects.push(basicText("Student Progress Report", 50, 40, 24, "Montserrat", { fill: "#fff", fontWeight: "bold" }));
    objects.push(basicText("{{academic_year}}", 90, 40, 14, "Inter", { fill: "#bfdbfe" }));
    
    objects.push(basicRect(40, 120, w - 80, 100, "#ffffff", { rx: 12, ry: 12, stroke: "#e2e8f0", strokeWidth: 1 }));
    objects.push(basicText("{{student_name}}", 145, 60, 20, "Inter", { fontWeight: "bold" }));
    objects.push(basicText("{{class_name}}", 175, 60, 12, "Inter", { fill: "#64748b" }));
    
    objects.push(basicText("A+", 145, w - 60, 36, "Montserrat", { originX: "right", fill: "#16a34a", fontWeight: "900" }));
    
    objects.push(basicText("Performance Overview", 260, 40, 16, "Montserrat", { fontWeight: "bold" }));
    objects.push(basicRect(40, 290, w - 80, 8, "#f1f5f9", { rx: 4, ry: 4 }));
    objects.push(basicRect(40, 290, (w - 80) * 0.92, 8, "#16a34a", { rx: 4, ry: 4 }));
    objects.push(basicText("Science - 92%", 310, 40, 11, "Inter"));
  }

  return { version: "5.3.0", objects };
};

// ==========================================
// ADMISSION FORM GENERATOR (Portrait 595x842)
// ==========================================
const generateAdmissionForm = (design: number) => {
  const w = 595;
  const h = 842;
  const objects = [];

  objects.push(basicRect(0, 0, w, h, "#ffffff"));
  
  objects.push(basicText("{{school_name}}", 40, w/2, 22, "Montserrat", { originX: "center", fontWeight: "bold", fill: "#0f172a" }));
  objects.push(basicText("APPLICATION FOR ADMISSION", 75, w/2, 12, "Inter", { originX: "center", fontWeight: "bold", fill: "#64748b", charSpacing: 100 }));
  
  objects.push(basicRect(w - 120, 40, 80, 100, "transparent", { stroke: "#cbd5e1", strokeWidth: 1 }));
  objects.push(basicText("Photo", 85, w - 80, 10, "Inter", { originX: "center", fill: "#94a3b8" }));
  
  objects.push(basicRect(40, 130, w - 80, 25, "#f1f5f9"));
  objects.push(basicText("1. STUDENT DETAILS", 137, 50, 10, "Inter", { fontWeight: "bold" }));
  
  objects.push(basicText("Full Name", 175, 40, 10, "Inter", { fill: "#64748b" }));
  objects.push(basicLine(100, 185, w - 40, 185, "#cbd5e1"));
  
  objects.push(basicText("Date of Birth", 215, 40, 10, "Inter", { fill: "#64748b" }));
  objects.push(basicLine(120, 225, w/2 - 20, 225, "#cbd5e1"));
  
  objects.push(basicText("Gender", 215, w/2 + 20, 10, "Inter", { fill: "#64748b" }));
  objects.push(basicLine(w/2 + 70, 225, w - 40, 225, "#cbd5e1"));

  objects.push(basicRect(40, 260, w - 80, 25, "#f1f5f9"));
  objects.push(basicText("2. PARENT / GUARDIAN DETAILS", 267, 50, 10, "Inter", { fontWeight: "bold" }));
  
  objects.push(basicText("Father Name", 305, 40, 10, "Inter", { fill: "#64748b" }));
  objects.push(basicLine(120, 315, w - 40, 315, "#cbd5e1"));
  
  objects.push(basicText("Contact", 345, 40, 10, "Inter", { fill: "#64748b" }));
  objects.push(basicLine(100, 355, w/2 - 20, 355, "#cbd5e1"));

  return { version: "5.3.0", objects };
};

// ==========================================
// ID CARD GENERATOR (Portrait CR80 approx 320x500 rescaled to 638x1013 for crispness)
// ==========================================
const generateIDCard = (design: number) => {
  const w = 638;
  const h = 1013;
  const objects = [];

  objects.push(basicRect(0, 0, w, h, "#ffffff"));
  
  if (design === 1) { // Classic
    objects.push(basicRect(0, 0, w, 150, "#dc2626")); // Red header
    objects.push(basicText("{{school_name}}", 75, w/2, 28, "Montserrat", { fill: "#fff", originX: "center", fontWeight: "bold" }));
    
    // Photo Box
    objects.push(basicRect(180, w/2 - 120, 240, 300, "#f1f5f9", { stroke: "#cbd5e1", strokeWidth: 4 }));
    
    objects.push(basicText("{{student_name}}", 520, w/2, 42, "Inter", { originX: "center", fontWeight: "900", fill: "#0f172a" }));
    objects.push(basicText("{{class_name}}", 580, w/2, 24, "Inter", { originX: "center", fill: "#dc2626", fontWeight: "bold" }));
    
    objects.push(basicText("Reg: {{registration_no}}", 640, w/2, 20, "Inter", { originX: "center", fill: "#64748b" }));
    objects.push(basicText("DOB: 12-04-2015", 680, w/2, 20, "Inter", { originX: "center", fill: "#64748b" }));
    
    objects.push(basicRect(0, h - 80, w, 80, "#1e293b"));
    objects.push(basicText("VALID UNTIL: 2027", h - 50, w/2, 16, "Inter", { fill: "#fff", originX: "center", charSpacing: 100 }));
  }
  else { // Modern QR
    objects.push(basicRect(0, 0, w, h, "#0f172a")); // Dark bg
    objects.push({ type: "circle", top: -100, left: -100, radius: 300, fill: "#2563eb", opacity: 0.2 }); // decorative
    objects.push({ type: "circle", top: h, left: w, radius: 250, fill: "#c026d3", opacity: 0.2, originX: "center", originY: "center" }); 
    
    objects.push(basicText("STUDENT ID", 60, w/2, 24, "Inter", { fill: "#cbd5e1", originX: "center", charSpacing: 200 }));
    
    // Photo circle
    objects.push({ type: "circle", top: 150, left: w/2, radius: 120, fill: "#1e293b", stroke: "#3b82f6", strokeWidth: 6, originX: "center" });
    
    objects.push(basicText("{{student_name}}", 430, w/2, 42, "Montserrat", { fill: "#fff", originX: "center", fontWeight: "bold" }));
    objects.push(basicText("{{class_name}}", 490, w/2, 24, "Inter", { fill: "#94a3b8", originX: "center" }));
    
    objects.push(basicRect(w/2 - 100, 580, 200, 200, "#fff")); // QR placeholder
    objects.push(basicText("SCAN ME", 670, w/2, 16, "Inter", { originX: "center", fill: "#0f172a", fontWeight: "bold" }));
    
    objects.push(basicText("{{school_name}}", h - 60, w/2, 18, "Montserrat", { fill: "#cbd5e1", originX: "center" }));
  }

  return { version: "5.3.0", objects };
};


export const TEMPLATE_LIBRARY: PrebuiltTemplate[] = [
  // --- CERTIFICATES ---
  { id: "cert_01", name: "Classic Gold Certificate", type: "certificate", category: "Certificates", themeColor: "gold", fabricData: generateCertificate(1) },
  { id: "cert_02", name: "Modern Minimal Certificate", type: "certificate", category: "Certificates", themeColor: "slate", fabricData: generateCertificate(2) },
  { id: "cert_03", name: "Royal Navy & Gold Certificate", type: "certificate", category: "Certificates", themeColor: "navy", fabricData: generateCertificate(3) },
  { id: "cert_04", name: "Pastel Achievement", type: "certificate", category: "Certificates", themeColor: "teal", fabricData: generateCertificate(4) },
  { id: "cert_05", name: "Islamic Geometric Pattern", type: "certificate", category: "Certificates", themeColor: "emerald", fabricData: generateCertificate(5) },

  // --- FEE CHALLANS ---
  { id: "fee_01", name: "Bank-Style Triple Copy", type: "fee_challan", category: "Fee Challans", themeColor: "blue", fabricData: generateFeeChallan(1) },
  { id: "fee_02", name: "Color-Coded Copies", type: "fee_challan", category: "Fee Challans", themeColor: "indigo", fabricData: generateFeeChallan(2) },
  { id: "fee_03", name: "Compact Single-Column", type: "fee_challan", category: "Fee Challans", themeColor: "slate", fabricData: generateFeeChallan(3) },
  { id: "fee_04", name: "Detailed Fee Breakdown", type: "fee_challan", category: "Fee Challans", themeColor: "rose", fabricData: generateFeeChallan(4) },
  { id: "fee_05", name: "Branded Header Challan", type: "fee_challan", category: "Fee Challans", themeColor: "emerald", fabricData: generateFeeChallan(5) },

  // --- RESULT CARDS ---
  { id: "res_01", name: "Traditional Report Card", type: "result_card", category: "Result Cards", themeColor: "slate", fabricData: generateResultCard(1) },
  { id: "res_02", name: "Modern Grade Dashboard", type: "result_card", category: "Result Cards", themeColor: "blue", fabricData: generateResultCard(2) },
  { id: "res_03", name: "Term-wise Comparison", type: "result_card", category: "Result Cards", themeColor: "indigo", fabricData: generateResultCard(3) },
  { id: "res_04", name: "Minimal Percentage Card", type: "result_card", category: "Result Cards", themeColor: "purple", fabricData: generateResultCard(4) },
  { id: "res_05", name: "Illustrated Primary Result", type: "result_card", category: "Result Cards", themeColor: "rose", fabricData: generateResultCard(5) },

  // --- ADMISSION FORMS ---
  { id: "adm_01", name: "Standard Bordered Form", type: "admission_form", category: "Admission Forms", themeColor: "blue", fabricData: generateAdmissionForm(1) },
  { id: "adm_02", name: "Two-Column Compact Form", type: "admission_form", category: "Admission Forms", themeColor: "slate", fabricData: generateAdmissionForm(2) },
  { id: "adm_03", name: "Sectioned Form", type: "admission_form", category: "Admission Forms", themeColor: "indigo", fabricData: generateAdmissionForm(3) },
  { id: "adm_04", name: "Branded Letterhead Form", type: "admission_form", category: "Admission Forms", themeColor: "emerald", fabricData: generateAdmissionForm(4) },
  { id: "adm_05", name: "Digital-Style Form", type: "admission_form", category: "Admission Forms", themeColor: "purple", fabricData: generateAdmissionForm(5) },

  // --- ID CARDS ---
  { id: "id_01", name: "Classic School ID", type: "id_card", category: "ID Cards", themeColor: "red", fabricData: generateIDCard(1) },
  { id: "id_02", name: "Modern Card with QR", type: "id_card", category: "ID Cards", themeColor: "slate", fabricData: generateIDCard(2) },
  { id: "id_03", name: "Color-Coded by Class Level", type: "id_card", category: "ID Cards", themeColor: "green", fabricData: generateIDCard(3) },
  { id: "id_04", name: "Vertical Ribbon ID", type: "id_card", category: "ID Cards", themeColor: "blue", fabricData: generateIDCard(4) },
  { id: "id_05", name: "Premium Dark ID", type: "id_card", category: "ID Cards", themeColor: "indigo", fabricData: generateIDCard(5) },
];
