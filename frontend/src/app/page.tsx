
"use client";

import { Roboto } from "next/font/google";
import { useMemo, useState } from "react";
import "./page.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Category = "Observation" | "Notice";
type Filter = "Everything" | "Observations" | "Notices";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: Category;
  location?: string;
  image?: string;
};

const initialPosts: Post[] = [
  {
    id: "1",
    title: "Beautiful morning at the park",
    content:
      "The trees are starting to change color, and the walking trail was especially peaceful this morning.",
    author: "Jamie",
    date: "Oct 27, 2026",
    category: "Observation",
    location: "Neighborhood park",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Found a lost dog",
    content:
      "A friendly brown dog was spotted near the corner store. Please contact the neighborhood group if you recognize it.",
    author: "Morgan",
    date: "Oct 26, 2026",
    category: "Notice",
    location: "Near the corner store",
  },
  {
    id: "3",
    title: "Sunset over the neighborhood",
    content:
      "The sky turned a beautiful shade of pink and orange this evening.",
    author: "Taylor",
    date: "Oct 25, 2026",
    category: "Observation",
    location: "West side of town",
    image:
      "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Community garden update",
    content:
      "The new flower beds are planted! Thanks to everyone who came out to help this weekend.",
    author: "Alex",
    date: "Oct 24, 2026",
    category: "Observation",
    location: "Community garden",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "A new coffee cart on the block",
    content:
      "There is a small coffee cart near the plaza this week. The owner is friendly, and the smell of fresh coffee reaches halfway down the street.",
    author: "A neighbor",
    date: "4 days ago",
    category: "Observation",
    location: "Neighborhood plaza",
  },
  {
    id: "6",
    title: "Temporary road closure next week",
    content:
      "Road maintenance is scheduled for next Monday morning. Please allow extra time for your commute and follow the posted detour signs.",
    author: "Local update",
    date: "5 days ago",
    category: "Notice",
    location: "Oak Street",
  },
];

