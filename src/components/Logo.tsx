import { motion } from 'framer-motion'

interface LogoProps {
  size?: number
  animate?: boolean
  className?: string
}

const Logo = ({ size = 100, animate = false, className = '' }: LogoProps) => {
  const LogoSVG = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFA940" />
          <stop offset="50%" stopColor="#52C41A" />
          <stop offset="100%" stopColor="#13C2C2" />
        </linearGradient>
      </defs>
      
      {/* Círculo externo com gradiente */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="url(#logoGradient)"
        opacity="0.9"
      />
      
      {/* Círculo interno escuro */}
      <circle
        cx="100"
        cy="100"
        r="75"
        fill="#0A1929"
        stroke="#0A1929"
        strokeWidth="3"
      />
      
      {/* Pessoa humanizada - cabeça */}
      <path
        d="M 100 50 
           C 95 50, 90 55, 90 60
           C 90 65, 95 70, 100 70
           C 105 70, 110 65, 110 60
           C 110 55, 105 50, 100 50 Z"
        fill="#52C41A"
      />
      
      {/* Braços/coração */}
      <path
        d="M 70 90
           Q 65 85, 65 95
           Q 65 110, 100 140
           Q 135 110, 135 95
           Q 135 85, 130 90
           L 100 115
           Z"
        fill="#52C41A"
      />
      
      {/* Contorno do círculo */}
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#0A1929"
        strokeWidth="6"
      />
    </svg>
  )

  if (animate) {
    return (
      <motion.div
        animate={{
          boxShadow: [
            '0 0 20px rgba(82, 196, 26, 0.3)',
            '0 0 60px rgba(82, 196, 26, 0.6)',
            '0 0 20px rgba(82, 196, 26, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="rounded-full inline-block"
      >
        {LogoSVG}
      </motion.div>
    )
  }

  return <div className="inline-block">{LogoSVG}</div>
}

export default Logo;
