import Link from 'next/link';

const HomePage = () => (
  <div className="home-container">
    <h1>Welcome to Event Management</h1>

    <div className="button-container">
      <Link href="/events">
        View Events
      </Link>
      <div className="login-register">
        <Link href="/login">
          Login
        </Link>
        <Link href="/register">
          Register
        </Link>
      </div>
    </div>

    <style jsx>{`
      .home-container {
        text-align: center; // Center align the content
      }

      .button-container {
        display: flex;
        justify-content: space-between;
        padding: 20px;
      }

      .login-register {
        display: flex;
        gap: 10px;
      }
    `}</style>
  </div>
);

export default HomePage;
