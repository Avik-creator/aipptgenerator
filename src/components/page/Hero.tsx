import * as motion from "motion/react-client"
import Link from "next/link";


export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container max-w-6xl mx-auto px-4 text-center relative z-10">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI PowerPoint Generator
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create beautiful presentations in seconds with the power of AI. Choose a theme, describe your topic, and we&apos;ll
          generate professional slides ready to download.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/#generate">
            <motion.button 
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Presentation
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative shapes */}
      <motion.div 
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-pink-500 opacity-20"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-purple-500 opacity-20"
        animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
    </div>
  )
}
