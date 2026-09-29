import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state page-empty">
      <span className="kicker">SHOPIN</span>
      <h2>That page took a wrong turn.</h2>
      <p>The page you requested does not exist.</p>
      <Link className="btn btn-primary" href="/">
        Back to Shopin
      </Link>
    </div>
  );
}
