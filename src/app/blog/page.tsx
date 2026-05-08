"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Building a Real-time Dashboard with Next.js and WebSockets",
    excerpt:
      "Learn how to build a real-time analytics dashboard using Next.js, WebSockets, and D3.js for beautiful data visualizations.",
    date: "2024-03-15",
    tags: ["Next.js", "WebSockets", "D3.js"],
    readTime: "8 min read",
    color: "from-violet-600 to-purple-600",
  },
  {
    id: 2,
    title: "Creating Immersive Audio Experiences with the Web Audio API",
    excerpt:
      "Explore the Web Audio API to build custom audio players, visualizers, and interactive sound experiences for the web.",
    date: "2024-03-08",
    tags: ["Web Audio", "JavaScript", "Creative"],
    readTime: "12 min read",
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: 3,
    title: "Mastering Framer Motion: Advanced Animation Patterns",
    excerpt:
      "Take your React animations to the next level with advanced Framer Motion patterns including shared layouts and gestures.",
    date: "2024-02-28",
    tags: ["React", "Framer Motion", "Animation"],
    readTime: "10 min read",
    color: "from-pink-600 to-rose-600",
  },
  {
    id: 4,
    title: "Three.js for Beginners: Creating 3D Web Experiences",
    excerpt:
      "A comprehensive introduction to Three.js, covering scene setup, lighting, materials, and interactive 3D graphics.",
    date: "2024-02-20",
    tags: ["Three.js", "3D", "WebGL"],
    readTime: "15 min read",
    color: "from-amber-600 to-orange-600",
  },
  {
    id: 5,
    title: "TypeScript Best Practices for Large-scale Applications",
    excerpt:
      "Essential TypeScript patterns and practices for building maintainable, type-safe applications at scale.",
    date: "2024-02-12",
    tags: ["TypeScript", "Architecture"],
    readTime: "11 min read",
    color: "from-emerald-600 to-teal-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Technical Blog
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Thoughts on development, design, and the creative process
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className="relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                whileHover={{
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <div className="absolute inset-0">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                </div>

                <div className="relative p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center gap-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 group-hover:text-violet-300 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <motion.span
                      className="flex items-center gap-2 text-sm font-medium text-violet-400"
                      whileHover={{ x: 4 }}
                    >
                      Read More
                      <ArrowRight size={16} />
                    </motion.span>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                />
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
