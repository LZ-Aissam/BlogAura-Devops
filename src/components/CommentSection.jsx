import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function CommentSection({ comments, onAddComment, maxComments = 5, showPagination = false, showAll = false }) {
  const { isAuthenticated, user } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  // calcul pagination
  const totalPages = Math.ceil(comments.length / maxComments)

  // les commentaires a afficher
  let displayedComments = []
  if (showAll) {
    displayedComments = comments
  } else {
    const debut = (currentPage - 1) * maxComments
    const fin = currentPage * maxComments
    displayedComments = comments.slice(debut, fin)
  }

  // quand on envoie un commentaire
 async function handleSubmit(e) {
    e.preventDefault()
    if (newComment.trim() && isAuthenticated) {
      onAddComment(newComment.trim())
      setNewComment('') // on vide le champ
      // console.log("commentaire envoyé:", newComment)
    }
  }

  // formater la date
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // page precedente
  function pagePrecedente() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // page suivante
  function pageSuivante() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Commentaires ({comments.length})
      </h3>

      {/* formulaire si connecte */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Envoyer
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
          Connectez-vous pour laisser un commentaire.
        </p>
      )}

      {/* liste des commentaires */}
      <div className="space-y-3">
        {displayedComments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Aucun commentaire pour le moment.
          </p>
        ) : (
          displayedComments.map(comment => (
            <div
              key={comment.id}
              className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {comment.userName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={pagePrecedente}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={pageSuivante}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

export default CommentSection
