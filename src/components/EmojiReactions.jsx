import { useAuth } from '../contexts/AuthContext'
import { EMOJIS } from '../data/mockData'

function EmojiReactions({ reactions, onToggle, userId }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-wrap gap-2">
      {EMOJIS.map(emoji => { 
        // compter le nombre de reactions pour cet emoji
        let count = 0
        if (reactions[emoji]) {
          count = reactions[emoji].length
        }

        // verifier si l'user a deja reagit avec cet emoji
        let hasReacted = false
        if (reactions[emoji] && userId) {
          hasReacted = reactions[emoji].includes(userId)
        }

        // determiner le style du bouton
        let btnStyle = 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'
        if (hasReacted) {
          btnStyle = 'bg-primary-100 dark:bg-primary-900 border-2 border-primary-500'
        }

        let cursorStyle = 'cursor-not-allowed opacity-70'
        if (isAuthenticated) {
          cursorStyle = 'hover:scale-110 cursor-pointer'
        }

        return (
          <button
            key={emoji}
            onClick={() => isAuthenticated && onToggle(emoji)}
            disabled={!isAuthenticated}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all ${btnStyle} ${cursorStyle}`}
            title={isAuthenticated ? 'Cliquer pour réagir' : 'Connectez-vous pour réagir'}
          >
            <span className="text-lg">{emoji}</span>
            {/* afficher le compteur seulement si > 0 */}
            {count > 0 && (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default EmojiReactions
