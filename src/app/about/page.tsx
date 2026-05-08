"use client";

import { motion } from "framer-motion";
import { Mail, Music, Code, Camera, Globe } from "lucide-react";

const skills = [
  { icon: Code, label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { icon: Music, label: "Audio", items: ["Ableton Live", "FL Studio", "Web Audio API"] },
  { icon: Camera, label: "Tools", items: ["Git", "Docker", "Figma", "VS Code"] },
];

const timeline = [
  { year: "2024", event: "Started exploring music production and sound design" },
  { year: "2023", event: "Focused on React ecosystem and modern web development" },
  { year: "2022", event: "Deep dive into TypeScript and backend development" },
  { year: "2021", event: "Began journey as a full-stack developer" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-violet-600 via-cyan-600 to-pink-600 p-1"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
              <span className="text-5xl">👨‍💻</span>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I'm a passionate developer and music creator based in China. I love building
            beautiful web experiences and crafting unique sounds. When I'm not coding,
            you'll find me experimenting with synthesizers or exploring new production techniques.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <motion.a
              href="#"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Globe size={24} />
            </motion.a>
            <motion.a
              href="#"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="text-gray-300">Skills & </span>
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
                whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
              >
                <skill.icon
                  size={32}
                  className="mb-4 text-violet-400"
                />
                <h3 className="text-lg font-semibold mb-4">{skill.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="text-gray-300">My </span>
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-cyan-500 to-pink-500" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                    <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 inline-block ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}>
                      <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        {item.year}
                      </span>
                      <p className="text-gray-400 mt-2">{item.event}</p>
                    </div>
                  </div>

                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-violet-500 border-4 border-[#0a0a0f] transform -translate-x-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
