const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const map = {
  // old filename base -> new alias path
  'App': '@/app/App',
  'main': '@/app/main',
  'BookingContext': '@/app/providers/BookingContext',
  'mockDb': '@/data/mockDb',
  'supabase': '@/integrations/supabase/client',
  'AdminLayout': '@/app/layouts/AdminLayout',
  'Login': '@/features/admin/authentication/Login',
  'ProtectedRoute': '@/features/admin/authentication/ProtectedRoute',
  'AdminDashboard': '@/features/admin/dashboard/AdminDashboard',
  'Home': '@/features/admin/dashboard/AdminDashboard',
  'Calendar': '@/features/admin/calendar/Calendar',
  'ProjectsDashboard': '@/features/admin/projects/ProjectsDashboard',
  'Clients': '@/features/admin/projects/ProjectsDashboard',
  'BookingDetailsDrawer': '@/features/admin/projects/BookingDetailsDrawer',
  'PortfolioManager': '@/features/admin/projects/PortfolioManager',
  'InquiriesDashboard': '@/features/admin/inquiries/InquiriesDashboard',
  'Inquiries': '@/features/admin/inquiries/InquiriesDashboard',
  
  'BookingWizard': '@/features/booking/BookingWizard',
  'Questionnaire': '@/features/questionnaire/Questionnaire',
  
  'Navbar': '@/components/navigation/Navbar',
  'Footer': '@/components/footer/Footer',
  'Hero': '@/components/hero/Hero',
  'LogoIntroAnimation': '@/components/shared/LogoIntroAnimation',
  'ThemeToggle': '@/components/shared/ThemeToggle',
  'VisualShowcase': '@/components/shared/VisualShowcase',
  'MediaLightbox': '@/components/shared/MediaLightbox',
  
  'Philosophy': '@/components/section/Philosophy',
  'Portfolio': '@/components/section/Portfolio',
  'Process': '@/components/section/Process',
  'Services': '@/components/section/Services',
  'Testimonials': '@/components/section/Testimonials',

  'InquirySection': '@/features/inquiries/InquirySection',
  'InquiryPanel': '@/features/inquiries/InquiryPanel',
  'Step1Service': '@/features/inquiries/flow/Step1Service',
  'Step2Date': '@/features/inquiries/flow/Step2Date',
  'Step3Details': '@/features/inquiries/flow/Step3Details',
  'Step4Success': '@/features/inquiries/flow/Step4Success',
  
  'index.css': '@/styles/globals.css'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
files.push(path.join(__dirname, 'index.html')); // handle index.html

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Regex to match imports: import ... from 'some/path/Filename'
  // or import 'some/path/Filename.css'
  
  // Custom replacements
  let newContent = content.replace(/(import\s+.*?from\s+['"])(.*?)(['"])/g, (match, p1, p2, p3) => {
    const basename = path.basename(p2, path.extname(p2));
    if (map[basename]) {
      return `${p1}${map[basename]}${p3}`;
    }
    // Also handle relative css imports for modules
    if (p2.endsWith('.module.css')) {
       // if we just moved the file to the same place as the tsx, it's usually './Filename.module.css'
       // so if it was old relative, make it just './Filename.module.css'
       const baseCss = path.basename(p2);
       return `${p1}./${baseCss}${p3}`;
    }
    return match;
  });

  newContent = newContent.replace(/(import\s+['"])(.*?)(['"])/g, (match, p1, p2, p3) => {
     const basename = path.basename(p2, path.extname(p2));
     if (p2.includes('index.css')) {
       return `${p1}@/styles/globals.css${p3}`;
     }
     if (p2.includes('App.css')) {
       return ``; // removed
     }
     return match;
  });

  // handle index.html main.tsx reference
  if (file.endsWith('index.html')) {
    newContent = newContent.replace(/\/src\/main\.tsx/, '/src/app/main.tsx');
  }

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed imports in', file);
  }
});
