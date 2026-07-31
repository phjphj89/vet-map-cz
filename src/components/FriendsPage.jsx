import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import friendsData from "../data/friends.json";

function FriendCard({ friend }) {
  const { language, t } = useLanguage();
  const tags = friend[`tags_${language}`] || [];
  const description = friend[`description_${language}`] || "";

  return (
    <div className="friend-card">
      <div className="friend-card-banner">
        {friend.logo_url && <img src={friend.logo_url} alt={friend.name} />}
      </div>
      <div className="friend-card-body">
        {tags.length > 0 && (
          <div className="friend-tags">
            {tags.map((tag) => (
              <span key={tag} className="friend-tag">{tag}</span>
            ))}
          </div>
        )}
        <h3>{friend.name}</h3>
        {description && <p className="friend-description">{description}</p>}
        {friend.website_url && (
          <a
            href={friend.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="friend-website-link"
          >
            {t.visitWebsite} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function FriendsPage() {
  const { t } = useLanguage();

  return (
    <div className="friends-page">
      <Link to="/" className="back-link">← {t.backToMap}</Link>
      <h2 className="friends-page-title">{t.friendsPageTitle}</h2>
      <p className="friends-page-intro">{t.friendsPageIntro}</p>

      {friendsData.length === 0 ? (
        <p className="friends-empty-state">{t.friendsEmptyState}</p>
      ) : (
        <div className="friends-grid">
          {friendsData.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
}
