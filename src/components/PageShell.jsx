import SiteHeader from "./SiteHeader.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageShell({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
