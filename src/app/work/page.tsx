"use client";

import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management and Stripe integration.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    color: "from-violet-600 to-purple-600",
    link: "#",
    github: "#",
  },
  {
    title: "AI Dashboard",
    description: "Real-time analytics dashboard with AI-powered insights and customizable visualizations.",
    tags: ["React", "D3.js", "Python", "TensorFlow"],
    color: "from-cyan-600 to-blue-600",
    link: "#",
    github: "#",
  },
  {
    title: "Social Media App",
    description: "A modern social platform with real-time messaging and content sharing features.",
    tags: ["React Native", "Firebase", "Node.js"],
    color: "from-pink-600 to-rose-600",
    link: "#",
    github: "#",
  },
  {
    title: "Portfolio CMS",
    description: "A headless CMS for managing portfolios with Markdown support and API-first design.",
    tags: ["Astro", "Sanity", "GraphQL"],
    color: "from-amber-600 to-orange-600",
    link: "#",
    github: "#",
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
  visible: { opacity: 1, y: 0 },
};

export default function WorkPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Selected Work
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            A collection of projects that showcase my skills in web development,
            from concept to deployment.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm"
                whileHover={{
                  y: -8,
                  borderColor: "rgba(139, 92, 246, 0.5)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                </div>

                <div className="relative p-8">
                  <div className="flex gap-4 mb-4">
                    <motion.a
                      href={project.github}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Globe size={20} />
                    </motion.a>
                    <motion.a
                      href={project.link}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
