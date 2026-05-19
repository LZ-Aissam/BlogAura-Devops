import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { EMOJIS } from '../data/mockData'
import EmojiReactions from './EmojiReactions'
import CommentSection from './CommentSection'
import Modal from './Modal'

function PostCard({ post, comments, onToggleReaction, onAddComment }) {
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()

  // on recupere l'id du user connecte (ou null)
  const userId = user ? user.id : null
  // on filtre les commentaires de ce post
  const postComments = comments.filter(c => c.postId === post.id)

  // formater une date en francais
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // ouvrir la modale
  function ouvrirModal() {
    setShowModal(true)
  }

  // fermer la modale
  function fermerModal() {
    setShowModal(false)
  }

  return (
    <>
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* titre */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>

          {/* auteur + date */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Par {post.author_name} - {formatDate(post.createdAt)}
          </p>

          {/* apercu du contenu (5 lignes max) */}
          <div className="text-gray-700 dark:text-gray-300 line-clamp-5 mb-4">
            {post.text}
          </div>

          {/* bouton pour ouvrir la modale */}
          <button
            onClick={ouvrirModal}
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium mb-4 inline-block"
          >
            Lire la suite +
          </button>

          {/* les emojis */}
          <EmojiReactions
            reactions={post.reactions}
            onToggle={(emoji) => onToggleReaction(post.id, emoji, userId)}
            userId={userId}
          />

          {/* les commentaires */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <CommentSection
              comments={postComments}
              onAddComment={(text) => onAddComment(post.id, {
                id_user: user.id_user,
                userName: user.pseudo,
                text,
                createdAt: new Date().toISOString(),
              })}
              maxComments={5}
              showPagination
            />
          </div>
        </div>
      </article>

      {/* modale pour l'article complet */}
      <Modal isOpen={showModal} onClose={fermerModal} title={post.title}>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Par {post.author_name} - {formatDate(post.createdAt)}
        </p>
        {/* contenu complet */}
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6">
          {post.content}
        </div>

        <EmojiReactions
          reactions={post.reactions}
          onToggle={(emoji) => onToggleReaction(post.id, emoji, userId)}
          userId={userId}
        />

        {/* tous les commentaires dans la modale (pas de pagination) */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <CommentSection
            comments={postComments}
            onAddComment={(text) => onAddComment(post.id, {
              text
            })}
            showAll
          />
        </div>
      </Modal>
    </>
  )
}

export default PostCard
