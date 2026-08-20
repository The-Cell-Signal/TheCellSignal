import Link from 'next/link';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-grid">
        <div>
          <img src="/wordmark-green.svg" alt="CZRO Bio" className="footer-logo" />
          <p className="footer-tag">
            Powered by nature, verified by science. Published by CZRO Bio &mdash; cultivating
            microalgae to turn CO2, waste and light into cleaner soil, water and energy.
          </p>
        </div>
        <div className="footer-col">
          <h4>Get in touch</h4>
          <a href="https://czrobio.com/contact/">Contact us</a>
          <a href="https://czrobio.com/contact/">Submit a story tip</a>
        </div>
        <div className="footer-col">
          <h4>About us</h4>
          <a href="https://czrobio.com/about/company/">Our company</a>
          <a href="https://czrobio.com/solutions/microalgae-farm/">Our solutions</a>
          <Link href="/newsletter">Newsletter</Link>
        </div>
        <div className="footer-col">
          <h4>Follow us</h4>
          <a href="https://ca.linkedin.com/company/czrobio">LinkedIn</a>
          <a href="https://www.youtube.com/@czrobio">YouTube</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Vancouver, Canada</span>
        <span>&copy; CZRO Bio {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
