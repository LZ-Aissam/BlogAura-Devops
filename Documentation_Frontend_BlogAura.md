
# IV. Frontend - React

## A. Pourquoi cette technologie ?

Comme indiqué dans les choix de technologie, React nous était imposé pour la partie Front-End. C'est une bibliothèque JavaScript développée par Meta qui permet de créer des interfaces utilisateurs dynamiques grâce à un système de composants réutilisables.

Pour notre projet, nous avons décidé de travailler avec React en JSX (JavaScript XML) plutôt qu'en TypeScript, car on trouvait que c'était plus rapide pour développer et que la configuration était plus simple pour un projet de cette taille. On a aussi utilisé Vite comme outil de build car il est beaucoup plus rapide que Create React App et il est recommandé par la documentation officielle de React maintenant.

Pour le style, on est parti sur Tailwind CSS qui est un framework CSS utilitaire. Au lieu d'écrire des fichiers CSS séparés, on met les classes directement dans le HTML/JSX. Ca permet d'aller beaucoup plus vite et le design est cohérent sur toutes les pages.

Les dépendances principales du projet sont :
- **React 19** : La bibliothèque principale pour l'interface
- **React Router DOM 7** : Pour gérer la navigation entre les pages (routing côté client)
- **Tailwind CSS 4** : Pour le style de l'application
- **Vite 7** : L'outil de build et serveur de développement

## B. Architecture du projet

Voici l'arborescence des fichiers du Front-End :

```
BlogAura/
├── public/
│   └── Logo-Blogaura.png          # Logo du site
├── src/
│   ├── components/                 # Les composants réutilisables
│   │   ├── Navbar.jsx              # Barre de navigation
│   │   ├── PostCard.jsx            # Carte d'un article
│   │   ├── Modal.jsx               # Fenêtre modale
│   │   ├── EmojiReactions.jsx      # Boutons de réactions emoji
│   │   ├── CommentSection.jsx      # Section commentaires avec pagination
│   │   └── ProtectedRoute.jsx      # Protection des routes admin
│   ├── contexts/                   # Les contextes React (state global)
│   │   ├── AuthContext.jsx         # Gestion de l'authentification
│   │   └── ThemeContext.jsx        # Gestion du thème dark/light
│   ├── data/
│   │   └── mockData.js             # Données fictives pour tester sans backend
│   ├── pages/                      # Les pages de l'application
│   │   ├── Home.jsx                # Page d'accueil
│   │   ├── Login.jsx               # Page de connexion
│   │   ├── CreatePost.jsx          # Page de création d'article
│   │   ├── PostDetail.jsx          # Page de détail d'un article
│   │   └── About.jsx               # Page à propos
│   ├── App.jsx                     # Composant principal avec les routes
│   ├── main.jsx                    # Point d'entrée de l'application
│   └── index.css                   # Fichier CSS avec la config Tailwind
├── index.html                      # Page HTML principale
├── package.json                    # Dépendances et scripts
└── vite.config.js                  # Configuration de Vite
```

On a essayé de séparer le code de manière logique : les composants réutilisables dans `components/`, les pages dans `pages/`, les contextes pour le state global dans `contexts/` et les données de test dans `data/`. C'est une structure assez classique pour un projet React.

## C. Point d'entrée et Providers

Le fichier `main.jsx` est le point d'entrée de l'application. C'est lui qui rend l'application dans la page HTML.

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

L'ordre des Providers est important : on enveloppe l'application dans plusieurs couches (comme des poupées russes) :
1. **StrictMode** : Un outil de React qui aide à détecter les erreurs pendant le développement
2. **BrowserRouter** : Fournit le système de routing (navigation entre pages)
3. **ThemeProvider** : Fournit le thème dark/light à toute l'application
4. **AuthProvider** : Fournit les données d'authentification (utilisateur connecté)

Grâce à cette architecture, n'importe quel composant enfant peut accéder au thème ou à l'utilisateur connecté sans avoir besoin de passer les données en props à travers tous les composants.

## D. Le composant principal : App.jsx

Le fichier `App.jsx` est le composant racine de l'application. C'est lui qui gère le state principal et définit les routes.

**Les states principaux :**
- `posts` : La liste des articles du blog (initialisée avec les données mock)
- `comments` : La liste des commentaires (initialisée avec les données mock)

