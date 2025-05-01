import {
    Checkbox,
    createTheme,
    Radio,
    Tooltip,
    colorsTuple,
    MantineColorsTuple,
} from '@mantine/core'

type Colors = {
    primary: MantineColorsTuple
    primaryHover: MantineColorsTuple
    secondary: MantineColorsTuple
    white: MantineColorsTuple
    black: MantineColorsTuple

    background: MantineColorsTuple
    backgroundSecondary: MantineColorsTuple
    backgroundTertiary: MantineColorsTuple
    backgroundGray: MantineColorsTuple
    backgroundGrayMedium: MantineColorsTuple
    backgroundWhite: MantineColorsTuple
    backgroundBlue: MantineColorsTuple
    border: MantineColorsTuple

    primaryFont: MantineColorsTuple
    secondaryFont: MantineColorsTuple
    tertiaryFont: MantineColorsTuple
    quaternaryFont: MantineColorsTuple
    fontBlack: MantineColorsTuple

    disabledGray: MantineColorsTuple

    grayExtraDark: MantineColorsTuple
    grayDark: MantineColorsTuple
    grayMedium: MantineColorsTuple
    grayLight: MantineColorsTuple
    grayExtraLight: MantineColorsTuple

    transparent: MantineColorsTuple
}

export const colors: Colors = {
    primary: colorsTuple('var(--primary)'),
    primaryHover: colorsTuple('var(--primary-hover)'),
    secondary: colorsTuple('var(--secondary)'),
    white: colorsTuple('var(--white)'),
    black: colorsTuple('var(--black)'),

    background: colorsTuple('var(--background)'),
    backgroundSecondary: colorsTuple('var(--background-secondary)'),
    backgroundTertiary: colorsTuple('var(--background-tertiary)'),
    backgroundWhite: colorsTuple('var(--background-white)'),
    backgroundGray: colorsTuple('var(--background-gray)'),
    backgroundGrayMedium: colorsTuple('var(--background-gray-medium)'),
    backgroundBlue: colorsTuple('var(--background-blue)'),
    border: colorsTuple('var(--border)'),

    primaryFont: colorsTuple('var(--primary-font)'),
    secondaryFont: colorsTuple('var(--secondary-font)'),
    tertiaryFont: colorsTuple('var(--tertiary-font)'),
    quaternaryFont: colorsTuple('var(--quaternary-font)'),
    fontBlack: colorsTuple('var(--font-black)'),

    disabledGray: colorsTuple('var(--disabled-gray)'),

    grayExtraDark: colorsTuple('var(--gray-extra-dark)'),
    grayDark: colorsTuple('var(--gray-dark)'),
    grayMedium: colorsTuple('var(--gray-medium)'),
    grayLight: colorsTuple('var(--gray-light)'),
    grayExtraLight: colorsTuple('var(--gray-extra-light)'),

    transparent: colorsTuple('var(--transparent)'),
}

const transformMantineColorsToTailwind = (
    colors: Colors,
): Record<string, string> => {
    const transformedColors: Record<string, string> = {}
    for (const [key, value] of Object.entries(colors)) {
        transformedColors[key] = value[0]
    }
    return transformedColors
}

export const mantineColors = transformMantineColorsToTailwind(colors)

const theme = createTheme({
    colors,
    fontFamily: 'Coiny',
    activeClassName: '', // remove button animation onClick
    components: {
        Tooltip: Tooltip.extend({
            defaultProps: {
                color: 'primaryHover',
                withArrow: true,
                keepMounted: false,
            },
        }),
        Checkbox: Checkbox.extend({
            defaultProps: {
                color: 'primary',
            },
        }),
        Radio: Radio.extend({
            defaultProps: {
                color: 'primary',
            },
        }),
    },
})

export default theme