const categories: Filter[] = [
  "Everything",
  "Observations",
  "Notices",
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<Filter>("Everything");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [image, setImage] = useState<string>("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("Observation");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        filter === "Everything" ||
        (filter === "Observations" &&
          post.category === "Observation") ||
        (filter === "Notices" && post.category === "Notice");

      const searchableText = [
        post.title,
        post.content,
        post.author,
        post.location ?? "",
        post.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, filter, search]);

  function resetForm() {
    setTitle("");
    setContent("");
    setCategory("Observation");
    setAuthor("");
    setLocation("");
    setImage("");
  }

  function closeModal() {
    setIsModalOpen(false);
    resetForm();
  }

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImage("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    // Limit images to 5 MB for this prototype.
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(String(reader.result));
    };

    reader.onerror = () => {
      alert("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  function publishPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      return;
    }

    const newPost: Post = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || "Anonymous",
      date: new Date().toLocaleString(),
      category,
      location: location.trim() || undefined,
      image: image || undefined,
    };

    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setFilter("Everything");
    setSearch("");
    closeModal();
  }

  return (
    <main className="page">
      <header className="header">
        <h1 className={`site-title ${roboto.className}`}>
          Around Here
        </h1>

        <p className="header-description">
          A community notice board for local discoveries, helpful
          updates, and things happening around the neighborhood.
        </p>
      </header>

      <section className="toolbar" aria-label="Feed controls">
        <nav className="filters" aria-label="Filter posts">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </nav>

        <label className="search-box">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search local posts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search local posts"
          />

          {search && (
            <button
              className="clear-search"
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>

        <button
          className="create-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add a post
        </button>
        {selectedPost && (
          <div
            className="modal-backdrop detail-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedPost(null);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSelectedPost(null);
              }
            }}
          >
            <article
              className="modal detail-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="detail-post-title"
            >
              <button
                type="button"
                className="detail-close"
                onClick={() => setSelectedPost(null)}
                aria-label="Close post details"
              >
                ×
              </button>

              {selectedPost.image && (
                <img
                  className="detail-image"
                  src={selectedPost.image}
                  alt={`Image for ${selectedPost.title}`}
                />
              )}

              <span className="post-category">
                {selectedPost.category}
              </span>

              <h2 id="detail-post-title">{selectedPost.title}</h2>

              <p className="detail-content">{selectedPost.content}</p>

              {selectedPost.location && (
                <div className="detail-info">
                  <span className="detail-label">Location</span>
                  <span>{selectedPost.location}</span>
                </div>
              )}

              <div className="detail-info">
                <span className="detail-label">Posted by</span>
                <span>{selectedPost.author}</span>
              </div>

              <div className="detail-info">
                <span className="detail-label">Date and time</span>
                <time>{selectedPost.date}</time>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setSelectedPost(null)}
                >
                  Back to board
                </button>
              </div>
            </article>
          </div>
        )}
      </section>

      <section aria-label="Community posts">
        {filteredPosts.length > 0 ? (
          <div className="feed">
            {filteredPosts.map((post) => (
              <article
                className={`post-card ${post.image ? "has-image" : ""}`}
                key={post.id}
                role="button"
                tabIndex={0}
                aria-label={`Open post: ${post.title}`}
                onClick={() => setSelectedPost(post)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedPost(post);
                  }
                }}
              >
                {post.image && (
                  <div className="post-card-image">
                    <img src={post.image} alt="" loading="lazy" />
                  </div>
                )}

                <div className="post-card-body">
                  <span className="post-category">{post.category}</span>

                  <h2>{post.title}</h2>

                  <p className="post-excerpt">{post.content}</p>

                  {post.location && (
                    <div className="post-location">
                      <span aria-hidden="true">⌖ </span>
                      {post.location}
                    </div>
                  )}

                  <footer className="post-meta">
                    <span>{post.author}</span>
                    <time>{post.date}</time>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No posts found</h2>
            <p>
              Try another search or category, or add a new community
              post.
            </p>
          </div>
        )}
      </section>

      <footer className="site-footer">
        <p>
          Around Here · A place for the little things happening nearby.
        </p>
      </footer>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-modal-title"
          >
            <div className="modal-heading">
              <h2 id="post-modal-title">Pin something to the board</h2>

              <p className="modal-description">
                Share a local observation or let your neighbors know
                about something important.
              </p>
            </div>

            <form className="post-form" onSubmit={publishPost}>
              <div className="form-field">
                <label htmlFor="post-category">Post type</label>

                <select
                  id="post-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as Category)
                  }
                >
                  <option value="Observation">Observation</option>
                  <option value="Notice">Notice</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="post-title">Title</label>

                <input
                  id="post-title"
                  type="text"
                  placeholder="What is happening around here?"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={120}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="post-content">Details</label>

                <textarea
                  id="post-content"
                  placeholder="Share the details with your neighbors..."
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  maxLength={3000}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="post-location">
                  Location <span>(optional)</span>
                </label>

                <input
                  id="post-location"
                  type="text"
                  placeholder="Street, park, or nearby landmark"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  maxLength={160}
                />
              </div>

              <div className="form-field">
                <label htmlFor="post-author">
                  Author name <span>(optional)</span>
                </label>

                <input
                  id="post-author"
                  type="text"
                  placeholder="Leave blank to post anonymously"
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="form-field">
                <label htmlFor="post-image">Attach an image (optional)</label>

                <input
                  id="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {image && (
                  <div className="image-preview">
                    <img src={image} alt="Preview of your attached image" />

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setImage("");
                        const input = document.getElementById(
                          "post-image"
                        ) as HTMLInputElement | null;

                        if (input) input.value = "";
                      }}
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button
                  className="cancel-button"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button className="create-button" type="submit">
                  Pin to board
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
