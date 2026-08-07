const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const moves = [
  // Core
  ['App.tsx', 'app/App.tsx'],
  ['main.tsx', 'app/main.tsx'],
  ['context/BookingContext.tsx', 'app/providers/BookingContext.tsx'],
  
  // Data / Mock
  ['lib/mockDb.ts', 'data/mockDb.ts'],
  ['lib/supabase.ts', 'integrations/supabase/client.ts'],

  // Admin Features
  ['pages/Admin/Layout.tsx', 'app/layouts/AdminLayout.tsx'],
  ['pages/Admin/Layout.module.css', 'app/layouts/AdminLayout.module.css'],
  ['pages/Admin/Login.tsx', 'features/admin/authentication/Login.tsx'],
  ['pages/Admin/Login.module.css', 'features/admin/authentication/Login.module.css'],
  ['components/Admin/ProtectedRoute.tsx', 'features/admin/authentication/ProtectedRoute.tsx'],
  
  ['pages/Admin/Home.tsx', 'features/admin/dashboard/AdminDashboard.tsx'],
  ['pages/Admin/Home.module.css', 'features/admin/dashboard/AdminDashboard.module.css'],
  
  ['pages/Admin/Calendar.tsx', 'features/admin/calendar/Calendar.tsx'],
  ['pages/Admin/Calendar.module.css', 'features/admin/calendar/Calendar.module.css'],
  
  ['pages/Admin/Clients.tsx', 'features/admin/projects/ProjectsDashboard.tsx'],
  ['pages/Admin/Clients.module.css', 'features/admin/projects/ProjectsDashboard.module.css'],
  ['components/Admin/BookingDetailsDrawer.tsx', 'features/admin/projects/BookingDetailsDrawer.tsx'],
  ['components/Admin/BookingDetailsDrawer.module.css', 'features/admin/projects/BookingDetailsDrawer.module.css'],
  ['pages/Admin/PortfolioManager.tsx', 'features/admin/projects/PortfolioManager.tsx'],
  ['pages/Admin/PortfolioManager.module.css', 'features/admin/projects/PortfolioManager.module.css'],
  
  ['pages/Admin/Inquiries.tsx', 'features/admin/inquiries/InquiriesDashboard.tsx'],
  ['pages/Admin/Inquiries.module.css', 'features/admin/inquiries/InquiriesDashboard.module.css'],

  // Public Booking Flow
  ['pages/Book/BookingWizard.tsx', 'features/booking/BookingWizard.tsx'],
  ['pages/Book/BookingWizard.module.css', 'features/booking/BookingWizard.module.css'],
  ['pages/Book/Questionnaire.tsx', 'features/questionnaire/Questionnaire.tsx'],

  // Public Features / Components
  ['components/Navbar.tsx', 'components/navigation/Navbar.tsx'],
  ['components/Navbar.module.css', 'components/navigation/Navbar.module.css'],
  
  ['components/Footer.tsx', 'components/footer/Footer.tsx'],
  ['components/Footer.module.css', 'components/footer/Footer.module.css'],
  
  ['components/Hero.tsx', 'components/hero/Hero.tsx'],
  ['components/Hero.module.css', 'components/hero/Hero.module.css'],

  ['components/LogoIntroAnimation.tsx', 'components/shared/LogoIntroAnimation.tsx'],
  ['components/LogoIntroAnimation.module.css', 'components/shared/LogoIntroAnimation.module.css'],
  ['components/ThemeToggle.tsx', 'components/shared/ThemeToggle.tsx'],
  ['components/ThemeToggle.module.css', 'components/shared/ThemeToggle.module.css'],
  ['components/VisualShowcase.tsx', 'components/shared/VisualShowcase.tsx'],
  ['components/VisualShowcase.module.css', 'components/shared/VisualShowcase.module.css'],
  ['components/MediaLightbox.tsx', 'components/shared/MediaLightbox.tsx'],
  ['components/MediaLightbox.module.css', 'components/shared/MediaLightbox.module.css'],

  ['components/Philosophy.tsx', 'components/section/Philosophy.tsx'],
  ['components/Philosophy.module.css', 'components/section/Philosophy.module.css'],
  ['components/Portfolio.tsx', 'components/section/Portfolio.tsx'],
  ['components/Portfolio.module.css', 'components/section/Portfolio.module.css'],
  ['components/Process.tsx', 'components/section/Process.tsx'],
  ['components/Process.module.css', 'components/section/Process.module.css'],
  ['components/Services.tsx', 'components/section/Services.tsx'],
  ['components/Services.module.css', 'components/section/Services.module.css'],
  ['components/Testimonials.tsx', 'components/section/Testimonials.tsx'],
  ['components/Testimonials.module.css', 'components/section/Testimonials.module.css'],

  // Inquiries
  ['components/InquirySection.tsx', 'features/inquiries/InquirySection.tsx'],
  ['components/InquirySection.module.css', 'features/inquiries/InquirySection.module.css'],
  ['components/InquiryPanel.tsx', 'features/inquiries/InquiryPanel.tsx'],
  ['components/InquiryPanel.module.css', 'features/inquiries/InquiryPanel.module.css'],
  
  ['components/InquiryFlow/Step1Service.tsx', 'features/inquiries/flow/Step1Service.tsx'],
  ['components/InquiryFlow/Step1Service.module.css', 'features/inquiries/flow/Step1Service.module.css'],
  ['components/InquiryFlow/Step2Date.tsx', 'features/inquiries/flow/Step2Date.tsx'],
  ['components/InquiryFlow/Step2Date.module.css', 'features/inquiries/flow/Step2Date.module.css'],
  ['components/InquiryFlow/Step3Details.tsx', 'features/inquiries/flow/Step3Details.tsx'],
  ['components/InquiryFlow/Step3Details.module.css', 'features/inquiries/flow/Step3Details.module.css'],
  ['components/InquiryFlow/Step4Success.tsx', 'features/inquiries/flow/Step4Success.tsx'],
  ['components/InquiryFlow/Step4Success.module.css', 'features/inquiries/flow/Step4Success.module.css'],
  
  // Styles
  ['index.css', 'styles/globals.css']
];

moves.forEach(([oldPath, newPath]) => {
  const oldFull = path.join(srcDir, oldPath);
  const newFull = path.join(srcDir, newPath);
  if (fs.existsSync(oldFull)) {
    // ensure dir exists
    const dir = path.dirname(newFull);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.renameSync(oldFull, newFull);
    console.log(`Moved ${oldPath} to ${newPath}`);
  }
});

// Also remove App.css as it's not used
if (fs.existsSync(path.join(srcDir, 'App.css'))) {
  fs.unlinkSync(path.join(srcDir, 'App.css'));
  console.log('Deleted App.css');
}

console.log('Refactor script complete.');
