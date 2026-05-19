import { useState } from 'react'
import PostCard from '../components/PostCard'

function Home({ posts, comments, onToggleReaction, onAddComment }) {
  // le tag selectionne pour filtrer (null = tous)
  const [selectedTag, setSelectedTag] = useState(null)
  // filtrer les posts par tag
  let filteredPosts = posts || []
  if (selectedTag !== null) {
    filteredPosts = filteredPosts.filter(post => (post.tags ?? []).includes(selectedTag))
  }

  /* version avec ternaire (marche aussi):
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts
  */

  return (
    <div>
      {/* titre de la page */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Bienvenue sur BlogAura</h1>
        <p className="text-gray-600 dark:text-gray-400">Découvrez les derniers articles sur le développement web</p>
      </div>

      {/* grille des articles */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            comments={comments}
            onToggleReaction={onToggleReaction}
            onAddComment={onAddComment}
          />
        ))}
      </div>

      {/* message si aucun article */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun posts trouvé.
          </p>
        </div>
      )}
    </div>
  )
}

export default Home
