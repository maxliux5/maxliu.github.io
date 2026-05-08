"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Music, Code, PenLine } from "lucide-react";

const categories = [
  {
    icon: Code,
    title: "Web Development",
    description: "Modern web applications built with React, Next.js, and more",
    href: "/work",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Music,
    title: "Music Production",
    description: "Original compositions and sound design projects",
    href: "/music",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: PenLine,
    title: "Technical Blog",
    description: "Thoughts on development, design, and technology",
    href: "/blog",
    color: "from-pink-500 to-rose-600",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <span className="inline-block px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-sm text-violet-400 font-medium">
            Developer & Music Creator
          </span>
        </motion.div>

        <motion.h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <span className="block text-gray-300">Hello, I'm</span>
          <span className="block bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Liu Huadong
          </span>
        </motion.h1>

        <motion.p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          I craft digital experiences through code and sound, turning ideas into
          immersive web applications and captivating music.
        </motion.p>

        <motion.div className="flex gap-4 justify-center mb-20" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <Link href="/work">
            <motion.button
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-medium text-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              View My Work
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              className="px-8 py-4 border border-white/20 rounded-xl font-medium text-lg hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              About Me
            </motion.button>
          </Link>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
          {categories.map((category) => (
            <Link key={category.title} href={category.href}>
              <motion.div
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
                whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.3)" }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <category.icon size={40} className={`mb-4 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-300 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