**Les fonctions principales :**
- `addPost(newPost)` : Ajoute un nouvel article en générant un id unique avec `Date.now()`
- `addComment(postId, comment)` : Ajoute un commentaire à un article
- `toggleReaction(postId, emoji, userId)` : Gère les réactions emoji en mode toggle (si l'utilisateur a déjà réagi, on retire sa réaction, sinon on l'ajoute)

**Les routes définies :**

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil avec la liste des articles |
| `/login` | Login | Page de connexion |
| `/about` | About | Page à propos de l'auteur |
| `/post/:id` | PostDetail | Détail d'un article (l'id est passé en paramètre d'URL) |
| `/create` | CreatePost | Création d'article (protégée, réservée aux admins) |

La route `/create` est protégée par le composant `ProtectedRoute` : si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion, et s'il n'est pas administrateur, il est redirigé vers l'accueil.

## E. Les pages

### 1. Page d'accueil (Home.jsx)

La page d'accueil affiche la liste de tous les articles avec un système de filtrage par tags.

**Fonctionnement :**
- Un state `selectedTag` stocke le tag sélectionné (ou `null` pour afficher tous les articles)
- On filtre les articles en vérifiant si le tag sélectionné est dans la liste des tags de chaque article
- Les articles sont affichés sous forme de grille responsive (1 colonne sur mobile, 2 colonnes sur grand écran)
- Un message est affiché si aucun article ne correspond au filtre

Les boutons de filtre sont générés dynamiquement à partir de la liste des tags définis dans le fichier `mockData.js`. Le bouton actif change de couleur pour indiquer le filtre en cours.

### 2. Page de connexion (Login.jsx)

La page de connexion présente un formulaire avec email et mot de passe.

**Fonctionnement :**
- Quand le formulaire est soumis, on appelle la fonction `login()` du AuthContext
- Si la connexion réussit, l'utilisateur est redirigé vers la page d'accueil
- Si elle échoue, un message d'erreur est affiché en rouge
- Les comptes de test sont affichés en bas du formulaire pour faciliter la démonstration

**Comptes de test disponibles :**
- Admin : admin@blog.com / admin123
- User : user@blog.com / user123

### 3. Page de création de post (CreatePost.jsx)

Cette page est uniquement accessible aux administrateurs grâce à la route protégée.

**Fonctionnement :**
- Un formulaire avec 3 champs : titre, sélection de tags et contenu
- Les tags sont sélectionnables en cliquant dessus (toggle : un clic sélectionne, un deuxième clic déselectionne)
- Le bouton "Publier" est désactivé tant que le titre et le contenu sont vides
- A la soumission, un objet post est créé avec les informations de l'utilisateur connecté, la date actuelle et les tags sélectionnés
- L'utilisateur est ensuite redirigé vers l'accueil ou il peut voir son article en premier

### 4. Page détail d'un article (PostDetail.jsx)

Cette page affiche un article dans son intégralité quand on clique dessus depuis une autre page.

**Fonctionnement :**
- L'id de l'article est récupéré depuis l'URL grâce au hook `useParams()` de React Router
- On cherche l'article correspondant dans la liste des posts
- Si l'article n'existe pas, on affiche un message "Article non trouvé" avec un lien de retour
- La page affiche : les tags, le titre, l'auteur, la date, le contenu complet, les réactions emoji et tous les commentaires (sans pagination)
- Un bouton "Retour aux articles" permet de revenir à l'accueil

### 5. Page à propos (About.jsx)

La page à propos affiche le profil de l'auteur du blog.

**Fonctionnement :**
- Les données viennent de `AUTHOR_INFO` dans le fichier mockData
- L'avatar est généré via l'API DiceBear (un service gratuit qui génère des avatars)
- La page affiche : une bannière avec un dégradé, l'avatar qui chevauche la bannière, le nom, le titre, des statistiques (articles, commentaires, followers), la bio et les liens vers les réseaux sociaux

## F. Les composants

### 1. Navbar (Navbar.jsx)

La barre de navigation est affichée en haut de toutes les pages. Elle est sticky (reste fixe en haut quand on scrolle).

