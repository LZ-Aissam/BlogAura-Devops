import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import ProtectedRoute from './components/ProtectedRoute'
import { getPosts, getCommentsByPost, addPost, addComment, addReact, removeReact } from './api/dataBridge'
import { getMe } from './api/authService'

const user = await getMe() // on peut aussi le stocker dans un context pour le rendre accessible partout

function App() {
  // les states principaux de l'appli
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const apiPosts = await getPosts()
        const normalized = (apiPosts ?? []).map(p => ({
          id: p.id_post,
          title: p.title,
          text: p.text,
          reactions: p.reactions ?? {},
          id_user: p.id_user ?? null,
          createdAt: p.createdAt,
          _loadingDetails: true, // indique que les infos détaillées sont en cours
        }))

        // afficher les posts immédiatement
        setPosts(normalized)
        // puis charger les commentaires pour chaque post
        for (const post of normalized) {
          const apiComments = await getCommentsByPost(post.id)
          const postComments = (apiComments ?? []).map(c => ({
            id: c.id_comment,
            postId: c.id_post,
            text: c.text,
            id_user: c.id_user,
            userName: c.pseudo,
            createdAt: c.createdAt
          }))
          setComments(prev => [...prev, ...postComments])
        }
      } catch (e) {
        console.error("Erreur getCommentsByPost:", e)
      }
    }
load()}, [])
  // ajouter un nouveau post
  async function NewPost(newPost) {
    // on genere un id unique avec Date.now() et on met le post au debut
    const response = await addPost(newPost.title, newPost.text, user.id_user)
    const postAvecId = {
      ...newPost,
      id: response.id_post
    }
    
    setPosts(prev => [postAvecId, ...prev])
  }
  async function NewComment(postId, comment) {
    const nouveauCommentaire = {
      ...comment,
      id: Date.now(),
      postId: postId,
      userId: comment.userId,
    }
    await addComment(postId, comment.text)
    setComments(prev => [...prev, nouveauCommentaire])
  }

  // gerer les reactions emoji (toggle)
  // si l'user a deja reagit on retire, sinon on ajoute
async function toggleReaction(postId, emoji) {
  const userId = user?.id_user
  if (!userId) return
  // anciennes reactions du post
  const post = posts.find(p => p.id === postId)
  if (!post) return
  const reactions = post.reactions ?? {}

  let oldEmoji = null
  for (const [e, ids] of Object.entries(reactions)) {
    if ((ids ?? []).includes(userId)) {
      oldEmoji = e
      break
    }
  }
  const action = oldEmoji === emoji ? "remove" : "add"
  // une seule réaction par user
  setPosts(prev =>
    prev.map(p => {
      if (p.id !== postId) return p
      const next = { ...(p.reactions ?? {}) }
      if (oldEmoji && next[oldEmoji]) {
        const filtered = next[oldEmoji].filter(id => id !== userId)
        if (filtered.length === 0) delete next[oldEmoji]
        else next[oldEmoji] = filtered
      }
      if (action === "add") {
        const current = next[emoji] ?? []
        if (!current.includes(userId)) next[emoji] = [...current, userId]
      } // pas besoin de faire d'autre modif pour "remove" car on a déjà enlevé l'user de l'ancien emoji
      return { ...p, reactions: next }
    })
  )
    if (action === "add") {
      if(oldEmoji) await removeReact(postId, oldEmoji)
      await addReact(postId, emoji)
    } else { await removeReact(postId, emoji) }
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* page d'accueil */}
          <Route
            path="/"
            element={
              <Home
                posts={posts}
                comments={comments}
                onToggleReaction={toggleReaction}
                onAddComment={NewComment}
              />
            }
          />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          {/* page detail avec l'id en parametre */}
          <Route
            path="/post/:id"
            element={
              <PostDetail
                posts={posts}
                comments={comments}
                onToggleReaction={toggleReaction}
                onAddComment={NewComment}
              />
            }
          />

          {/* route protegee, faut etre admin */}
          <Route
            path="/create"
            element={
              <ProtectedRoute requireAdmin>
                <CreatePost onAddPost={NewPost} />
              </ProtectedRoute>
            }
          />

          {/* TODO: ajouter une page 404 */}
        </Routes>
      </main>

      {/* TODO: ajouter un footer ici */}
    </div>
  )
}

export default App
