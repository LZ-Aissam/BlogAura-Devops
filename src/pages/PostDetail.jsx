import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import EmojiReactions from '../components/EmojiReactions'
import CommentSection from '../components/CommentSection'

function PostDetail({ posts, comments, onToggleReaction, onAddComment }) {
  const { id } = useParams() // on recupere l'id depuis l'url
  const navigate = useNavigate()
  const { user } = useAuth()

  const userId = user ? user.id : null

  // on cherche le post par son id
  // attention: l'id de l'url c'est une string, faut le convertir en number
  const post = posts.find(p => p.id === parseInt(id))

  // si le post existe pas
  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Article non trouvé
        </h1>
        <p className="text-gray-500 mb-4">L'article que vous cherchez n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }
  // les commentaires du post
  const postComments = comments.filter(c => c.postId === post.id)

  // formater la date
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* bouton retour */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux articles
      </button>

      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">

          {/* titre */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* auteur + date */}
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Par {post.author} - {formatDate(post.createdAt)}
          </p>

          {/* contenu complet */}
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-lg leading-relaxed mb-8">
            {post.content}
          </div>

          {/* reactions */}
          <EmojiReactions
            reactions={post.reactions}
            onToggle={(emoji) => onToggleReaction(post.id, emoji, userId)}
            userId={userId}
          />

          {/* commentaires (tous, pas de pagination) */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <CommentSection
              comments={postComments}
              onAddComment={(content) => onAddComment(post.id, {
                userId: user.id,
                userName: user.name,
                content,
                createdAt: new Date().toISOString(),
              })}
              showAll
            />
          </div>
        </div>
      </article>
    </div>
  )
}

export default PostDetail
