export default function UserProfile({ user }) {
  return (
    <div className="card profile-card">
      <div className="profile-header">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2 className="profile-name">{user.name || user.login}</h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-username"
          >
            @{user.login}
          </a>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          {user.location && (
            <p className="profile-location">📍 {user.location}</p>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <strong>{user.public_repos}</strong>
          <span>Repositories</span>
        </div>
        <div className="profile-stat">
          <strong>{user.followers}</strong>
          <span>Followers</span>
        </div>
        <div className="profile-stat">
          <strong>{user.following}</strong>
          <span>Following</span>
        </div>
      </div>
    </div>
  );
}