**Éléments affichés :**
- Le logo BlogAura (qui est aussi un lien vers l'accueil)
- Les liens de navigation : Accueil, A propos
- Le lien "Nouveau Post" (visible uniquement si l'utilisateur est admin)
- Un bouton pour basculer entre le mode sombre et clair (icône soleil/lune)
- Le nom de l'utilisateur connecté avec un badge "Admin" si applicable, et un bouton de déconnexion
- Si non connecté : un bouton "Connexion"

### 2. PostCard (PostCard.jsx)

C'est le composant qui affiche un article sous forme de carte sur la page d'accueil.

**Éléments affichés :**
- Les tags de l'article avec des badges colorés
- Le titre de l'article
- L'auteur et la date de publication
- Un aperçu du contenu limité à 5 lignes (grâce à la classe CSS `line-clamp-5`)
- Un bouton "Lire la suite +" qui ouvre une modale avec le contenu complet
- Les réactions emoji (composant EmojiReactions)
- Les commentaires avec pagination par 5 (composant CommentSection)

Quand on ouvre la modale depuis une carte, on voit le contenu complet de l'article, les réactions et tous les commentaires sans pagination.

### 3. Modal (Modal.jsx)

Composant de modale réutilisable pour afficher du contenu par-dessus la page.

**Fonctionnalités :**
- S'ouvre et se ferme avec une prop `isOpen`
- Fond sombre semi-transparent en arrière-plan
- Clic sur le fond sombre pour fermer
- Touche Échap pour fermer
- Blocage du scroll de la page quand la modale est ouverte
- Bouton X en haut à droite pour fermer
- Contenu scrollable si trop long (hauteur max 70% de l'écran)
- Nettoyage des événements quand le composant se démonte (cleanup dans le useEffect)

### 4. EmojiReactions (EmojiReactions.jsx)

Composant qui affiche les boutons de réactions emoji sous chaque article.

**Fonctionnement :**
- Affiche 6 emojis : 👍 ❤️ 😂 😮 😢 🎉
- Chaque emoji affiche un compteur du nombre de réactions
- Si l'utilisateur est connecté et a déjà réagi avec un emoji, le bouton est mis en surbrillance (bordure colorée)
- Si l'utilisateur n'est pas connecté, les boutons sont désactivés et un message indique de se connecter
- Le système fonctionne en toggle : un clic ajoute la réaction, un deuxième clic la retire

### 5. CommentSection (CommentSection.jsx)

Composant qui affiche les commentaires et le formulaire pour en ajouter.

**Props :**
- `comments` : La liste des commentaires à afficher
- `onAddComment` : Fonction appelée quand un commentaire est envoyé
- `maxComments` : Nombre de commentaires par page (par défaut 5)
- `showPagination` : Affiche les boutons de pagination
- `showAll` : Affiche tous les commentaires sans pagination

**Fonctionnement :**
- Si l'utilisateur est connecté, un formulaire permet d'écrire et d'envoyer un commentaire
- Sinon, un message invite à se connecter
- La pagination permet de naviguer entre les pages de commentaires (5 par page)
- Chaque commentaire affiche : le nom de l'utilisateur, la date et le contenu
- Les boutons "Précédent" et "Suivant" sont désactivés quand on est en début ou fin de liste

### 6. ProtectedRoute (ProtectedRoute.jsx)

Composant qui protège l'accès à certaines routes.

**Fonctionnement :**
- Vérifie si l'utilisateur est connecté (via le AuthContext)
- Si pas connecté : redirige vers `/login`
- Si connecté mais pas admin (et que la route requiert les droits admin) : redirige vers `/`
- Si tout est bon : affiche le contenu enfant (la page protégée)

Utilisé pour la route `/create` qui n'est accessible qu'aux administrateurs.

## G. Gestion du state global (Context API)

### 1. AuthContext (AuthContext.jsx)

Le AuthContext gère tout ce qui concerne l'authentification des utilisateurs.

**Données fournies aux composants :**
- `user` : L'objet utilisateur connecté (ou null si déconnecté)
- `login(email, password)` : Fonction de connexion qui retourne `{ success: true }` ou `{ success: false, error: "message" }`
- `logout()` : Fonction de déconnexion
- `isAdmin` : Boolean qui indique si l'utilisateur est administrateur
- `isAuthenticated` : Boolean qui indique si l'utilisateur est connecté

**Persistance :**
- A la connexion, les données de l'utilisateur sont sauvegardées dans le `localStorage` du navigateur (sans le mot de passe pour des raisons de sécurité)
- Au chargement de la page, on vérifie si un utilisateur est stocké dans le localStorage et on le restaure automatiquement
- A la déconnexion, les données sont supprimées du localStorage

Actuellement l'authentification utilise des comptes en dur (mock) pour tester. Quand le backend sera connecté, il suffira de remplacer la vérification dans la fonction `login()` par un appel à l'API `ip/auth/login`.

### 2. ThemeContext (ThemeContext.jsx)

Le ThemeContext gère le basculement entre le mode sombre et le mode clair.

**Données fournies aux composants :**
- `isDark` : Boolean qui indique si le mode sombre est actif
- `toggleTheme()` : Fonction qui bascule entre les deux modes

**Fonctionnement :**
- Au chargement, on vérifie le localStorage. Si aucune préférence n'est sauvegardée, on utilise la préférence système de l'utilisateur (`prefers-color-scheme: dark`)
- Quand le thème change, on ajoute ou retire la classe `dark` sur l'élément `<html>`. Tailwind CSS utilise cette classe pour appliquer les styles sombres
- La préférence est sauvegardée dans le localStorage pour persister entre les sessions

## H. Les données mock (mockData.js)

En attendant que le backend soit prêt, on utilise des données fictives stockées directement dans le code pour tester l'application.

**Les données définies :**
- `TAGS` : 6 tags (React, JavaScript, CSS, Node.js, TypeScript, Tutoriel) chacun avec un id, un nom et une couleur
- `EMOJIS` : Les 6 emojis disponibles pour les réactions
- `INITIAL_POSTS` : 4 articles de blog avec titre, contenu, auteur, date, tags et réactions
- `INITIAL_COMMENTS` : 11 commentaires répartis sur les 4 articles
- `AUTHOR_INFO` : Informations de l'auteur pour la page à propos

Les objets suivent une structure qui correspond au modèle de données de la base (décrit dans la partie II) ce qui facilitera la transition vers le backend. Par exemple un commentaire contient `userId` et `postId` qui correspondent aux clés étrangères de la table `comment`.

## I. Le style (Tailwind CSS et index.css)

On utilise Tailwind CSS 4 pour le style de toute l'application. Au lieu d'écrire des fichiers CSS séparés avec des classes personnalisées, on utilise des classes utilitaires directement dans le JSX.

**Exemples de classes utilisées :**
- `bg-white dark:bg-gray-800` : Fond blanc en mode clair, gris foncé en mode sombre
- `text-gray-900 dark:text-white` : Texte foncé en clair, blanc en sombre
- `hover:bg-primary-700` : Couleur de fond au survol
- `md:grid-cols-2` : 2 colonnes à partir de la taille medium (responsive)
- `transition-colors` : Animation de transition sur les changements de couleur

**Le fichier index.css contient :**
- L'import de Tailwind CSS
- La configuration du dark mode avec `@custom-variant`
- La palette de couleurs personnalisée (primary-50 à primary-900) qui est un bleu/cyan
- Les styles globaux du body (fond, couleur de texte, transitions)
- La classe `.line-clamp-5` pour limiter le texte à 5 lignes sur les cartes d'articles

## J. Connexion avec le Backend

Actuellement le frontend fonctionne avec des données fictives (mock). Pour connecter le frontend avec le backend FastAPI, les modifications à effectuer sont les suivantes :

**Pour l'authentification :**
- Remplacer la vérification des `MOCK_USERS` par un appel POST vers `ip/auth/login`
- Stocker le token/session retourné par l'API
- Appeler `ip/auth/me` au chargement pour vérifier la session
- Appeler `ip/auth/logout` à la déconnexion

**Pour les articles :**
- Au chargement de la page d'accueil, appeler GET `ip/posts` pour récupérer la liste des articles
- Pour la page détail, appeler GET `ip/posts/{id}`
- Pour la création, envoyer un POST vers `ip/posts`

**Pour les commentaires :**
- Appeler GET `ip/comments/{id_post}` pour récupérer les commentaires d'un article
- Envoyer un POST vers `ip/comments` pour ajouter un commentaire

**Pour les réactions :**
- Appeler GET `ip/reacts/{id_post}` pour récupérer les réactions d'un article
- Envoyer un POST vers `ip/reacts/{id_post}` pour ajouter une réaction
- Appeler DELETE `ip/reacts/{id}` pour retirer une réaction

La structure du code a été pensée pour que ces modifications soient simples : il suffit de remplacer les données mock par des appels API dans les fonctions existantes (`addPost`, `addComment`, `toggleReaction` dans App.jsx et `login`, `logout` dans AuthContext.jsx).

