import { forwardRef, ReactNode } from 'react'
import { Button, ButtonProps, createPolymorphicComponent } from '@mantine/core'
import cx from 'clsx'

import styles from './BrandButton.module.css'
import BGPattern from '@/assets/bgPattern.png'

type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'whiteOutline'
    | 'whiteFilled'
    | 'danger'
    | 'success'

interface GradientConfig {
    from: string
    to: string
    deg?: number
}

interface CustomButtonProps extends ButtonProps {
    children: ReactNode
    variant?: ButtonVariant
    isGradient?: boolean
    className?: string
    borderWidth?: number
    borderColor?: string
    patternImage?: string
    isPattern?: boolean
    gradient?: GradientConfig
}

const BrandButton = createPolymorphicComponent<'button', CustomButtonProps>(
    forwardRef<HTMLButtonElement, CustomButtonProps>(
        (
            {
                children,
                variant = 'primary',
                className,
                borderWidth,
                borderColor,
                patternImage,
                isPattern = false,
                isGradient = false,
                gradient = { from: 'blue', to: 'red', deg: 90 },
                style,
                ...others
            },
            ref,
        ) => {
            const variantClass = cx(
                styles.button,
                {
                    [styles.primary]: variant === 'primary',
                    [styles.secondary]: variant === 'secondary',
                    [styles.danger]: variant === 'danger',
                    [styles.success]: variant === 'success',
                    [styles.tertiary]: variant === 'tertiary',
                    [styles.whiteOutline]: variant === 'whiteOutline',
                    [styles.whiteFilled]: variant === 'whiteFilled',
                },
                className,
            )

            let gradientBackground = isGradient
                ? `linear-gradient(${gradient.deg}deg, ${gradient.from}, ${gradient.to})`
                : 'none'

            variant == 'primary' && isGradient
                ? (gradientBackground = `linear-gradient(90deg, #8d2eff, #6829b3)`)
                : (gradientBackground = gradientBackground)
            variant == 'secondary' && isGradient
                ? (gradientBackground = `linear-gradient(90deg, #FFCC33, #FFB347)`)
                : (gradientBackground = gradientBackground)

            const patternBackground = isPattern
                ? `url(${patternImage || BGPattern})`
                : 'none'

            const combinedBackground = isGradient
                ? `${patternBackground}, ${gradientBackground}`
                : patternBackground

            return (
                <Button
                    className={variantClass}
                    style={{
                        borderWidth: borderWidth ?? 6,
                        borderColor:
                            variant == 'primary'
                                ? '#6829B3'
                                : variant == 'secondary'
                                ? '#ffb347'
                                : borderColor ?? '#6829B3',
                        fontFamily: 'Catamaran Bold',
                        backgroundImage: combinedBackground,
                        backgroundSize: 'cover, cover',
                        backgroundPosition: 'center, center',
                        backgroundRepeat: 'no-repeat, no-repeat',
                        maskImage: isPattern
                            ? 'linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))'
                            : 'none',
                        WebkitMaskImage: isPattern
                            ? 'linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))'
                            : 'none',
                        opacity: isPattern ? 0.9 : 1,
                        ...style,
                    }}
                    {...others}
                    ref={ref}
                >
                    {children}
                </Button>
            )
        },
    ),
)

export default BrandButton
