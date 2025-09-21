import { memo, forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    'ghost-danger': 'text-gray-400 hover:text-red-600 hover:bg-red-50 focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  }
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    icon: 'h-4 w-4'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
          )}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default memo(Button)