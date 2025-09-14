import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ 
  size = 'md', 
  className,
  color = 'primary',
  text,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-slate-600',
    white: 'border-white',
    success: 'border-green-600',
    warning: 'border-yellow-600',
    danger: 'border-red-600'
  };

  const spinner = (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-3",
      fullScreen && "min-h-screen",
      className
    )}>
      <motion.div
        className={cn(
          "border-4 border-t-transparent rounded-full",
          sizeClasses[size],
          colorClasses[color],
          "border-opacity-20"
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          borderTopColor: 'transparent'
        }}
      >
        <motion.div
          className={cn(
            "border-4 border-transparent rounded-full",
            sizeClasses[size],
            colorClasses[color]
          )}
          animate={{ rotate: -360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            borderTopColor: 'currentColor',
            borderRightColor: 'currentColor'
          }}
        />
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-slate-600 dark:text-slate-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
