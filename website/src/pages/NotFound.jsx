import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-notfound">
      <div className="container notfound-inner">
        <div className="notfound-code">404</div>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
